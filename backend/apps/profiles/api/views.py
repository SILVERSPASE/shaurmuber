from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from apps.profiles.api.serializers import ProfileSerializer, ProfileNotificationSerializer, \
    PrivacySettingsProfileSerializer
from apps.profiles.models import Profile

from apps.profiles.api.serializers import ProfileSerializer, \
    ProfileNotificationSerializer, PrivacySettingsProfileSerializer, PlacesSerializer,UpdateRatingSerializer
from apps.profiles.models import Profile, Places


class ProfileDetailApiView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer

    def get_object(self):

        if self.request.method == "PUT" or self.request.method == "PATCH":
            return Profile.objects.get(user=self.request.user)

        if self.request.method == "PUT" or self.request.method == "PATCH":
            return Profile.objects.get(user=self.request.user)

        return Profile.objects.get(user__uuid=self.kwargs['uuid'])


class ProfileRatingApiView(RetrieveUpdateAPIView):
    serializer_class = UpdateRatingSerializer

    def get_object(self):
        return Profile.objects.get(user__uuid=self.kwargs['uuid'])


class ProfileNotificationsDetailApiView(RetrieveUpdateAPIView):
    serializer_class = ProfileNotificationSerializer

    def get_object(self):
        return Profile.objects.get(user=self.request.user)


class ProfilePrivacySettingsApiView(RetrieveUpdateAPIView):
    serializer_class = PrivacySettingsProfileSerializer

    def get_object(self):
        return Profile.objects.get(user=self.request.user)

    def get_object(self):
        return Profile.objects.get(user=self.request.user)


class PlacesListViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        mixins.DestroyModelMixin,
                        mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = PlacesSerializer

    def get_queryset(self, **kwargs):
        return Places.objects.filter(user=self.request.user)


class PlaceViewSet(mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.UpdateModelMixin,
                   viewsets.GenericViewSet):
    serializer_class = PlacesSerializer

    def get_object(self, **kwargs):
        return Places.objects.get(pk=self.kwargs['pk'])
