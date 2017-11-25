from rest_framework import routers
from django.conf.urls import url
from .views import ProfileDetailApiView, ProfileNotificationsDetailApiView, \
    ProfilePrivacySettingsApiView
from .views import ProfileDetailApiView, ProfileNotificationsDetailApiView, \
                    ProfilePrivacySettingsApiView, PlacesListViewSet, \
                    PlaceViewSet, ProfilePrivacySettingsApiView,\
                    ProfileRatingApiView

urlpatterns = [
    url(r'^$', ProfileDetailApiView.as_view()),
    url(r'^rating/$', ProfileRatingApiView.as_view()),
    url(r'^notifications/$', ProfileNotificationsDetailApiView.as_view()),
    url(r'^privacy_settings/$', ProfilePrivacySettingsApiView.as_view()),

	#TODO: maybe in future will be two different views though two urls
	#url(r'^places/$', PlacesListViewSet, base_name='places'),
	#url(r'^places/(?P<pk>[1-9]+)/$', base_name='place_id'),
]

router = routers.SimpleRouter()

router.register(r'place',PlaceViewSet, base_name='place_id')
router.register(r'^places', PlacesListViewSet, base_name='places')

urlpatterns += router.urls
