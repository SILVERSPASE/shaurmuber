from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.authentication.models import AuthUser
from apps.comments.models import Comments
from apps.profiles.fields import Base64ImageField

class CommentsSerializer(ModelSerializer):
    sender_last_name = serializers.CharField(source='get_sender_last_name', required=False)
    sender_first_name = serializers.CharField(source='get_sender_first_name', required=False)
    recipient_last_name = serializers.CharField(source='get_recipient_last_name', required=False)
    recipient_first_name = serializers.CharField(source='get_recipient_first_name', required=False)
    sender_uuid = serializers.CharField(source='get_sender_uuid', required=False)
    recipient_uuid = serializers.CharField(source='get_recipient_uuid', required=False)
    time_passed = serializers.CharField(source='get_time_diff', required=False)
    sender = serializers.CharField()
    recipient = serializers.CharField()
    image = Base64ImageField(max_length=None, use_url=True, required=False, source='sender.profile.get_image')

    class Meta:
        model = Comments
        fields = '__all__'

    def create(self, validated_data):
        sender = self.validated_data.get('sender')
        recipient = self.validated_data.get('recipient')
        validated_data['sender'] = AuthUser.objects.get(uuid=sender)
        validated_data['recipient'] = AuthUser.objects.get(uuid=recipient)
        comment = Comments.objects.create(**validated_data)
        return comment

    def update(self, instance, validated_data):
        sender = self.validated_data.get('sender')
        validated_data['sender'] = AuthUser.objects.get(email=sender)
        recipient = self.validated_data.get('recipient')
        validated_data['recipient'] = AuthUser.objects.get(email=recipient)
        for i in validated_data:
            setattr(instance, i, validated_data[i])
        instance.save()
        return instance
#
