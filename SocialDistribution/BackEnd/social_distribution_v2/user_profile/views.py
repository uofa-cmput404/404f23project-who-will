from user_profile.models import UserProfile
from rest_framework import viewsets, permissions, filters
from . permissions import IsOwnerOrReadOnly
from . serializers import ProfileSerializer
from rest_framework.response import Response

# Create your views here.

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly]
    def get_queryset(self):
        query_params = self.request.query_params
        
        return UserProfile.objects.filter(owner__username__contains=query_params['owner'])
    

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
