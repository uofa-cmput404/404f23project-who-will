from . models import Post
from rest_framework import serializers
from comments.serializers import CommentSerializer
class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'content','post_image','category','post_date', 'comments']
