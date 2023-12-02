from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from user_profile.views import ProfileViewSet, CustomUserViewSet
from posts.views import PostViewSet, CategoryViewSet
from comments.views import CommentViewSet
from votes.views import VoteViewSet
from django.urls import re_path

router=DefaultRouter()
router.register(r'users',CustomUserViewSet,basename='users')
re_path(r'^users/.*$', CustomUserViewSet)
router.register(r'profiles',ProfileViewSet,basename='profiles')
router.register(r'posts',PostViewSet)
re_path(r'^posts/.*$', PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-list'),
router.register(r'categories', CategoryViewSet)
router.register(r'comments',CommentViewSet)
router.register(r'votes',VoteViewSet)
urlpatterns=router.urls