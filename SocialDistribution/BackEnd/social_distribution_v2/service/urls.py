from service.views import *
from django.urls import path
from django.urls.conf import include
from django.urls import re_path

urlpatterns = [
    re_path(r'^authors/.*$', works),
]
