from rest_framework.generics import CreateAPIView, RetrieveAPIView, \
    RetrieveUpdateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from apps.authentication.api.serializers import AuthUserSerializer, \
    PublicUserSerializer, \
    CurrentAuthUserSerializer, \
    UserPasswordChangeSerializer, \
    UserEmailChangeSerializer

from apps.notifications.notifications import Notifications

from apps.authentication.models import TempUser, AuthUser

from django.http import Http404
from django.contrib.auth import authenticate, login, logout

from apps.otc.user_registration_otc import UserRegistrationOTC
from apps.otc.change_email_otc import ChangeEmailOTC


class UserAuthenticationAPIView(CreateAPIView):
    serializer_class = AuthUserSerializer
    queryset = TempUser.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

        otc = UserRegistrationOTC(tmp_user_pk=user.pk)
        url = otc.get_url()
        Notifications.send_registration_otc(user, url)
        return Response(status=status.HTTP_201_CREATED)


class LoginApiView(APIView):

    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        # TODO : username or password wrong
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response(status=status.HTTP_204_NO_CONTENT, content_type="text/json")
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED, content_type="text/json")


class LogoutApiView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT, content_type="text/json")


class CurrentUserDetailApiView(RetrieveUpdateAPIView):
    serializer_class = CurrentAuthUserSerializer

    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user
        else:
            raise Http404()


class UserDetailApiView(RetrieveAPIView):
    serializer_class = PublicUserSerializer

    def get_object(self):
        return AuthUser.objects.get(uuid=self.kwargs['uuid'])


class CurrentUserChangeEmailApiView(UpdateAPIView):
    serializer_class = UserEmailChangeSerializer

    def put(self, request):
        # TODO : is user authorized
        new_email = self.request.data['email']
        otc = ChangeEmailOTC(auth_user_pk=self.request.user.pk, email=new_email)
        url = otc.get_url()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserChangePasswordApiView(UpdateAPIView):
    serializer_class = UserPasswordChangeSerializer

    def put(self, request):
        old_password = request.data['old_password']
        new_password = request.data['new_password']
        if self.request.user.check_password(old_password):
            self.request.user.set_password(new_password)
            self.request.user.save()
            return Response(status=status.HTTP_200_OK, content_type="text/json")
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, content_type="text/json")

    def get_object(self):
        if self.request.user.is_authenticated():
            return self.request.user
        raise Http404()