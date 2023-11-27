from .serializers import PostSerializer, CategoriesSerializer
from .models import Post, Categories
from django.shortcuts import render
from rest_framework import generics
from rest_framework import permissions
from user_profile.permissions import IsOwnerOrReadOnly
from rest_framework import status, viewsets
from rest_framework.response import Response
class PostViewSet(viewsets.ModelViewSet):
    """
    Posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        query_parameter = self.request.query_params
        if not query_parameter:
            return self.queryset
        
        owner_value = query_parameter.get("owner", None)
        if owner_value is not None:
            return self.queryset.filter(owner=owner_value)
        else:
            return self.queryset.none()

class CategoryViewSet(viewsets.ModelViewSet):
    '''
    categories
    '''
    queryset = Categories.objects.all()
    serializer_class =  CategoriesSerializer
    