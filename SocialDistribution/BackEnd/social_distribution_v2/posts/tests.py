from django.test import TestCase
from .models import Post
from user_profile.models import CustomUser
from django.utils import timezone
class PostTestCases(TestCase):
    def setUp(self):
        user=CustomUser.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        Post.objects.create(owner=user,content='test content', visibility='public')
    def test_Post_fields(self):
        post = Post.objects.get()
        self.assertEqual(post.owner.username,'test')
        self.assertEqual(post.visibility,'public')