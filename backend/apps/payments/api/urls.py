from django.conf.urls import url

from apps.payments.api.views import PayoutAPIView


urlpatterns = [
    url(r'^payout/$', PayoutAPIView.as_view()),
]
