from datetime import datetime, timedelta

from apps.orders.models import Order, Candidate
from django.http import HttpResponse

from apps.authentication.models import AuthUser
from requests import Response

from apps.notifications.web_notifications import WebNotifications
from .serializers import OrderSerializer, \
    OrderGetSerializer, \
    OrderAssignCourier, \
    CandidateCreateSerializer, \
    CandidateGetSerializer, \
    OrderFilterSerializer
from rest_framework import viewsets, mixins, generics, status, views
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.renderers import JSONRenderer


# TODO : paginations
# for map minimal ser

# show public orders for all users
class PublicOrdersList(generics.ListAPIView):
    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'GET':
            return OrderGetSerializer
        return OrderSerializer

    def get_queryset(self):
        previous_hour = datetime.now() - timedelta(hours=1)
        filtered_orders = Order.objects.filter(status='public').filter(to_time__gte=previous_hour)
        for i in self.request.GET:
            # print(i)
            # print(self.request.GET[i])
            filtered_orders = filtered_orders.filter(**{i: self.request.GET[i]})
        return filtered_orders


class ViewListRetrieveViewSet(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'GET':
            return OrderGetSerializer
        return OrderSerializer

    def get_queryset(self):
        self_orders = Order.objects.filter(Q(customer=self.request.user) | Q(curier=self.request.user))

        if 'type' in self.request.GET:

            if self.request.GET['type'] == 'my_public_orders':
                return self_orders.filter(Q(status='public') | Q(status='waiting_for_payment'))

            # get current user's done and canseled orders
            if self.request.GET['type'] == 'archive':
                return self_orders.filter(
                    Q(status='done') | Q(status='canceled_by_customer') | Q(status='canceled_by_courier'))

            if self.request.GET['type'] == 'active':
                return self_orders.filter(Q(status='active') | Q(status='delivered'))
            # get draft orders and other
            if self.request.GET['type'] == 'draft':
                return self_orders.filter(status='draft')
        return self_orders

        # TODO : in or class methods get type
        # TODO : REST WAY - url for orders type


class OrderDetailApiView(generics.RetrieveUpdateAPIView):
    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'GET':
            return OrderGetSerializer
        return OrderSerializer

    def get_object(self):
        current_order = Order.objects.get(uuid=self.kwargs['uuid'])
        if len(self.request.data) > 0:
            if self.request.data['status'] == 'delivered':
                notification = WebNotifications(current_order.customer.uuid,
                                                'Please, accept receiving your order "' + current_order.title + '"',
                                                '/orders')
                notification.send()

            if self.request.data['status'] == 'done':
                notification = WebNotifications(current_order.curier.uuid,
                                                'Congradulations! Order "' + current_order.title +
                                                '" is done! Now wait for money',
                                                '/orders')
                notification.send()

            if self.request.data['status'] == 'canceled_by_customer' and current_order.curier:
                notification = WebNotifications(current_order.curier.uuid,
                                                'Order "' + current_order.title +
                                                '" was canceled by customer!',
                                                '/orders')
                notification.send()

            if self.request.data['status'] == 'canceled_by_courier' and current_order.curier:
                notification = WebNotifications(current_order.customer.uuid,
                                                'Order "' + current_order.title +
                                                '" was canceled by courier!',
                                                '/orders')
                notification.send()

        return current_order





class OrderAssignCourierView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)

    serializer_class = OrderAssignCourier

    def get_object(self):
        if self.request.data['status'] == 'waiting_for_payment':
            notification = WebNotifications(self.request.data['curier'],
                                            'You have been chosen for delivery for this order. '
                                            'Now when customer will pay we will notice you',
                                            '/orders')
            notification.send()
        return Order.objects.get(uuid=self.kwargs['uuid'])


class OrderListToCandidateView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        print(self.request.user)
        return Order.objects.filter(candidates__candidate__id=self.request.user, status='active')

    serializer_class = OrderGetSerializer


class CandidateListCreateAPIView(generics.ListCreateAPIView):
    # to set candidate we need only id, but to get candidate detail in list we need name etc
    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return CandidateCreateSerializer
        return CandidateGetSerializer

    def get_queryset(self):
        uuid = self.kwargs['uuid']
        return Candidate.objects.filter(order__uuid=uuid)


class FilterDataView(views.APIView):
    def get(self, request, *args, **kwargs):
        active_orders = Order.objects.filter(status='public')
        if active_orders:
            max_order_price = active_orders.order_by('-order_price')[:1].get().order_price
            max_delivery_price = active_orders.order_by('-delivery_price')[:1].get().delivery_price

            max_distance = active_orders.order_by('-distance')[:1].get().distance

            response_data = {
                'max_order_price': max_order_price,
                'max_delivery_price': max_delivery_price,
                'max_distance': max_distance
            }
        else:
            response_data = {
                'max_order_price': 1000,
                'max_delivery_price': 1000,
                'max_distance': 1000
            }

        return HttpResponse(JSONRenderer().render(response_data))
