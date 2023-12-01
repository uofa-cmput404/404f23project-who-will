
from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.urls import reverse
import uuid
DEFAULT_HOST = "http://127.0.0.1:8000/"
class CustomUser(AbstractUser):

    user_id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4, editable=False) 
    url = models.URLField(max_length=2048, null=True)
    host = models.URLField(blank=True, default=DEFAULT_HOST, null=True)
    def __str__(self) -> str:
        return self.username 
    def create_url(self):  
        if not self.host.endswith('/'):
            self.host += "/"
        return f"{self.host}authors/{self.user_id}"
    def save(self, *args, **kwargs):
        self.url = self.create_url()
        self.id = self.user_id
        super().save(*args, **kwargs)
    def get_absolute_url(self):
        return reverse('user_detail', args=[str(self.user_id)])

class UserProfile(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False)
    options = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('others', 'Others')
    )

    # new added 
    type = models.CharField(default ="author", max_length=6, blank = True, null = True)
    # user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id = models.URLField(max_length=2048, blank=True, null=True)


    owner = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile', primary_key=True)
    # fk = models.ForeignKey(CustomUser, on_delete=models.CASCADE, primary_key=True) 
    gender = models.CharField(
        max_length=20,
        choices=options,
        default='male',
        null=False,
        blank=False
    )
    dob = models.DateField(null=True, blank=True, default=None)
    phone = models.CharField(max_length=20, null=True, blank=True)
    github = models.CharField(max_length=200, null=True, blank=True)
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
    def get_absolute_url(self):
        return reverse('profile_detail', args=[str(self.owner.user_id)])

    def save(self, *args, **kwargs):
        self.id = self.owner.user_id
        super().save(*args, **kwargs)