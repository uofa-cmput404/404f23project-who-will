from django.db import models
# from django.contrib.auth.models import User  # Assuming you're using Django's built-in User model

# class Post(models.Model):
#     VISIBILITY_CHOICES = (
#         ('public', 'Public'),
#         ('private', 'Private'),
#         ('friends_only', 'Friends Only'),
#         ('unlisted', 'Unlisted'),
#     )

#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     visibility = models.CharField(max_length=12, choices=VISIBILITY_CHOICES, default='public')
#     images = models.ManyToManyField('Image', blank=True)
#     comments = models.ManyToManyField('Comment', related_name='post_comments', blank=True)
#     likes = models.ManyToManyField(User, through='Like', related_name='liked_posts', blank=True)
#     shared_with = models.ManyToManyField(User, related_name='shared_posts', blank=True)

#     def __str__(self):
#         return f"Post by {self.author.username} ({self.visibility})"

# class Image(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     file = models.ImageField(upload_to='post_images/')
#     timestamp = models.DateTimeField(auto_now_add=True)
#     description = models.TextField()

#     def __str__(self):
#         return f"Image by {self.author.username}"

# class Comment(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)
#     post = models.ForeignKey(Post, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"Comment by {self.author.username}"

# class Like(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     post = models.ForeignKey(Post, on_delete=models.CASCADE)
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Like by {self.user.username} on {self.post.author.username}'s post"
