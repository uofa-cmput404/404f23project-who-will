from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from social_networking.views import UserViewSet
from user_profile.views import ProfileViewSet
from posts.views import PostViewSet
from comments.views import CommentViewSet
from votes.views import VoteViewSet

router=DefaultRouter()
router.register(r'users',UserViewSet,basename='users')
router.register(r'profiles',ProfileViewSet)
router.register(r'posts',PostViewSet)
router.register(r'comments',CommentViewSet)
router.register(r'votes',VoteViewSet)
urlpatterns=router.urls