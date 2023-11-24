from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User  # Make sure to import User
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

    # def update(self, request, pk):
    #     profile = get_object_or_404(UserProfile, pk=pk)
    #     serializer = ProfileSerializer(profile, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, pk):
        print(1,"here")
        profile = get_object_or_404(UserProfile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            # Check if 'follow_request' is in the request data
            if 'follow_request' in request.data:
                to_user_profile_id = request.data['follow_request']
                to_user_profile = get_object_or_404(UserProfile, pk=to_user_profile_id)
                profile.send_follow_request(to_user_profile)
                return Response({'message': 'Follow request sent successfully.'}, status=status.HTTP_200_OK)

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        profile = get_object_or_404(UserProfile, pk=pk)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


    @action(detail=True, methods=['put'])
    def update_profile(self, request, pk=None):
        print("2,here")
        profile = get_object_or_404(UserProfile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)