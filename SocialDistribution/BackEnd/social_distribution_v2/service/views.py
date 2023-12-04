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
    print("get_csrf_token()")
    csrf_token = get_token(request)
    return JsonResponse({"csrf_token": csrf_token})

# Create your views here.
@csrf_exempt
def works(request):
    print("works()")
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
    print("author_to_json()")
    try:
        return {
            "type": "author",
            "id": f"{OUR_URL}/service/author/{user.id}",
            "url": f"{OUR_URL}/service/author/{user.id}",
            "host": OUR_URL,
            "displayName": f"{user.username}",
            "github": user_profile.github,
            "profileImage": user_profile.profile_image
        }
    except:
        return {'status': 'error'}

def all_authors():
    print("all_authors()")
    try:
        response = {'type': 'author', 'items': []}
        # print("all_authors()\n")
        for user in CustomUser.objects.all():
            user_profile = UserProfile.objects.get(owner=user.id)
            response['items'].append(author_to_json(user, user_profile))
        return response
    except:
        return {'status': 'error'}

def specific_author(requested_author):
    print("specific_author()")
    try:
        user_with_username = CustomUser.objects.get(user_id=requested_author)
        user_profile = UserProfile.objects.get(owner=user_with_username)
        response = author_to_json(user_with_username, user_profile)
        return response
    except:
        return {'status': 'error'}

def all_followers(requested_author):
    print("all_followers()")
    try:
        user_with_username = CustomUser.objects.get(id=requested_author)
        user_profile = UserProfile.objects.get(owner=user_with_username)
        response = {'type': 'followers', 'items': []}
        followers = []
        all_user_profiles = UserProfile.objects.all()
        for profile in all_user_profiles:
            for i in profile.following.all():
                if str(i.id) == str(requested_author):
                    followers.append(str(profile))
        proper_followers = []
        for i in followers:
            x=CustomUser.objects.get(username=i)
            y = UserProfile.objects.get(owner=x)
            proper_followers.append(author_to_json(x, y))
        response['items'] = proper_followers
        return response
    except:
        return {'status': 'error'}

def check_follower(author, follower):
    print("check_follower()")
    try:
        x = all_followers(author)['items']
        for i in x:
            if i['id'].split('/')[-1] == follower:
                return {'following': 'True'}
        return {'following': 'False'}
    except:
        return {'status': 'error'}

def comment_to_json(comment):
    print("comment_to_json()")
    try:
        id_string=OUR_URL+"/service/author/"+str(comment.owner.id)+"/posts/"+str(comment.post.id)+"/comments/"+str(comment.id)
        response = {
            "type":"comment",
            "author":author_to_json(comment.owner, UserProfile.objects.get(owner=comment.owner)),
            "comment":comment.comment,
            "contentType":"text/markdown",
            "published":comment.post_date_time,
            "id": id_string
        }
        return response
    except:
        return {'status': 'error'}

def get_comments(post):
    print("get_comments()")
    try:
        id_string=OUR_URL+"/service/author/"+str(post.owner.id)+"/posts/"+str(post.id)
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
    except:
        return {'status': 'error'}

def post_to_json(post): 
    print("post_to_json()")
    try:
        id_string=OUR_URL+"/service/author/"+str(post.owner.id)+"/posts/"+str(post.id)
        comment_string =OUR_URL+"/service/author/"+str(post.owner.id)+"/posts/"+str(post.id)+"/comments"
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
    except:
        return {'status': 'error'}

def get_specific_post(requested_author, requested_post):
    print("get_specific_post()")
    try:
        post = Post.objects.get(id=requested_post)
        user = CustomUser.objects.get(id=requested_author)
        if str(post.owner) == str(user):
            response = {'type': 'single post', 'post': post_to_json(post)}

        return response
    except:
        return {'status': 'error'}

def all_posts(requested_author):
    print("all_posts()")
    try:
        user = CustomUser.objects.get(id=requested_author)
        all_posts = Post.objects.all()
        response = {'type': 'all posts', 'items': []}
        for post in all_posts:
            if str(post.owner) == str(user):
                response['items'].append(post_to_json(post))
        return response
    except:
        return {'status': 'error'}
    
def get_image(requested_author, requested_post):
    print("get_image()")
    try:
        post = Post.objects.get(id=requested_post)
        if str(post.owner.id) == str(requested_author):
            if post.post_image == None:
                return {'image': 'no image'}
            return {'image': post.post_image}
    except:
        return {'status': 'error'}


def get_likes_post(post):
    print("get_likes_post()")
    try:
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
    except:
        return {'status': 'error'}

