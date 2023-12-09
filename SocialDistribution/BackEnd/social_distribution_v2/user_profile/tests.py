from django.test import TestCase
from .models import UserProfile, CustomUser 
# Create your tests here.
class UserTestCases(TestCase):
    def setUp(self):
        CustomUser.objects.create(username='test', email='test@test.com', password='password')
    def test_User_name(self):
        user = CustomUser.objects.get(username='test')
        self.assertEqual(user.username,'test')

class ProfileTestCases(TestCase):
    def setUp(self):
        user = CustomUser.objects.create(username='test1', email='test@test.com', password='password')
        user.save()
        # Check if a UserProfile already exists for the user
        profile, created = UserProfile.objects.get_or_create(owner=user)
        if not created:
            # If the profile already exists, you can update its fields as needed
            profile.gender = 'female'
            profile.save()
    def test_Profile_owner(self):
        profile = UserProfile.objects.get()
        self.assertAlmostEqual(profile.owner.email, 'test@test.com')