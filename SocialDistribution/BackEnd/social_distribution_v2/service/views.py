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
from user_profile.models import CustomUser
import requests
import json



# for the token
from django.middleware.csrf import get_token


OUR_URL="https://whowill-22f35606f344.herokuapp.com"

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrf_token": csrf_token})

# Create your views here.
@csrf_exempt
def works(request):
    # return hello world
    # print(1,request)
    try:    
        if request.method == 'GET':
            x = GET_request(request)
        if request.method == 'POST':
            x = POST_request(request)
        if request.method == 'PUT':
            x = PUT_request(request)
        if request.method == 'DELETE':
            x = DELETE_request(request)
    except:
        x = {'status': 'error'} 
    return x
    # return HttpResponse("Hello, world. You're at the polls index.")

def author_to_json(user, user_profile):
    return {
        "type": "author",
        "id": f"{OUR_URL}/service/author/{user.id}",
        "url": f"{OUR_URL}/service/author/{user.id}",
        "host": OUR_URL,
        "displayName": f"{user.username}",
        "github": user_profile.github,
        "profileImage": user_profile.profile_image
    }

def all_authors():
    response = {'type': 'author', 'items': []}
    # print("all_authors()\n")
    for user in CustomUser.objects.all():
        print(1,user)
        user_profile = UserProfile.objects.get(owner=user.id)
        print(user_profile)
        response['items'].append(author_to_json(user, user_profile))
    return response

def specific_author(requested_author):
    user_with_username = CustomUser.objects.get(user_id=requested_author)
    user_profile = UserProfile.objects.get(owner=user_with_username)
    response = author_to_json(user_with_username, user_profile)
    return response

def all_followers(requested_author):
    user_with_username = CustomUser.objects.get(username=requested_author)
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
        x=CustomUser.objects.get(username=i)
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
    id_string=OUR_URL+"/service/author/"+str(comment.owner)+"/posts/"+str(comment.post.id)+"/comments/"+str(comment.id)
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
    id_string=OUR_URL+"/service/author/"+str(post.owner)+"/posts/"+str(post.id)
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
    id_string=OUR_URL+"/service/author/"+str(post.owner)+"/posts/"+str(post.id)
    comment_string =OUR_URL+"/service/author/"+str(post.owner)+"/posts/"+str(post.id)+"/comments"
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
    object_string= OUR_URL+"/service/author/"+str(post.owner)+"/posts/"+str(post.id)
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
    object_string= OUR_URL+"/service/author/"+str(comment.owner)+"/posts/"+str(comment.id)
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
    user_with_username = CustomUser.objects.get(id=requested_author)
    author_profile = UserProfile.objects.get(owner=user_with_username)
    response = {
        "type": "inbox",
        "author": f"{OUR_URL}/service/author/{requested_author}",
        "items": []
    }
    posts = Post.objects.filter(message_to=author_profile)
    for post in posts:
        response['items'].append(post_to_json(post))
    return response

def GET_request(request):
    # print(request.path)
    print("split: ", request.path.split('/'))
    response = {'status': 'error'}  # Set a default value for response
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
    # # http://127.0.0.1:8000/service/author/{author_id}/followers/{author_id_2}
    # elif path[-2] == 'followers': #done
    #     response = check_follower(path[-3],path[-1])
    # # http://127.0.0.1:8000/service/author/{author_id}/posts
    # elif path[-1] == 'posts':
    #     response = all_posts(path[-2])
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}
    # elif path[-2] == 'posts':
    #     response = get_specific_post(path[-3], path[-1])
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments
    # elif path[-3] == 'posts' and path[-1] == 'comments':
    #     response = get_comments(Post.objects.get(id=path[-2]))
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments/{comment_id}
    # elif path[-4] == 'posts' and path[-2] == 'comments':
    #     response = comment_to_json(Comment.objects.get(id=path[-1]))
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/image
    # elif path[-3] == 'posts' and path[-1] == 'image':
    #     response = get_image(path[-4], path[-2])
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/likes
    # elif path[-3] == 'posts' and path[-1] == 'likes':
    #     response = get_likes(Post.objects.get(id=path[-2]))
    # # http://127.0.0.1:8000/service/author/{author_id}/liked
    # elif path[-1] == 'liked':
    #     response = get_likes_post(path[-2])
    # # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments/{comment_id}/likes
    # elif path[-3] == 'comments' and path[-1] == 'likes':
    #     response = get_likes_comments(Comment.objects.get(id=path[-2]))
    # # http://127.0.0.1:8000/service/author/{author_id}/inbox
    elif path[-1] == 'inbox':
        response = get_inbox(path[-2])


    return JsonResponse(response)

