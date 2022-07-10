from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PostSerializer, UserSerializer
from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination

from .models import *


def index(request):
    return render(request, "network/index.html")


def user_view(request, username):
    user = get_object_or_404(User, username=username)
    isFollowed = False
    followers = [follower for follower in user.followers.all()]
    if request.user in followers:
        isFollowed = True

    return render(request, 'network/user.html', {
        'username': user.username,
        'id': user.pk,
        'followers_num': user.followers.count,
        'followings_num': user.followings.count,
        'posts_count': user.posts.count,
        'isFollowed': isFollowed
    })


def following(request):
    return render(request, 'network/following.html', {
        'user_id': request.user.pk
    })


def saved(request):
    return render(request, 'network/saved.html')


@api_view(['GET'])
def following_posts(request, user_id):
    user = User.objects.get(pk=user_id)
    following_users = user.followings.all()
    posts = Post.objects.filter(poster__in=following_users)
    posts = posts.order_by('timestamp').all()
    pagination = PageNumberPagination()
    page = pagination.paginate_queryset(posts, request)
    serializer = PostSerializer(page, many=True)
    return pagination.get_paginated_response(
        serializer.data
    )


@api_view(['GET'])
def saved_posts(request, user_id):
    user = User.objects.get(pk=user_id)
    posts = user.saved_posts
    posts = posts.order_by('-timestamp')
    pagination = PageNumberPagination()
    page = pagination.paginate_queryset(posts, request)
    serializer = PostSerializer(page, many=True)
    return pagination.get_paginated_response(
        serializer.data
    )


def newpost(request):
    post = Post(poster=request.user, body=request.POST['body'])
    post.save()
    return HttpResponseRedirect(reverse('index'))


@api_view(['GET'])
def user(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
def posts_view(request):
    posts = Post.objects.all()
    posts = posts.order_by('-timestamp').all()
    pagination = PageNumberPagination()
    page = pagination.paginate_queryset(posts, request)
    serializer = PostSerializer(page, many=True)
    return pagination.get_paginated_response(
        serializer.data
    )


@api_view(['GET'])
def post(request, post_id):
    pst = get_object_or_404(Post, pk=post_id)
    serializer = PostSerializer(pst)
    return Response(serializer.data)


@api_view(['GET'])
def user_posts(request, user_id):
    user = User.objects.get(pk=user_id)
    posts = Post.objects.filter(poster=user)
    posts = posts.order_by('-timestamp').all()
    pagination = PageNumberPagination()
    page = pagination.paginate_queryset(posts, request)
    serializer = PostSerializer(page, many=True)
    return pagination.get_paginated_response(
        serializer.data
    )


@csrf_exempt
def editpost(request, post_id):
    if (request.method == 'PUT'):
        data = json.loads(request.body)
        post = get_object_or_404(Post, pk=post_id)
        post.body = data['body']
        post.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            'error': 'PUT request required.'
        }, status=400)


@csrf_exempt
def follow(request, follow, user):
    if request.method == 'PUT':
        following_user = get_object_or_404(User, username=user)
        follower_user = request.user
        if follow:
            following_user.followers.add(follower_user)
        else:
            following_user.followers.remove(follower_user)
        request.user.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            'error': 'PUT request required.'
        }, status=400)


@csrf_exempt
def likepost(request, like, post_id):
    if (request.method == 'PUT'):
        post = get_object_or_404(Post, pk=post_id)
        if like:
            post.likes += 1
            post.likers.add(request.user)
        else:
            post.likes -= 1
            post.likers.remove(request.user)

        post.save()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            'error': 'PUT request required.'
        }, status=400)


@csrf_exempt
def savepost(request, save, post_id):
    if (request.method == 'PUT'):
        post = get_object_or_404(Post, pk=post_id)
        if save:
            post.savers.add(request.user)
        else:
            post.savers.remove(request.user)

        HttpResponse(status=204)
    else:
        return JsonResponse({
            'error': 'PUT request required.'
        }, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
