from django.test import TestCase
from .models import Post
from django.contrib.auth.models import User
from django.utils import timezone
class PostTestCases(TestCase):
    def setUp(self):
        user=User.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        Post.objects.create(owner=user,content='test content', visibility='public')
    def test_Post_fields(self):
        post = Post.objects.get()
        self.assertEqual(post.owner.username,'test')
        self.assertEqual(post.visibility,'public')