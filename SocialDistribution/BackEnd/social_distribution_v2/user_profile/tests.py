from django.test import TestCase
from .models import UserProfile, User
# Create your tests here.
class UserTestCases(TestCase):
    def setUp(self):
        User.objects.create(username='test', email='test@test.com', password='password')
    def test_User_name(self):
        user = User.objects.get(username='test')
        self.assertEqual(user.username,'test')

class ProfileTestCases(TestCase):
    def setUp(self):
        user = User.objects.create(username='test', email='test@test.com', password='password')
        user.save()
        UserProfile.objects.create(owner=user)
    def test_Profile_owner(self):
        profile = UserProfile.objects.get()
        self.assertAlmostEqual(profile.owner.username, 'test')