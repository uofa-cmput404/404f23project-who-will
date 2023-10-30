from django.test import TestCase
from .models import Vote
from django.contrib.auth.models import User
from posts.models import Post

class VoteTestCases(TestCase):
    def setUp(self):
        user=User.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        user1=User.objects.create(username='test1', email='test@test.com', password='password')
        user1.save()
        post=Post.objects.create(owner=user, content='test case', visibility='public')
        post.save()
        Vote.objects.create(post=post, up_vote_by=user, down_vote_by=user1)

    def test_Vote_fields(self):
        vote = Vote.objects.get()
        self.assertEqual(vote.post.content,'test case')
        self.assertEqual(vote.up_vote_by.username,'test')
        self.assertEqual(vote.down_vote_by.username,'test1')