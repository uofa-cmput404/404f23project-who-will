from django.contrib import admin
from .models import Post

class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'timestamp', 'visibility')
    # Other admin options

admin.site.register(Post, PostAdmin)
