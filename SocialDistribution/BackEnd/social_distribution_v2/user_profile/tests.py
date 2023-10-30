from django.test import TestCase
from .models import UserProfile, User
# Create your tests here.
class UserTestCases(TestCase):
    def setUp(self):
        User.objects.create(username='test', email='test@test.com', password='password')
    def test_User_name(self):
        user = User.objects.get(username='test')
        self.assertEqual(user.username,'test')