def post_user(user_id, request):
    try:
        #all_users = User.objects.all()
        all_users = CustomUser.objects.all()
    except:
        return {'status': 'error retrieving users'}
    found = False
    print("-------------------------------------")
    
    for user in all_users:
        print("-------------------------------------")
        print(f" username -------> {user.username}")
        if user.username == user_id:
            found = True

            user_profile = UserProfile.objects.get(owner=user.id)
            data = json.loads(request.body.decode('utf-8'))
            user.first_name = data['displayName'].split()[0]
            user.last_name = data['displayName'].split()[-1]
            user_profile.github = data['github']
            user_profile.profile_image = data['profileImage']
            user.save()
            user_profile.save()
            return {'status': 'UPDATED USER'}

    if not found:
        print("-------------------------------------")
        try:
            print("-----------first here-------------")
            # Decode the JSON data from the request body
            data = json.loads(request.body.decode('utf-8'))
            print("----------here----------------")
            print(data)

            # Splitting the displayName using spaces
            name = data['displayName']

            print(f"display name ---> {name}")

            # Make a new user object
            try:
                print(f"All the inputs ---> {user_id}, {name}")
                new_user = CustomUser.objects.create(username=name, password="password")
                new_user.save()
                print("USER CREATED?!?")
            except:
                return {'status': 'failed to create new user'}

            new_user_profile = UserProfile(
                owner=new_user,
                github=data['github'],
                profile_image=data['profileImage'],
            )
            new_user_profile.save()

            return {'status': 'New User Created!'}
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return {'status': 'error'}
# Your existing POST_request function

def Post_post(request,path):
    print(5,request)
    # get all post
    # get a specific post
    try:
        post=Post.objects.get(foreign=path[-1]) 
    except:
        return {'status': 'failed to find post to edit'}
    
    try:
        data = json.loads(request.body.decode('utf-8'))
    except:
        return {'status': 'failed to load sent data'}
    try: 
        print(f"data -----> {data}")        
        post.title = data['title']
        post.source = data['source']
        post.origin = data['origin']
        post.description = data['description']
        #post.categories = data['categories']
        post.visibility = data['visibility']
        post.content = data['content']
        post.post_image = data['unlisted']
        # post.message_to = data['message_to']
        post.save()
        return {'status': 'post edited'}
    except:
        return {'status': 'post found, failed to make edits'}
    # if Post.objects.get(id=path[-1]):
    #     print("post exists")
    # else:
    #     print("post does not exist")



def post_new_post(request,path):
    print(path[-2])
    try:
        author=CustomUser.objects.get(user_id=path[-2])
    except:
        return {'status': 'failed to find user'}
    try:
        # make new post
        post=Post.objects.create(owner=author)
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        post.title = data['title']
        post.source = data['source']
        post.origin = data['origin']
        post.description = data['description']
        post.visibility = data['visibility']
        post.content = data['content']
        post.post_image = data['unlisted']
        #NOTE: Update required to make these work
        # post.message_to = data['message_to']
        # post.categories = data['categories']
        post.save()
        print("-------------- POST ADDED?? -----------")
        return {'status': 'Post Added Successfully'}
    except:
        return {'status': 'Error in creating post'}

def post_new_comment(request,path):
    author=CustomUser.objects.get(username=path[-4])
    post=Post.objects.get(id=path[-2])
    comment=Comment.objects.create(owner=author,post=post)
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    comment.comment = data['comment']
    comment.save()
    return {'status': '2'}

