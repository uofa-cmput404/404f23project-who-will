from django.db import models
from posts.models import Post
from comments.models import Comment
from user_profile.models import UserProfile, CustomUser
from django.urls import reverse
import uuid
# Create your models here.
class Vote(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    post=models.ForeignKey(Post,related_name='votes',on_delete=models.CASCADE,default=None,blank=True,null=True)
    comment=models.ForeignKey(Comment,related_name='votes',on_delete=models.CASCADE,default=None,blank=True,null=True)
    up_vote_by = models.ForeignKey(CustomUser,related_name='up_vote_user',on_delete=models.CASCADE,default=None,blank=True,null=True)
    # inbox_to = models.ForeignKey(UserProfile, related_name='inbox', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        if self.post:
            return str(self.post.id)
        elif self.comment:
            return str(self.comment.id)
        else:
            return "Vote without post or comment"
    
    # def get_absolute_url(self):
    #     return reverse('vote_detail', args=[str(self.id)])