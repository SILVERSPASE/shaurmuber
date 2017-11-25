from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from apps.payments.models import PayRequest
from apps.payments.api.serializers import PayRequestSerializer
from apps.payments.utils import make_liqpay_data
from apps.orders.models import Order

from apps.payments.wrapper import Wrapper
from django.conf import settings


class PayoutAPIView(CreateAPIView):
    queryset = PayRequest.objects.all()
    serializer_class = PayRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_uuid = serializer.validated_data.get('order')
        order = Order.objects.get(uuid=order_uuid)
        amount = order.order_price + order.delivery_price

        pay_request = serializer.save(order=order, payee=order.customer)

        data, signature = make_liqpay_data(amount, pay_request.id+settings.CONST)
        Wrapper.get_order_status(pay_request.id+settings.CONST)

        return Response({'data': data, 'signature': signature},
                        status=status.HTTP_201_CREATED)
