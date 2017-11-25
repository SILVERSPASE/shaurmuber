from django.conf.urls import url

from .views import ViewListRetrieveViewSet, CandidateListCreateAPIView, PublicOrdersList, \
    OrderDetailApiView, OrderAssignCourierView, FilterDataView

urlpatterns = [
    url(r'^$', ViewListRetrieveViewSet.as_view()),
    url(r'^(?P<uuid>[0-9a-f-]+)/$', OrderDetailApiView.as_view()),
    # order-filter candidates relate to order
    url(r'^public/$', PublicOrdersList.as_view()),
    url(r'^(?P<uuid>[0-9a-f-]+)/candidates/$', CandidateListCreateAPIView.as_view()),
    url(r'^(?P<uuid>[0-9a-f-]+)/assign-courier/$', OrderAssignCourierView.as_view()),
    url(r'^filter-data/$', FilterDataView.as_view()),

]


