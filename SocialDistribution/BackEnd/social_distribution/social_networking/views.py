from django.shortcuts import render

# Create your views here.


''' Need something like this to make a new post'''
# # # Assuming 'request' is the current user's request object
# new_post = Post.objects.create(author=request.user, content="This is the post content", visibility="public")





'''code to make a new user'''
# from django.contrib.auth.models import User

# # Create a new user
# new_user = User.objects.create_user(
#     username='new_username',
#     password='new_password',
#     email='new_email@example.com',
# )

# # Optionally, you can set other user attributes like first name, last name, etc.
# new_user.first_name = 'First'
# new_user.last_name = 'Last'

# # Save the user to the database
# new_user.save()


