from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'auth.User'
        fields=('id', 'username', 'email', 'password', 'is_active')
        extra_kwargs={'email':{'required': True, 'write_only':True}, 'password':{'write_only':True}}

    def create(self, validated_data):
        user = User(
            email = validated_data['email'],
            username = validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user