# from django.db import models
# from django.contrib.auth.models import User
# # Create your models here.

# class UserProfile(models.Model):
#     options = (
#         ('male', 'Male'),
#         ('female', 'Female'),
#         ('others','Others')
#     )
#     owner=models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile_data')
#     gender = models.CharField(
#         max_length = 20,
#         choices = options,
#         default = 'male',
#         null=False,
#         blank=False
#         )
#     dob=models.DateField(null=True,blank=True,default=None)
#     phone=models.CharField(max_length=20,null=True,blank=True)
#     works_at=models.CharField(max_length=200,null=True,blank=True)
#     lives_in=models.CharField(max_length=200,null=True,blank=True)
#     studies_at=models.CharField(max_length=200,null=True,blank=True)
#     profile_image=models.ImageField(upload_to="profile_image",null=True,blank=True)



from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    options = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('others', 'Others')
    )
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_data')
    gender = models.CharField(
        max_length=20,
        choices=options,
        default='male',
        null=False,
        blank=False
    )
    dob = models.DateField(null=True, blank=True, default=None)
    phone = models.CharField(max_length=20, null=True, blank=True)
    works_at = models.CharField(max_length=200, null=True, blank=True)
    lives_in = models.CharField(max_length=200, null=True, blank=True)
    studies_at = models.CharField(max_length=200, null=True, blank=True)
    profile_image = models.ImageField(upload_to="profile_image", null=True, blank=True)
    follow_requests = models.ManyToManyField('self', symmetrical=False, related_name='follow_requests_received', blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)

    @property
    def followers_count(self):
        return self.followers.count()

    @property
    def following_count(self):
        return self.following.count()

    def send_follow_request(self, to_user_profile):
        self.follow_requests.add(to_user_profile)

    def accept_follow_request(self, from_user_profile):
        self.follow_requests.remove(from_user_profile)
        self.following.add(from_user_profile)

    def reject_follow_request(self, from_user_profile):
        self.follow_requests.remove(from_user_profile)
    
    def __str__(self):
        return str(self.owner)