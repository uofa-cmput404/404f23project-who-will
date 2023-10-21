from django.shortcuts import render, get_object_or_404 
from rest_framework import viewsets, status
from . serializers import UserSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User

class UserViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    def create(self,request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def retrive(self, request, pk=None):
        queryset = User.objects.all()
        user=get_object_or_404(queryset, pk=pk)
        print(user)
        serializer = UserSerializer(user)
        return Response(serializer.data)