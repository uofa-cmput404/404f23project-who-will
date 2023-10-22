from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile_data')

    dob = models.DateField(null=True, blank=True, default=None)
    profile_image=models.ImageField(upload_to="profile_image",null=True,blank=True)
