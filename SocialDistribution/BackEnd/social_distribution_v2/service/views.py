from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from posts.models import *
from user_profile.models import *
from comments.models import *
from votes.models import *
import requests
# Create your views here.
def works(request):
    # return hello world
    print(request)
    if request.method == 'GET':
        x = GET_request(request)
    if request.method == 'POST':
        x = POST_request(request)
    if request.method == 'PUT':
        x = PUT_request(request)
    if request.method == 'DELETE':
        x = DELETE_request(request)
    return x
    # return HttpResponse("Hello, world. You're at the polls index.")

def author_to_json(user, user_profile):
    return {
        "type": "author",
        "id": f"http://127.0.0.1:/service/author/{user.username}",
        "url": f"http://127.0.0.1:/service/author/{user.username}",
        "host": "http://127.0.0.1:8000/",
        "displayName": f"{user.first_name} {user.last_name}",
        "github": user_profile.github,
        "profileImage": "image"
    }

def all_authors():
    response = {'type': 'author', 'items': []}
    for user in User.objects.all():
        user_profile = UserProfile.objects.get(owner=user.id)
        response['items'].append(author_to_json(user, user_profile))
    return response

def specific_author(requested_author):
    user_with_username = User.objects.get(username=requested_author)
    user_profile = UserProfile.objects.get(owner=user_with_username)
    response = author_to_json(user_with_username, user_profile)
    return response

def all_followers(requested_author):
    user_with_username = User.objects.get(username=requested_author)
    user_profile = UserProfile.objects.get(owner=user_with_username)
    response = {'type': 'followers', 'items': []}
    followers = []
    all_user_profiles = UserProfile.objects.all()
    for profile in all_user_profiles:
        for i in profile.following.all():
            if str(i.owner) == str(requested_author):
                followers.append(str(profile))
    proper_followers = []
    for i in followers:
        x=User.objects.get(username=i)
        y = UserProfile.objects.get(owner=x)
        proper_followers.append(author_to_json(x, y))
    response['items'] = proper_followers
    return response

def check_follower(author, follower):
    print(author)
    print(follower)
    x= all_followers(author)['items']
    print(x)
    for i in x:
        if i['id'].split('/')[-1] == follower:
            return {'following': 'True'}
    return {'following': 'False'}

def comment_to_json(comment):
    return {1}

def get_comments(post):
    # "commentsSrc": {
    #     "type":"comments",
    #     "page":1,
    #     "size":5,
    #     "post":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e",
    #     "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments",
    #     "comments":[
    #         {
    #             "type":"comment",
    #             "author":{
    #                 "type":"author",
    #                 "id":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
    #                 "url":"http://127.0.0.1:5454/authors/1d698d25ff008f7538453c120f581471",
    #                 "host":"http://127.0.0.1:5454/",
    #                 "displayName":"Greg Johnson",
    #                 "github": "http://github.com/gjohnson",
    #                 "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
    #             },
    #             "comment":"Sick Olde English",
    #             "contentType":"text/markdown",
    #             "published":"2015-03-09T13:07:04+00:00",
    #             "id":"http://127.0.0.1:5454/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
    #         }
    #     ]
    # },
    return {1}

def post_to_json(post): 
    post = Post.objects.get(id=post.id)
    response = {
        "type":"post",
        "title":post.title,
        "id":f"http://127.0.0.1:8000/service/author/{post.owner}/posts/{post.id}",
        "source":post.source,
        "origin":post.origin,
        "description":post.description,
        "contentType":"text/plain",
        "content":post.content,
        "author":author_to_json(post.owner, UserProfile.objects.get(owner=post.owner)),
        "categories":[post.categories],
        "count": 1023, #TODO: fix this
        "comments":"http://127.0.0.1:8000/service/author/{post.owner}/posts/{post.id}/comments",
        "commentsSrc": get_comments(post),
        "published":post.post_date_time,
        "visibility":post.visibility,
        "unlisted": post.post_image
# {
#         "unlisted":false
#     }
    }
    return response



def all_posts(requested_author):
    all_posts = Post.objects.all()
    response = {'type': 'all posts', 'items': []}
    for post in all_posts:
        if str(post.owner) == str(requested_author):
            response['items'].append(post_to_json(post))
    return response
    


def GET_request(request):
    print(request.path)
    print("split: ", request.path.split('/'))
    if request.path == '/service/authors/': #done
        response = all_authors()
    elif request.path.split('/')[-2] == 'authors': #done
        response = specific_author((request.path.split('/'))[-1])
    elif request.path.split('/')[-1] == 'followers': #done
        response = all_followers(request.path.split('/')[-2])
    elif request.path.split('/')[-2] == 'followers': #done
        response = check_follower(request.path.split('/')[-3],request.path.split('/')[-1])
    elif request.path.split('/')[-1] == 'posts':
        response = all_posts(request.path.split('/')[-2])
    return JsonResponse(response)

def POST_request(request):
    print(request)
    return JsonResponse({'status': '2'})

def PUT_request(request):
    print(request)
    return JsonResponse({'status': '3'})

def DELETE_request(request):
    print(request)
    return JsonResponse({'status': '4'})

