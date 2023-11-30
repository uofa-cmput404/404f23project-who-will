from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from user_profile.models import CustomUser
from user_profile.serializers import *
from .serializers import UserSerializer
import requests
from requests.auth import HTTPBasicAuth
from rest_framework.views import APIView


class UserViewSet(viewsets.ViewSet):
    basename='users'

    def follower_to_following(self):
        external_api_url = "https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/"
        external_api_response = requests.get(
            external_api_url,
            auth=HTTPBasicAuth('whoiswill', 'cmput404')
        )
        external_api_data = external_api_response.json()
        follower={}
        following={}
        for i in external_api_data['items']:
            follower[i['key']] = []
            following[i['key']] = []
        for i in follower.keys():
            # print(i)
            external_api_url = f"https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/{i}/followers/"
            external_api_response = requests.get(
                external_api_url,
                auth=HTTPBasicAuth('whoiswill', 'cmput404')
            )
            external_api_data = external_api_response.json()
            for j in external_api_data['items']:
                path = (j['id']).split('/')
                path = [i for i in path if i != '']
                # print(path)
                pk = path[-1]
                follower[i].append(pk)

            for j in follower.keys():
                follower[j] = list(set(follower[j]))
                for x in follower[j]:
                    following[x].append(j)

        # print("printing follower")
        # print(follower)
        # print("printing following")
        # print(following)
        print(following['53829888-346a-47ef-a7cf-f5dd82d3b598'])
        return following



    def list(self, request):
        # team === good start
        external_api_url = "https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/"
        external_api_response = requests.get(
            external_api_url,
            auth=HTTPBasicAuth('whoiswill', 'cmput404')
        )
        following_master_list = self.follower_to_following()
        # local_users = User.objects.all()
        local_users = CustomUser.objects.all()
        # local_serializer = UserSerializer(local_users, many=True)
        local_serializer = CustomUserSerializer(local_users, many=True)
        # Check if the external API call was successful (status code 200)
        if external_api_response.status_code == 200:
            # Deserialize the external API response
            external_api_data = external_api_response.json()
            # print(external_api_data['results'])
            refactored_external_api_data = []
            for i in external_api_data['items']:
                refactored_external_api_data.append(
                    {
                        "id": i['key'],
                        "username": i['key'],
                        "is_active": 'true',
                        "profile_data": {
                            "id": i['user'],
                            "owner": i['key'],
                            "gender": None,
                            "dob": None,
                            "phone": None,
                            "github": i['github'],
                            "profile_image": None,
                            "follow_requests": [],
                            "following": following_master_list[i['key']]
                        }
                    }
                )
            # team === good send



            # Combine external and internal data
            combined_data = refactored_external_api_data + local_serializer.data

            return Response(combined_data)
        elif local_serializer.data:
            return Response(local_serializer.data)
        else:
            # Handle the case when the external API call fails
            return Response(
                {"error": "Failed to fetch external data"},
                status=external_api_response.status_code
            )

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk):
        # todo followers
        print("1herere")
        following_master_list = self.follower_to_following()
        try:
            # Try to get the user from the local database using pk
            # user = User.objects.get(pk=pk)
            user = CustomUser.objects.get(pk=pk)
            # serializer = UserSerializer(user)
            serializer = CustomUserSerializer(user)
            print(1, serializer.data)
            return Response(serializer.data)
        # except (User.DoesNotExist, ValueError):
        except (CustomUserSerializer.DoesNotExist, ValueError):
            print(request.path)
            path = request.path.split('/')
            path = [i for i in path if i != '']
            print(path)
            pk = path[-1]
            print("pk is", pk)
            try:
                # Try to get the user from the external API using the adjusted pk
                external_api_url = f"https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/{pk}/"
                print(external_api_url)
                external_api_response = requests.get(
                    external_api_url,
                    auth=HTTPBasicAuth('whoiswill', 'cmput404')
                )

                if external_api_response.status_code == 200:
                    # Deserialize the external API response
                    external_user_data = external_api_response.json()
                    
                    # Transform external API data into the desired format
                    transformed_data = {
                        'id': external_user_data['key'],
                        'username': external_user_data['displayName'],
                        'is_active': 'true',
                        'profile_data': {
                            'id': external_user_data['key'],
                            'owner': external_user_data['displayName'],
                            'gender': None,
                            'dob': None,
                            'phone': None,
                            'github': external_user_data.get('github'),
                            'profile_image': None,
                            'follow_requests': [],
                            'following': following_master_list[external_user_data['key']]
                        }
                    }

                    return Response(transformed_data)
                else:
                    return Response(
                        {"error": f"Failed to fetch external data for user {pk}"},
                        status=external_api_response.status_code
                    )
            except Exception as e:
                # Handle other exceptions that might occur during the external API call
                return Response(
                    {"error": f"Failed to fetch external data for user {pk}: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
   
    def update(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
