from django.test import TestCase
from user_profile.models import *
from .models import Comment
from posts.models import Post

class CommentTestCases(TestCase):
    def setUp(self):
        user=CustomUser.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        post=Post.objects.create(owner=user, content='test case', visibility='public')
        post.save()
        user1=CustomUser.objects.create(username='test1', email='test@test.com', password='password')
        user1.save()
        Comment.objects.create(owner=user1, post=post, comment='nice')
    def test_Comment_fields(self):
        comment = Comment.objects.get()
        self.assertEqual(comment.owner.username,'test1')
        self.assertEqual(comment.comment,'nice')
        
