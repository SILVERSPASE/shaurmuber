from django.conf.urls import url, include


urlpatterns = [
    url(r'^otc/', include('apps.otc.api.urls')),
    url(r'^orders/', include('apps.orders.api.urls')),
    url(r'^common/', include('apps.common.api.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^auth/', include('apps.authentication.api.urls')),
    url(r'^payments/', include('apps.payments.api.urls')),
    url(r'^', include('apps.authentication.api.urls')),
    url(r'^dialogs/', include('apps.messaging.api.urls')),
    url(r'^comments/', include('apps.comments.api.urls'))
]
