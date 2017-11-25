from django.conf.urls import url, include
from apps.authentication.api.views import   UserAuthenticationAPIView, \
                                            CurrentUserDetailApiView, \
                                            LoginApiView, LogoutApiView, \
                                            UserDetailApiView, \
                                            CurrentUserChangeEmailApiView, \
                                            CurrentUserChangePasswordApiView

urlpatterns = [
    url(r'^auth/login/$', LoginApiView.as_view()),
    url(r'^auth/logout/$', LogoutApiView.as_view()),
    url(r'^current_user/$', CurrentUserDetailApiView.as_view()),
    url(r'^current_user/change_email/$', CurrentUserChangeEmailApiView.as_view()),
    url(r'^current_user/change_password/$', CurrentUserChangePasswordApiView.as_view()),
    url(r'^users/(?P<uuid>[0-9a-f-]+)/$', UserDetailApiView.as_view()),
    url(r'^users/(?P<uuid>[0-9a-f-]+)/profile/', include('apps.profiles.api.urls')),
    url(r'^comments', include('apps.comments.api.urls')),
    url(r'^registration/$', UserAuthenticationAPIView.as_view()),
]
# TODO : reset password