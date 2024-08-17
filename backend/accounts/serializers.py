from djoser.serializers import UserCreateSerializer
from djoser.serializers import UserSerializer
from django.contrib.auth import get_user_model
from django.utils.timesince import timesince
from rest_framework import serializers
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        
        
class ProfileSerializer(UserSerializer):
    last_login = serializers.SerializerMethodField()

    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'last_login')

    def get_last_login(self, obj):
        if obj.last_login:
            return timesince(obj.last_login)
        return None