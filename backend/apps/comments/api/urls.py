from .views import CommentCreateView, \
    CommentUpdateView, \
    CommentGetView

from django.conf.urls import url

urlpatterns = [
    url(r'^get/(?P<uuid>[0-9a-f-]+)', CommentGetView.as_view()),
    url(r'^edit/(?P<uuid>[0-9a-f-]+)', CommentUpdateView.as_view()),
    url(r'^create/', CommentCreateView.as_view()),
]
