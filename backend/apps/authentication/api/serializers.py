from rest_framework import serializers
from pyisemail import is_email
from rest_framework import status
from rest_framework.exceptions import APIException

from apps.authentication.models import TempUser, AuthUser


class AuthUserSerializer(serializers.ModelSerializer):
    @staticmethod
    def validate_email(email):

        email_verification = is_email(email, check_dns=True, diagnose=True)
        if email_verification.diagnosis_type != 'VALID':
            raise APIException(
                detail='We couldn\'t verify your email address. ',
                code=status.HTTP_400_BAD_REQUEST
            )
        return email

    class Meta:
        model = TempUser
        fields = ('first_name', 'last_name', 'email', 'password', 'city',
                  'phone_number', 'card_number', 'birth_date', 'about_me')


class PublicUserSerializer(serializers.ModelSerializer):

    image = serializers.CharField(source='get_image')
    email = serializers.CharField(source='profile.get_public_email')
    phone = serializers.CharField(source='profile.get_public_phone')
    city = serializers.CharField(source='profile.get_public_city')
    birth_date = serializers.CharField(source='profile.get_public_birth_date')
    about_me = serializers.CharField(source='profile.get_public_about_me')

    class Meta:
        model = AuthUser
        fields = (
            'first_name',
            'last_name',
            'image',
            'uuid',
            'email',
            'phone',
            'city',
            'birth_date',
            'about_me',
        )


class UserObjSerializer(serializers.Serializer):

    image = serializers.CharField(source='get_image')
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    uuid = serializers.CharField()

class CurrentAuthUserSerializer(serializers.ModelSerializer):
    lat = serializers.CharField(source='profile.get_my_city_lat', required=False)
    lng = serializers.CharField(source='profile.get_my_city_lng', required=False)

    class Meta:
        model = AuthUser
        fields = ('id',
                  'first_name',
                  'last_name',
                  'email',
                  'deleted',
                  'uuid',
                  'purge_date',
                  'lat',
                  'lng',)


class UserPasswordChangeSerializer(serializers.Serializer):

    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def update(self, instance, validated_data):
        self.instance.set_password(validated_data['new_password'])
        self.instance.save()
        return instance


class UserEmailChangeSerializer(serializers.Serializer):

    email = serializers.EmailField()
