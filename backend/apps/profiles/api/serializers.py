from rest_framework import serializers
from apps.profiles.models import Profile, Places
from apps.profiles.fields import Base64ImageField


class ProfileSerializer(serializers.ModelSerializer):
    image = Base64ImageField(max_length=None, use_url=True, required=False)

    class Meta:
        model = Profile
        exclude = ('user',
                   'notification_info',
                   'share_info', 
                   'blocked_users', 
                   'created',
                   'updated',)
        # read_only_fields = ('image',)


class UpdateRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        exclude = ('user',
                   'image',
                   'notification_info',
                   'share_info',
                   'blocked_users',
                   'created',
                   'updated',)

class ProfileNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['notification_info']


class PrivacySettingsProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['share_info']


class PlacesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Places
        fields = '__all__'