def get_likes_comments(comment):
    print("get_likes_comments()")
    try:
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
    except:
        return {'status': 'error'}

def get_liked(requested_author):
    print("get_liked()")
    try:
        response = {'type': 'liked', 'items': []}
        all_likes = Vote.objects.all()
        for like in all_likes:
            if like.up_vote_by.username == requested_author:
                response['items'].append(post_to_json(like.post))
        return response
    except:
        return {'status': 'error'}

def get_inbox(requested_author):
    print("get_inbox()")
    try:
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
    except:
        return {'status': 'error'}  

def get_all_liked(requested_author):
    print("get_all_liked()")
    try:
        user_with_username = CustomUser.objects.get(id=requested_author)
        author_profile = UserProfile.objects.get(owner=user_with_username)
        response = {
            "type": "liked",
            "items": []
        }
        liked = Vote.objects.filter(up_vote_by=user_with_username)
        for i in liked:
            if i.post:
                object_string= OUR_URL+"/service/author/"+str(i.post.owner)+"/posts/"+str(i.post.id)
                small_response = {
                    "@context": "Liked",
                    "summary": "Like for post",
                    "author": author_to_json(i.up_vote_by, UserProfile.objects.get(owner=i.up_vote_by)),
                    "object": object_string,
                }
                response['items'].append(small_response)
            elif i.comment:
                object_string= OUR_URL+"/service/author/"+str(i.comment.owner)+"/posts/"+str(i.comment.post.id)+"/comments/"+str(i.comment.id)
                small_response = {
                    "@context": "Liked",
                    "summary": "Like for comment",
                    "author": author_to_json(i.up_vote_by, UserProfile.objects.get(owner=i.up_vote_by)),
                    "object": object_string,
                }
                response['items'].append(small_response)
        return response
    except:
        return {'status': 'error'}


def GET_request(request):
    print("GET_request()")
    try:
        # print(request.path)
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
            print("getting comment")
            response = comment_to_json(Comment.objects.get(id=path[-1]))
        # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/image
        elif path[-3] == 'posts' and path[-1] == 'image':
            response = get_image(path[-4], path[-2])
        # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/likes
        elif path[-3] == 'posts' and path[-1] == 'likes':
            print("getting likes")
            response = get_likes_post(Post.objects.get(id=path[-2]))
        # http://127.0.0.1:8000/service/author/{author_id}/liked
        elif path[-1] == 'liked':
            response = get_all_liked(path[-2])
        # http://127.0.0.1:8000/service/author/{author_id}/posts/{post_id}/comments/{comment_id}/likes
        elif path[-3] == 'comments' and path[-1] == 'likes':
            response = get_likes_comments(Comment.objects.get(id=path[-2]))
        # # http://127.0.0.1:8000/service/author/{author_id}/inbox
        elif path[-1] == 'inbox':
            response = get_inbox(path[-2])
    except:
        response = {'status': 'error'}

    return JsonResponse(response)

def post_user(user_id, request):
    print("post_user()")
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
                new_user = CustomUser.objects.create(foreign = user_id, is_foreign = True, username=name, password="anything")
                user.set_password("anything")
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
    print("Post_post()")
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
    print("post_new_post()")
    try:
        author = CustomUser.objects.get(foreign=path[-2])
    except:
        return {'status': 'failed to find user'}

    try:
        data = json.loads(request.body.decode('utf-8'))
    except:
        return {'status': 'failed to retrieve data'}
    
    try:
        post_foreign_id = data['id'].split('/')
        for i in post_foreign_id:
            if i == '':
                post_foreign_id.remove(i)
        post_foreign_id = post_foreign_id[-1]
    except:
        return {'status': 'failed to retrieve foreign post id'}


    try:
        # make new post
        post=Post.objects.create(owner=author, foreign=post_foreign_id)
    except:
        return {'status': 'Error in creating post'}
    
    try:
        post.title = data['title']
    except:
        print("Title not avaiable from json data")
        
    try:
        post.source = data['source']
    except:
        print("Source not avaiable from json data")

    try:
        post.origin = data['origin']
    except:
        print("Origin not avaiable from json data")

    try:
        post.description = data['description']
    except:
        print("description not avaiable from json data")
    try:
        post.visibility = data['visibility']
    except:
        print("Visibility not avaiable from json data")
    
    try:
        post.content = data['content']
    except:
        print("content not avaiable from json data")

    try:
        post.post_image = data['unlisted']
    except:
        print("image not avaiable from json data")
    #NOTE: Update required to make these work
    # post.message_to = data['message_to']
    # post.categories = data['categories']

    try:
        post.save()
    except:
        print("failed to add post")
        return {'status': 'failed to save the post'}

    print("-------------- POST ADDED?? -----------")
    return {'status': 'Post Added Successfully'}

