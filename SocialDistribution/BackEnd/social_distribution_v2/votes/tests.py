from django.test import TestCase
from .models import Vote
from user_profile.models import *
from posts.models import Post

class VoteTestCases(TestCase):
    def setUp(self):
        user=CustomUser.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        user1=CustomUser.objects.create(username='test1', email='test@test.com', password='password')
        user1.save()
        post=Post.objects.create(owner=user, content='test case', visibility='public')
        post.save()
        Vote.objects.create(post=post, up_vote_by=user)

    def test_Vote_fields(self):
        vote = Vote.objects.get()
        self.assertEqual(vote.post.content,'test case')
        self.assertEqual(vote.up_vote_by.username,'test')