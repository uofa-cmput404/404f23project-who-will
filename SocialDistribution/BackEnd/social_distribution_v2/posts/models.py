from django.db import models
from django.utils import timezone 
from user_profile.models import UserProfile, CustomUser
from django.urls import reverse
import uuid 

class Post(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    owner = models.ForeignKey(CustomUser, related_name='posts', on_delete=models.CASCADE)
    content = models.CharField(max_length=4000, blank=True)
    description = models.CharField(max_length=4000, blank=True)
    post_image = models.CharField(max_length=1000000, null=True)
    post_date_time = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=3000, default=None, blank=True, null=True)
    source = models.CharField(max_length=3000, default=None, blank=True, null=True)
    origin = models.CharField(max_length=3000, default=None, blank=True, null=True)
    categories = models.ManyToManyField('Categories', blank=True)  # Fix here
    visibility_choices = (("public", "public"), ("private", "private"), ("friends only", "friends only"))
    visibility = models.CharField(choices=visibility_choices, max_length=30)
    message_to = models.ForeignKey(UserProfile, related_name='message_to', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return str(self.id)
    def get_absolute_url(self):
        return reverse('post_detail', args=[str(self.id)])

class Categories(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    category = models.CharField(max_length=3000, default=None, blank=True, null=True)

    def __str__(self):
        return self.category
