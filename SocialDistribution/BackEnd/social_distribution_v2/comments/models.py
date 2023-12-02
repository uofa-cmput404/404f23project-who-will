from django.db import models
from posts.models import Post
from django.utils import timezone 
from user_profile.models import UserProfile
from user_profile.models import CustomUser
from django.urls import reverse
import uuid

# Create your models here.
class Comment(models.Model):
    comment_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4,editable=False)
    foreign = models.UUIDField(default=uuid.uuid4, editable=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post=models.ForeignKey(Post,related_name='comments',on_delete=models.CASCADE)
    comment=models.CharField(max_length=4000)
    comment_image=models.ImageField(upload_to="comment_image",null=True,blank=True)
    post_date_time = models.DateTimeField(default=timezone.now)
    comment_inbox = models.ForeignKey(UserProfile, related_name='inbox', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.comment
    def get_absolute_url(self):
        return reverse('comment_detail', args=[str(self.id)])
    def save(self, *args, **kwargs):
        if not self.owner.is_foreign:
            self.foreign = self.id
        self.id = self.comment_id
        super().save(*args, **kwargs)