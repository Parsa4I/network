
from unicodedata import name
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('newpost', views.newpost, name='newpost'),
    path('userview/<str:username>', views.user_view, name='user_view'),
    path('following', views.following, name='following'),
    path('saved', views.saved, name='saved'),

    #API Routes
    path('posts', views.posts_view, name='posts_view'),
    path('post/<int:post_id>', views.post, name='post'),
    path('posts/user/<str:user_id>', views.user_posts, name='user_posts'),
    path('editpost/<int:post_id>', views.editpost, name='editpost'),
    path('likepost/<int:like>/<int:post_id>', views.likepost, name='likepost'),
    path('savepost/<int:save>/<int:post_id>', views.savepost, name='savepost'),
    path('user/<int:user_id>', views.user, name='user'),
    path('follow/<int:follow>/<str:user>', views.follow, name='follow'),
    path('following_posts/<int:user_id>', views.following_posts, name='following_posts'),
    path('saved_posts/<int:user_id>', views.saved_posts, name='saved_posts'),
]
