from .models import UserProfile, CustomUser
from django.contrib import admin

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(CustomUser)