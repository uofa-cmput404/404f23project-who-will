from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User  # Make sure to import User
from user_profile.models import UserProfile, CustomUser
from .serializers import ProfileSerializer, CustomUserSerializer
import json
import uuid


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class ProfileViewSet(viewsets.ViewSet):
    def partial_update(self, request, pk=None):
        # Similar to your update method, retrieve the profile object
        profile = get_object_or_404(UserProfile, pk=pk)
        
        # Apply partial updates using the data from the request
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def list(self, request):
        queryset = UserProfile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Assuming you want to associate the profile with the current user
            serializer.save(owner=request.user)
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
        try:
            print(request)
            x = request.path.split('/')
            if x[-1] == '':
                x.pop()
            to_follow = x[-1]
            to_do = request.data
            print(to_do)
            response = {'message': ''}
            if to_do['add_follow_request'] != 'None':
                follower_id = to_do['add_follow_request']
                to_follow_profile = get_object_or_404(
                    UserProfile, pk=to_follow)
                follower = get_object_or_404(UserProfile, pk=follower_id)
                to_follow_profile.follow_requests.add(follower)
                response['message'] += f"'{follower}' added to '{to_follow_profile}' follow requests."

            if to_do['delete_follow_request'] != 'None':
                follower_id = to_do['delete_follow_request']
                to_follow_profile = get_object_or_404(
                    UserProfile, pk=to_follow)
                follower = get_object_or_404(UserProfile, pk=follower_id)
                to_follow_profile.follow_requests.remove(follower)
                response['message'] += f"'{follower}' removed from '{to_follow_profile}' follow requests."

            if to_do['add_following'] != 'None':
                follower_id = to_do['add_following']
                to_follow_profile = get_object_or_404(
                    UserProfile, pk=to_follow)
                # Add the follower to 'follow_requests'
                follower = get_object_or_404(UserProfile, pk=follower_id)
                to_follow_profile.following.add(follower)
                response['message'] += f"'{follower}' added to '{to_follow_profile}' followers."

            if to_do['delete_following'] != 'None':
                follower_id = to_do['delete_following']
                to_follow_profile = get_object_or_404(
                    UserProfile, pk=to_follow)
                follower = get_object_or_404(UserProfile, pk=follower_id)
                to_follow_profile.following.remove(follower)
                response['message'] += f"'{follower}' removed from '{to_follow_profile}' followers."

            if response['message'] == '':
                response['message'] = 'Invalid request data.'
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            return Response(response, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)
        # follower_id = request.data.get('add')
        # # print("Request Body:", request.data)  # Added this line to print the request body
        # # Ensure that 'to_follow' and 'follower_id' are not None
        # if to_follow is not None and follower_id is not '':
        #     # Get the UserProfile identified by 'to_follow'
        #     to_follow_profile = get_object_or_404(UserProfile, pk=to_follow)

        #     # Add the follower to 'follow_requests'
        #     follower = get_object_or_404(UserProfile, pk=follower_id)
        #     to_follow_profile.follow_requests.add(follower)

        #     print(to_follow, "followed by", follower_id)
        #     return Response({'message': 'Follow request added successfully.'}, status=status.HTTP_200_OK)
        # else:
        #     return Response({'error': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)
        # profile = get_object_or_404(UserProfile, pk=pk)
        # serializer = ProfileSerializer(profile, data=request.data)
        # if serializer.is_valid():
        #     # Check if 'follow_request' is in the request data
        #     if 'follow_request' in request.data:
        #         to_user_profile_id = request.data['follow_request']
        #         to_user_profile = get_object_or_404(UserProfile, pk=to_user_profile_id)
        #         profile.send_follow_request(to_user_profile)
        #         return Response({'message': 'Follow request sent successfully.'}, status=status.HTTP_200_OK)

        #     serializer.save()
        #     return Response(serializer.data)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


class GetRequestersView(APIView):
    def get(self, request):
        pk = request.GET.get('id', '')
        pk = uuid.UUID(pk, version=4)
        user_profile = UserProfile.objects.all().filter(owner=pk)
        print(user_profile[0])
        requests = user_profile[0].follow_requests.all()
        following = user_profile[0].following.all()
        profiles =  requests.difference(following)
        serialized_users = [{'profile_id':profile.id, 'owner':profile.owner.username} for profile in profiles]
        return Response(serialized_users)

class GetFriendsView(APIView):
    def get(self, request):
        pk = request.GET.get('id', '')
        pk = uuid.UUID(pk, version=4)
        user_profile = UserProfile.objects.filter(owner=pk)
        requests = user_profile[0].follow_requests.all()
        following = user_profile[0].following.all()
        profiles =  requests.intersection(following)
        serialized_users = [{'profile_id':profile.id, 'owner':profile.owner.username} for profile in profiles]
        return Response(serialized_users)
        
