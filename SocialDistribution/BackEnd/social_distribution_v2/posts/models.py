from django.db import models
from django.utils import timezone 
# Create your models here.
class Post(models.Model):
    id = models.AutoField(primary_key=True)

    owner = models.ForeignKey('auth.User', related_name='posts', on_delete=models.CASCADE)
    content=models.CharField(max_length=4000, blank=True)
    post_image=models.CharField(max_length=400000, null=True)
    post_date_time = models.DateTimeField(default=timezone.now)

    category=models.CharField(max_length=3000,default=None,blank=True,null=True)
    visibility_choices=(("public", "public"), ("private", "private"), ("friends only", "friends only"))
    visibility=models.CharField(choices=visibility_choices, max_length=30)
    def __str__(self):
        return str(self.id)