def post_new_comment(request,path):
    try:
        print(f"path ---> {path}")
        author=CustomUser.objects.get(foreign=path[-4])
    except:
        return {'status': 'failed to retireve user object'}
    
    try:
        data = json.loads(request.body.decode('utf-8'))
    except:
        return {'status': 'failed to load data'}

    try:
        post=Post.objects.get(foreign=path[-2])
        comment=Comment.objects.create(owner=author,post=post)
        data = json.loads(request.body.decode('utf-8'))
        comment.comment = data['comment']
        comment.save()
        return {'status': 'comment successfully added'}
    except:
        return {'status' : 'failed to save comment'}
        

def post_follow_request(request):
    print("Post_follow_request()")
    try:
        data = json.loads(request.body.decode('utf-8'))
    except:
        return {'status': 'failed to load data'}

    print(f"\n\n\n\ {data} \n\n\n")
    try:
        print(" 'can you put a print 0 ontop of that' ")
        auth_asking_follow = data['actor']['id']
        print("1")
        auth_being_followed = data['object']['id']
        print("2")
        auth_asking_follow_id=auth_asking_follow.split('/')[-1]
        print("3")
        auth_being_followed_id=auth_being_followed.split('/')[-1]
        print("4")
        try:
            asking_follow_profile = UserProfile.objects.get(foreign=auth_asking_follow_id)
        except:
            return {'status': 'user asking to follow does not exist in db'}
        try:
            being_followed_profile = UserProfile.objects.get(id=auth_being_followed_id)
        except:
            print("to be followed is not internal")
        try:
            being_followed_profile = UserProfile.objects.get(foreign=auth_being_followed_id)
        except:
            print("to be followed is not external")
        
        being_followed_profile.send_follow_request(asking_follow_profile)
        print("5")
        return {'status': 'follow request sent'}
    except:
        return {'status': 'failed to send follow request'}


def POST_request(request):
    print("POST_request()")
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
    #what does this even do??
    # elif path[-1] == 'new_post':
    #     x = post_new_comment(request,path)
    elif path[-1] == 'inbox':
        x = determine_type(request, path)
    elif path[-1] == "comments":
        print("sending to post_new_comment")
        x = post_new_comment(request, path)
    else:
        x = {'status': 'error in parsing post request'}
    # like to author/{}/inbox... TODO!
    
    return JsonResponse(x)

def PUT_request(request):
    print("PUT_request()")
    print(request)
    return JsonResponse({'status': '3'})

def DELETE_request(request):
    print("DELETE_request()")

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
    print("delete_post()")
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
    print("PATCH_request()")
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
    print("patch_post()")
    print(request)
    print(path)
    print("PATCHING POST!!!!")

    try:
        post=Post.objects.get(id=path[-1]) 
    except:
        print("post could not be found")
        return {'status': 'post could not be found'}
    
    try:
        data = json.loads(request.body.decode('utf-8'))
        print(data)
    except:
        return {'status': 'could not load data from json'}
    
    try:
        post.title = data['title']
    except:
        print("Title not avaiable from json data")
    try:
        post.source = data['source']
    except:
        print("Source not avaiable from json data")
    try:
        post.origin = data['origin']
    except:
        print("Origin not avaiable from json data")
    try:
        post.description = data['description']
    except:
        print("description not avaiable from json data")
    try:
        post.visibility = data['visibility']
    except:
        print("visibility not avaiable from json data")
    
    try:
        post.content = data['content']
    except:
        print("content not avaiable from json data")

    try:
        post.post_image = data['unlisted']
    except:
        print("image not avaiable from json data")

    
    #post.message_to = data['message_to']
    #post.categories = data['categories']
    try:
        post.save()
    except:
        return {'status': 'post failed to save'}
    return {'status': 'successfully added new post'}


def determine_type(request, path):
    print("determine_type()")
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
        x = post_follow_request(request)
    elif data["type"] == "comment":
        print("Comment type")
        x = {'status': 'NOT IMPLEMENTED YET!'}
    else:
        x = {'status': 'field type is not correct'}
    return x

def post_like(request, path):
    print("post_like()")
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
        userObject = CustomUser.objects.get(foreign=user_id)
    except:
        return {'status': 'could not retrieve associated user'}
    try:
        postObject = Post.objects.get(foreign=post_id)
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
