from .models import Comment
from rest_framework import permissions
from user_profile.permissions import IsOwnerOrReadOnly
from rest_framework import status, viewsets

from . serializers import CommentSerializer
from rest_framework.response import Response


# Create your views here.
class CommentViewSet(viewsets.ModelViewSet):
    """Comments"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                       IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
        
    def get_queryset(self):
        qs = self.queryset
        query_parameter = self.request.query_params
        if not query_parameter:
            return Comment.objects.all()
        
        return qs.filter(post=query_parameter["post"])