from rest_framework import serializers
from . models import Comment
class CommentSerializer(serializers.ModelSerializer):
    commented_by = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Comment
        fields = ['id', 'comment','comment_image','post_date_time','commented_by','post']