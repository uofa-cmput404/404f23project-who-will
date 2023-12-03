from .models import UserProfile, CustomUser
from rest_framework import serializers

class ProfileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model=UserProfile
        fields='__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields=('id','user_id', 'username','email','password', 'foreign')
        # extra_kwargs = {'password': {'write_only': True}}  # Hide password field in GET requests

    def create(self, validated_data):
        if validated_data.get('foreign'):
            user = CustomUser(
                is_foreign = True,
                foreign = validated_data['foreign'],
                email = validated_data['email'],
                username = validated_data['username']
            )
        else:
            user = CustomUser(
                is_foreign = False,
                email = validated_data['email'],
                username = validated_data['username']
            )

        user.set_password(validated_data['password'])
        user.save()
        print("after create in ser")
        return user