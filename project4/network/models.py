from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', symmetrical=False, related_name='followings', null=True, blank=True)


class Post(models.Model):
    poster = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts')
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likers = models.ManyToManyField('User', null=True, blank=True, related_name='liked_posts')
    savers = models.ManyToManyField('User', null=True, blank=True, related_name='saved_posts')
    likes = models.IntegerField(default=0)
