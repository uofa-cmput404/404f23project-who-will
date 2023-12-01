from .serializers import PostSerializer, CategoriesSerializer
from .models import Post, Categories
from user_profile.models import *
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
import json

class PostViewSet(viewsets.ModelViewSet):
    """
    Posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        actor_profile = UserProfile.objects.filter(owner=self.request.user)
        print(actor_profile[0].id)
        print("after create")


    def get_post_team_good(self):
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
            print(json.dumps(master_posts[0], indent = 4))

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
        return refactored_external_api_data

    def httpacademy(self):
        refactored_external_api_data=[]
        return refactored_external_api_data    

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
        refactored_external_api_data = self.get_post_team_good()
        if refactored_external_api_data != []:
            combined_data = refactored_external_api_data + local_serializer.data
        else:
            combined_data = local_serializer.data
        
    
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
    