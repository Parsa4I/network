from django.contrib import admin
from .models import *

class UserAdmin(admin.ModelAdmin):
    list_display = ('pk', 'username')

class PostAdmin(admin.ModelAdmin):
    list_display = ('pk', 'poster', 'body', 'timestamp', 'likes')

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
