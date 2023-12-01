from .models import UserProfile, CustomUser
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model=UserProfile
        fields='__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = CustomUser
        fields=('id','user_id', 'username','email','password', 'profile')
        # extra_kwargs = {'password': {'write_only': True}}  # Hide password field in GET requests

    def create(self, validated_data):
        user = CustomUser(
            email = validated_data['email'],
            username = validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user