def POST_request(request):
    print(2, request)
    print("split: ", request.path.split('/'))
    response = {'status': 'error'}  # Set a default value for response
    path = request.path.split('/')
    for i in path:
        if i == '':
            path.remove(i)
    print(path)
    # http://127.0.0.1:8000/service/author/{author_id}/
    if path[-2] == 'authors':
        print("sending to post_user")
        x = post_user(path[-1], request)
    elif path[-2] == 'posts':
        x = Post_post(request,path)
    elif path[-1] == 'posts':
        print("sending to post_new_post")
        #This is for creating completely new posts
        x = post_new_post(request,path)
    elif path[-1] == 'new_post':
        x = post_new_comment(request,path)
    elif path[-1] == 'inbox':
        x = determine_type(request, path)
    else:
        x = {'status': 'error in parsing post request'}
    # like to author/{}/inbox... TODO!
    
    return JsonResponse(x)

def PUT_request(request):
    print(request)
    return JsonResponse({'status': '3'})

def DELETE_request(request):

    # delete_post(request)
    print(request)
    path = request.path.split('/')
    for i in path:
        if i == '':
            path.remove(i)
    if path[-2] == 'posts':
        x = delete_post(path)

    return JsonResponse(x)

def delete_post(path):
    #NOTE: When a post is deleted, so is are the comments and likes.
    #TODO: account for comments and likes

    print("--------------------------delete_post----------------------------")

    print(f"The path given = {path} ")
    post_id = path[-1]
    print(f"postid = {post_id}")

    try:
        #NOTE: If two posts have the same foreign, then they create an error when deleting
        post = Post.objects.get(foreign=post_id)
        print("Successfully retrieved post")
        try:
            post.delete()
            print("Successfully deleted post")
            return {'status': 'Post deleted successfully'}
        except:
            print("Failed to delete post")
            return {'status': 'Error deleting post'}
    except:
        print("Failed to retrieve database")
        return {'status': 'Could not find post in database'}


def PATCH_request(request):
    print("PATCH REQUEST REGISTERED")
    print(request)
    path = request.path.split('/')
    for i in path:
        if i == '':
            path.remove(i)
    print(path)
    if path[-2] == "posts":
        x = patch_post(request, path)
    else:
        x = {'status': 'incorrect patch format'}
    return JsonResponse(x)


def patch_post(request, path):
    print(request)
    print(path)
    print("PATCHING POST!!!!")

    try:
        post=Post.objects.get(id=path[-1]) 
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        post.title = data['title']
        post.source = data['source']
        post.origin = data['origin']
        post.description = data['description']
        post.visibility = data['visibility']
        post.content = data['content']
        post.post_image = data['unlisted']
        #post.message_to = data['message_to']
        #post.categories = data['categories']
        post.save()
        return {'status': 'worked'}
    except:
        print("post could not be found")
        return {'status': 'post could not be found'}


def determine_type(request, path):
    print("DETERMINING TYPE ----------------------")
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    print(data["type"])
    if data["type"] == "Like":
        print("LIKE TYPE")
        x = post_like(request, path)
    elif data["type"] == "post":
        print("post TYPE")
        x = {'status': 'NOT IMPLEMENTED YET!'}
    elif data["type"] == "Follow":
        print("Follow type")
        x = {'status': 'NOT IMPLEMENTED YET!'}
    elif data["type"] == "comment":
        print("Comment type")
        x = {'status': 'NOT IMPLEMENTED YET!'}
    else:
        x = {'status': 'field type is not correct'}
    return x

def post_like(request, path):
    print("Entered post_like()")
    data = json.loads(request.body.decode('utf-8'))
    try:
        user_id = path[-2]
        print(f"THE USER ID ------> {user_id}")

    except:
        return {'status': 'could not splice data to obtain post id'}
    try:
        post = data['object']
        post_id = post.split('/')[-1]
        print(f"post id --> {post_id}")
    except:
        return {'status': 'could not splice data to obtain post id'}
    try:
        userObject = CustomUser.objects.get(user_id=user_id)
    except:
        return {'status': 'could not retrieve associated user'}
    try:
        postObject = Post.objects.get(id=post_id)
    except:
        return {'status': 'could not retreive associated post'}
    try:
        vote = Vote.objects.create(post=postObject, up_vote_by=userObject)
        try:
            vote.save()
        except:
            print("failed to save")
            return {'status': 'vote failed to save'}
        return {'statis': 'vote added!'}

    except:
        return {'status': 'vote failed to create with user'}
