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
    x= all_followers(author)['items']
    for i in x:
        if i['id'].split('/')[-1] == follower:
            return {'following': 'True'}
    return {'following': 'False'}

def comment_to_json(comment):
    id_string="http://127.0.0.1:8000/service/author/"+str(comment.owner)+"/posts/"+str(comment.post.id)+"/comments/"+str(comment.id)
    response = {
        "type":"comment",
        "author":author_to_json(comment.owner, UserProfile.objects.get(owner=comment.owner)),
        "comment":comment.comment,
        "contentType":"text/markdown",
        "published":comment.post_date_time,
        "id": id_string
    }
    return response

def get_comments(post):
    id_string="http://127.0.0.1:8000/service/author/"+str(post.owner)+"/posts/"+str(post.id)
    response = { 
        "type":"comments",
        "page":1,
        "size":0,
        "post":id_string,
        "id":id_string,
        "comments":[],
    }
    for comment in Comment.objects.all():
        if str(comment.post) == str(post.id):
            response['comments'].append(comment_to_json(comment))
    response['size'] = len(response['comments'])
    return response

def post_to_json(post): 
    print("here")
    id_string="http://127.0.0.1:8000/service/author/"+str(post.owner)+"/posts/"+str(post.id)
    comment_string ="http://127.0.0.1:8000/service/author/"+str(post.owner)+"/posts/"+str(post.id)+"/comments"
    response = {
        "type":"post",
        "title":post.title,
        "id": id_string,
        "source":post.source,
        "origin":post.origin,
        "description":post.description,
        "contentType":"text/plain",
        "content":post.content,
        "author":author_to_json(post.owner, UserProfile.objects.get(owner=post.owner)),
        # "categories": [category.category for category in post.category_part.all()]
        "count": 0, 
        "comments":comment_string,
        "commentsSrc": get_comments(post),
        "published":post.post_date_time,
        "visibility":post.visibility,
        "unlisted": post.post_image
    }
    response['count'] = len(response['commentsSrc']['comments'])
    return response

def get_specific_post(requested_author, requested_post):
    post = Post.objects.get(id=requested_post)
    if str(post.owner) == str(requested_author):
        response = {'type': 'single post', 'post': post_to_json(post)}

    return response

def all_posts(requested_author):
    all_posts = Post.objects.all()
    response = {'type': 'all posts', 'items': []}
    for post in all_posts:
        if str(post.owner) == str(requested_author):
            response['items'].append(post_to_json(post))
    return response
    
def get_image(requested_author, requested_post):
    post = Post.objects.get(id=requested_post)
    if str(post.owner) == str(requested_author):
        if post.post_image == None:
            return {'image': 'no image'}
        return {'image': post.post_image}

def get_likes_post(post):
    print(post)
    all_likes = Vote.objects.all()
    post_name = post.title
    post_owner = post.owner
    summary = "Likes for " + str(post_name) + " by " + str(post_owner)
    object_string= "http://127.0.0.1:8000/service/author/"+str(post.owner)+"/posts/"+str(post.id)
    response = {
        'type': 'likes',
        'summary': summary,
        'count': 0,
        'items': [],
        'object': object_string
    }
    for like in all_likes:
        if like.post == post:
            response['items'].append(author_to_json(like.up_vote_by, UserProfile.objects.get(owner=like.up_vote_by)))
    response['count'] = len(response['items'])
    return response

def get_likes_comments(comment):
    all_likes = Vote.objects.all()
    comment_name = comment.comment
    comment_owner = comment.owner
    summary = "Likes for " + str(comment_name) + " by " + str(comment_owner)
    object_string= "http://127.0.0.1:8000/service/author/"+str(comment.owner)+"/posts/"+str(comment.id)
    response = {
        'type': 'likes',
        'summary': summary,
        'count': 0,
        'items': [],
        'object': object_string
    }
    for like in all_likes:
        if like.comment == comment:
            response['items'].append(author_to_json(like.up_vote_by, UserProfile.objects.get(owner=like.up_vote_by)))
    response['count'] = len(response['items'])
    return response

def get_liked(requested_author):
    response = {'type': 'liked', 'items': []}
    all_likes = Vote.objects.all()
    for like in all_likes:
        if like.up_vote_by.username == requested_author:
            response['items'].append(post_to_json(like.post))
    return response

def get_inbox(requested_author):
    user_with_username = User.objects.get(username=requested_author)
    author_profile = UserProfile.objects.get(owner=user_with_username)
    response = {
        "type": "inbox",
        "author": f"http://127.0.0.1:8000/service/author/{requested_author}",
        "items": []
    }
    posts = Post.objects.filter(message_to=author_profile)
    for post in posts:
        response['items'].append(post_to_json(post))
    return response


def GET_request(request):
    # print(request.path)
    print("split: ", request.path.split('/'))
    response = {'status': '1'}  # Set a default value for response
    path = request.path.split('/')
    for i in path:
        if i == '':
            path.remove(i)
    print(path)
    # http://127.0.0.1:8000/service/author
    if path[-1] == 'authors':
        response = all_authors()
    # http://127.0.0.1:8000/service/author/{author_id}/
    elif path[-2] == 'authors': 
        response = specific_author(path[-1])
    # http://127.0.0.1:8000/service/author/{author_id}/followers
    elif path[-1] == 'followers': #done
        response = all_followers(path[-2])
    # http://127.0.0.1:8000/service/author/{author_id}/followers/{author_id_2}
    elif path[-2] == 'followers': #done
        response = check_follower(path[-3],path[-1])
    # http://127.0.0.1:8000/service/author/{author_id}/posts
    elif path[-1] == 'posts':
        response = all_posts(path[-2])
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}
    elif path[-2] == 'posts':
        response = get_specific_post(path[-3], path[-1])
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments
    elif path[-3] == 'posts' and path[-1] == 'comments':
        response = get_comments(Post.objects.get(id=path[-2]))
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments/{comment_id}
    elif path[-4] == 'posts' and path[-2] == 'comments':
        response = comment_to_json(Comment.objects.get(id=path[-1]))
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/image
    elif path[-3] == 'posts' and path[-1] == 'image':
        response = get_image(path[-4], path[-2])
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/likes
    elif path[-3] == 'posts' and path[-1] == 'likes':
        response = get_likes(Post.objects.get(id=path[-2]))
    # http://127.0.0.1:8000/service/author/{author_id}/liked
    elif path[-1] == 'liked':
        response = get_likes_post(path[-2])
    # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments/{comment_id}/likes
    elif path[-3] == 'comments' and path[-1] == 'likes':
        response = get_likes_comments(Comment.objects.get(id=path[-2]))
    # http://127.0.0.1:8000/service/author/{author_id}/inbox
    elif path[-1] == 'inbox':
        response = get_inbox(path[-2])


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

