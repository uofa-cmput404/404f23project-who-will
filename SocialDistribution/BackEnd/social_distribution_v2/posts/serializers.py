from . models import Post, Categories
from rest_framework import serializers

from  comments.serializers import CommentSerializer
from votes.serializers import VoteSerializer

class PostSerializer(serializers.ModelSerializer):
    comments=CommentSerializer(many=True,read_only=True)
    votes=VoteSerializer(many=True,read_only=True)
    class Meta:
        model = Post
        # fields = ['id', 'owner','content','description','post_image','post_date_time', 'title', 'source', 'origin', 'categories', 'visibility']
        fields = '__all__' 

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__' 