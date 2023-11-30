from .serializers import PostSerializer, CategoriesSerializer
from .models import Post, Categories
from django.shortcuts import render
from rest_framework import generics
from rest_framework import permissions
from user_profile.permissions import IsOwnerOrReadOnly
from rest_framework import status, viewsets
from rest_framework.response import Response
from .serializers import PostSerializer, CategoriesSerializer
import requests
from requests.auth import HTTPBasicAuth
from rest_framework.views import APIView
from django.contrib.auth.models import User

from django.core.serializers import serialize
from django.http import JsonResponse
# from ..user_profile import UserProfile

# from social_distribution_v2.user_profile.serializers import ProfileSerializer

import json

class PostViewSet(viewsets.ModelViewSet):
    """
    Posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # post 
        print(serializer.validated_data)
        data_dict = serializer.validated_data

        transformed_data = {
            "type":"post"
        }
        transformed_data["title"] = data_dict["title"] if "title" in data_dict else None
        # TODO: id
        # postId = data_dict["id"]
        transformed_data["origin"] = data_dict["origin"] if "origin" in data_dict else None
        transformed_data["source"] = data_dict["source"] if "source" in data_dict else None
        transformed_data["description"] = data_dict["description"] if "description" in data_dict else None
        transformed_data["contentType"] = data_dict["contentType"] if "contentType" in data_dict else "text/plain"
        transformed_data["content"] = data_dict["content"] if "content" in data_dict else None

        # TODO: author
        #         {
        #     "id": 1,
        #     "username": "rayna",
        #     "is_active": true,
        #     "profile_data": {
        #         "id": 1,
        #         "owner": "rayna",
        #         "gender": "male",
        #         "dob": null,
        #         "phone": null,
        #         "github": null,
        #         "profile_image": null,
        #         "follow_requests": [
        #             2
        #         ],
        #         "following": [
        #             2
        #         ]
        #     }
        # },
        author_val = {
             "type":"author"
        }
        if "owner" in data_dict: 
            username = data_dict["owner"]  # display name: admin 
            user_data = User.objects.all().filter(username=username)#<QuerySet [<User: admin>]>

            serialized_users = serialize('json', user_data) 
            user_dict_list = json.loads(serialized_users)
            user_json_data = user_dict_list[0]  # this is the json format of user information 

            pk=user_json_data["pk"]
            # TODO: user the pk to get the profile 


            
            # user_profile = ProfileSerializer.objects.get(owner=user)  # Get the UserProfile associated with the user

            # # Serialize the UserProfile instance to JSON
            # profile_serializer = ProfileSerializer(user_profile)
            # serialized_profile_data = profile_serializer.data

            # print(serialized_profile_data)

            # TODO: get user(author) id 

        # TODO: categories
        transformed_data["count"] = len(data_dict["comments"]) if "comments" in data_dict else 0

        # comments
        # comment_url = "http://127.0.0.1:5454/authors/"+userId+"/posts/"+postId+"/comments"

        serializer.save(owner=self.request.user)

    def list(self, request):
        # TODO NOT DONE
        print("Grabbing all posts from everyone")
        # print(request.path)
        ending= request.path.split('/')[-1]
        # print(ending)
        # Implement your logic for retrieving a list of posts
        queryset = self.get_queryset()
        local_serializer = self.get_serializer(queryset, many=True)
        serializer = self.get_serializer(queryset, many=True)
        # print(local_serializer.data)
        # print(json.dumps(local_serializer.data, indent = 4))



        external_api_url = "https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/"
        external_api_response = requests.get(
            external_api_url,
            auth=HTTPBasicAuth('whoiswill', 'cmput404')
        )

        if external_api_response.status_code == 200:
            # Deserialize the external API response
            external_api_data = external_api_response.json()
            # print(1,external_api_data['items'])
            all_authors = []
            master_posts = []
            for i in external_api_data['items']:
                all_authors.append(i['key'])
            # print(2,all_authors)
            for i in all_authors:
                # print("----------------------------- author -----------------------------")
                # print(i)
                # print("----------------------------- author -----------------------------")
                all_post_external_api_url = f"https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/{i}/posts/"
                all_post_external_api_response = requests.get(
                    all_post_external_api_url,
                    auth=HTTPBasicAuth('whoiswill', 'cmput404')
                )
                all_authors_external_api_data = all_post_external_api_response.json()
                # for j in all_authors_external_api_data['items']:
                #     master_posts.append(j)
                # print("-----------------------------")
                if all_authors_external_api_data['items'] == []:
                    pass
                else:
                    for j in all_authors_external_api_data['items']:
                        master_posts.append(j)
                    # print(json.dumps(all_authors_external_api_data, indent = 4))
                # print("-----------------------------")
            # print()
            # print(3,master_posts)
            # print()
            # print(f"the lens of master_posts is {len(master_posts)}")
            # print(json.dumps(master_posts[0], indent = 4))

            refactored_external_api_data = []
            for i in master_posts:
                refactored_external_api_data.append(    
                {
                    "id": i['key'],
                    "comments": [],
                    "votes": [],
                    "content": i['content'],
                    "description": i['description'],
                    "post_image": None,
                    "post_date_time": "2023-11-27T16:32:25Z",
                    "title": i['title'],
                    "source": i['source'],
                    "origin": i['origin'],
                    "visibility": i['visibility'].lower(),
                    "owner": i['author']['key'],
                    "message_to": None,
                    "categories": []
                })
            # team === good send



            # Combine external and internal data
            combined_data = refactored_external_api_data + local_serializer.data
        return Response(combined_data)

    def retrieve(self, request, pk):
        print("retrieve")
        # Implement your logic for retrieving a single post by ID
        post = self.get_object()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    '''
    categories
    '''
    queryset = Categories.objects.all()
    serializer_class =  CategoriesSerializer
    