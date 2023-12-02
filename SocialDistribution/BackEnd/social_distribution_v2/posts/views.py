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
        # OrderedDict([('content', 'ss'), 
        # ('description', 'ss'),
        #  ('title', 'ss'), 
        # ('source', 's'), 
        # ('origin', 's'), 
        # ('visibility', 'public'),
        #  ('owner', <CustomUser: rayna>)])
        data_dict = serializer.validated_data
        transformed_data = {
            "type":"post"
        }
        
        # title 
        transformed_data["title"] = data_dict["title"] if "title" in data_dict else None

        # TODO: id
        transformed_data["source"] = data_dict["source"] if "source" in data_dict else "https://whoiswill-7ef8b333cade.herokuapp.com/admin/"
        transformed_data["origin"] = data_dict["origin"] if "origin" in data_dict else "https://whoiswill-7ef8b333cade.herokuapp.com/admin/"
        transformed_data["description"] = data_dict["description"] if "description" in data_dict else None
        transformed_data["contentType"] = data_dict["contentType"] if "contentType" in data_dict else "text/plain"
        transformed_data["content"] = data_dict["content"] if "content" in data_dict else None
        
        # author 
        author_val = {
             "type":"author"
        }

        info = None
        if "owner" in data_dict: 
            owner = data_dict["owner"]  # display name: rayna
            profile_data = UserProfile.objects.filter(owner=owner) #<QuerySet [<UserProfile: rayna>]>
            serialized_profile = serialize('json', profile_data) 
            profile_json= json.loads(serialized_profile)[0]
            
            info = profile_json["fields"]  # json
            author_val["id"] = "http://127.0.0.1:8000/authors/"+info["id"]
            author_val["host"] = "http://127.0.0.1:8000/"
            author_val["displayName"] = owner.username  # this does not work
            author_val["url"] = "http://127.0.0.1:8000/authors/"+info["id"]
            author_val["github"] =info["github"]
            author_val["profileImage"] = info["profile_image"]

        transformed_data["author"] = author_val

        # categories
        transformed_data["categories"] = data_dict["categories"] if "categories" in data_dict else None

        # counts
        transformed_data["count"] = len(data_dict["comments"]) if "comments" in data_dict else 0

        # comments
        saved_post = serializer.save(owner=self.request.user)  # return: the new post id
        post_data = serializer.to_representation(saved_post)
        saved_post_id = post_data['id']
        
        # transformed_data["comments"] ="http://127.0.0.1:8000/authors/"+ info["id"]+"/posts/"+ saved_post_id+"/comments"

        transformed_data["comments"] = data_dict["comments"] if "comments" in data_dict else []
        
        # id
        transformed_data["id"] ="http://127.0.0.1:8000/authors/"+ info["id"]+"/posts/"+ saved_post_id

        # published (*)
        transformed_data["published"] = post_data["post_date_time"]

        # visibility (*)
        transformed_data["visibility"] = data_dict["visibility"].upper()

        # unlisted
        transformed_data["unlisted"] = data_dict["unlisted"] if "unlisted" in data_dict else False # not sure
        
        print("after create")
        self.send_post_to_server(transformed_data)
    
    def send_post_to_server(self, transformed_data): 
        print("______________________")
        print(json.dumps(transformed_data, indent=4))
        print("______________________")


        # post_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/posts/"

        # username = "http@gmail.com"
        # passward = "http"

        # # Send a POST request to the server
        # try:
        #     response = requests.post(post_url, json = transformed_data, auth=(username,passward))

        #     # Check the response
        #     if response.status_code == 201:
        #         print("Post created successfully on the server.")
        #     else:
        #         print("Failed to create the post on the server.")
        #         print(response.status_code)
        #         print(response.text)
        # except:
        #     print("error")


        csrf_token_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/authors/login"
        login_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/authors/user"
        post_url = "https://cmput404-httpacademy2-1c641b528836.herokuapp.com/posts/"
        session = requests.Session()
        print("Session:", session)

        # credentials
        email = "admin@email.com"
        password = "admin"


        # Get CSRF token
        csrf_response = session.post(
            csrf_token_url, json={'email': email, "password": password})
        print("CSRF Response Status Code:", csrf_response.status_code)
        print("CSRF Response JSON:", csrf_response.json())

        csrf_token = csrf_response.json().get('csrf_token')
        print("CSRF Token:", csrf_token)


        header = {
            'X-CSRFToken': csrf_token
        }

        # Login request
        login_response = session.get(login_url, headers=header)
        print("Login Response Status Code:", login_response.status_code)

        post_response = session.post(post_url, json=transformed_data, headers={
            'X-CSRFToken': csrf_token,
            'Referer': csrf_token_url
        })

        if post_response.status_code == 200:
            print("post call successful!")
            # THIS IS THE DATA TO RETRIEVE
            print("post Response JSON:", json.dumps(post_response.json(), indent=4))
            # Check if the user exists and has a valid password

        else:
            # debugging stuff
            print(f"API call failed with status code: {post_response.status_code}")
            print("Login Response Text:", post_response.text)
            # Print out the response headers and cookies for debugging
            print("Response Headers:", post_response.headers)
            print("Response Cookies:", len(post_response.cookies))


    
        
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
    