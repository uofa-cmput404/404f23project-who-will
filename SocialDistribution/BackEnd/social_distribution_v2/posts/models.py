from django.db import models
from django.utils import timezone 

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey('auth.User', related_name='posts', on_delete=models.CASCADE)
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

    def __str__(self):
        return str(self.id)

class Categories(models.Model):
    category = models.CharField(max_length=3000, default=None, blank=True, null=True)

    def __str__(self):
        return self.category
