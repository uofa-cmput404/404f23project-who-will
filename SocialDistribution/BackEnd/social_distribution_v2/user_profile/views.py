from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from user_profile.models import UserProfile
from .serializers import ProfileSerializer

class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = UserProfile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  # Assuming you want to associate the profile with the current user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        queryset = UserProfile.objects.all()
        profile = get_object_or_404(queryset, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def update(self, request, pk):
        profile = get_object_or_404(UserProfile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        profile = get_object_or_404(UserProfile, pk=pk)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
