from dataclasses import fields
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    poster = UserSerializer()
    likers = UserSerializer(many=True)
    savers = UserSerializer(many=True)
    timestamp = serializers.SerializerMethodField(
        method_name="get_str_timestamp"
    )

    class Meta:
        model = Post
        fields = '__all__'

    def get_str_timestamp(self, obj: Post):
        return obj.timestamp.strftime('%b %d %Y, %I:%M %p')
