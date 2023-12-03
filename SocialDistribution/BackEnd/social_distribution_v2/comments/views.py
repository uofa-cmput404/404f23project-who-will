from .models import Comment
from rest_framework import viewsets

from . serializers import CommentSerializer
from posts.models import *


# Create your views here.
class CommentViewSet(viewsets.ModelViewSet):
    """Comments"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                       IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        saved_comment = serializer.save(owner=self.request.user)
        comment_data = serializer.to_representation(saved_comment)
        saved_comment_id = comment_data['id']

        data_dict = serializer.validated_data
        # OrderedDict([('comment', 'c omnnet'), ('post', <Post: 405b9f82-86f4-4a3a-899f-114c551ec2af>)])
        comment_post = data_dict['post']
        comment_post = Post.objects.get(id = comment_post.id )
        post_id = comment_post.id
        transformed_data = {
            "type":"comment"
        }

        author_val = {
            "type":"author"
        }
        author_id = None

        # comment
        # contentType
        # published
        # id
        # transformed_data["id"] = "http://127.0.0.1:8000/author/"+author_id+"/posts/"+post_id+"/comments/"+saved_comment_id

    
    # for searching indivisual posts using parameters 
    def get_queryset(self):
        qs = self.queryset
        query_parameter = self.request.query_params
        if not query_parameter:
            return Comment.objects.all()
        

        return qs.filter(post=query_parameter["post"])