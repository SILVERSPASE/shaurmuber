from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.profiles.fields import Base64ImageField

from apps.messaging.models import Dialog, Message


class DialogSerializer(ModelSerializer):

    class Meta:
        model = Dialog
        fields = '__all__'


class MessageSerializer(ModelSerializer):

    sender_last_name = serializers.CharField(source='get_last_name')
    sender_first_name = serializers.CharField(source='get_fist_name')
    image = Base64ImageField(max_length=None, use_url=True, required=False, source='sender.profile.get_image')

    class Meta:
        model = Message
        fields = ('id', 'text', 'date', 'dialog', 'sender', 'sender_last_name', 'sender_first_name', 'image')
