"""social_distribution URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static
from user_profile.views import GetRequestersView, GetFriendsView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# references
# https://www.youtube.com/watch?v=zpxZX73migE&t=100s&ab_channel=RehmatQadeer
# https://www.youtube.com/watch?v=0wWMc7USgBY&ab_channel=CodeLett
# from rest_framework_swagger.views import get_swagger_view
# schema_view = get_swagger_view(title='API Documentation')
 
schema_view = get_schema_view(
    openapi.Info(
        title='API Documents',
        default_version='v1',
        description='Test',
    ),
    public = True,
    permission_classes = [permissions.AllowAny]
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('api.urls')),
    path('api-auth/',include('rest_framework.urls')),
    # path('swagger/', get_swagger_view),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema_swagger_ui'),
    path('api/auth/', include('authentication.urls')),
    path('service/', include('service.urls')),
    path('api/get_requesters/', GetRequestersView.as_view(), name='get_requesters'),
    path('api/get_friends/', GetFriendsView.as_view(), name='get_friends'),
]
urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)