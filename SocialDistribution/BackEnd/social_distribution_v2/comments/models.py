from django.db import models
from posts.models import Post
from django.utils import timezone 
from user_profile.models import UserProfile

# Create your models here.
class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    post=models.ForeignKey(Post,related_name='comments',on_delete=models.CASCADE)
    comment=models.CharField(max_length=4000)
    comment_image=models.ImageField(upload_to="comment_image",null=True,blank=True)
    post_date_time = models.DateTimeField(default=timezone.now)
    comment_inbox = models.ForeignKey(UserProfile, related_name='inbox', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.comment