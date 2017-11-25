
from django.http import Http404
from rest_framework import viewsets
from rest_framework import mixins

from apps.messaging.models import Dialog, Message
from apps.orders.models import Order
from apps.messaging.api.serializers import DialogSerializer, MessageSerializer


class DialogViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):

    serializer_class = DialogSerializer
    queryset = Dialog.objects.all()


class DialogDetailViewSet(mixins.CreateModelMixin,
                          mixins.RetrieveModelMixin,
                          viewsets.GenericViewSet):

    serializer_class = DialogSerializer

    def get_object(self, **kwargs):
        """
        Gets User from a request and checks whether he is authenticated.
        If authenticated, gets Dialog by Order PK which is given in a
        request, checks if User is present in a Dialog as a
        courier or customer and in case of success returns this Dialog if
        it exists, if doesn't exist then creates a Dialog.
        """
        user = self.request.user
        dialog = None

        '''
            order = get_object_or_404(Order, pk=self.kwargs['pk'])
            if user in [order.curier, order.customer] and \
                order.status in ['active', 'delivered']:
                    created, dialog = Dialog.objects.get_or_create(
                        order=order,
                        defaults={
                            '':
                        }
                    )
        '''
        if not user.is_authenticated:
            raise Http404()
        else:
            try:
                dialog = Dialog.objects.get(order__pk=self.kwargs['pk'])
            except Dialog.DoesNotExist:
                try:
                    order = Order.objects.get(pk=self.kwargs['pk'])

                    if (user.pk == order.curier.pk or user.pk == order.customer.pk) \
                            and (order.status == 'active' or order.status == 'delivered'):
                        return Dialog.objects.create(
                            order=order,
                            title="Dialog in Order #{0}".format(self.kwargs['pk'])
                        )
                except Order.DoesNotExist:
                    raise Http404()

            else:
                if dialog.order.curier.pk == user.pk or dialog.order.customer.pk == user.pk:
                    return dialog
                else:
                    raise Http404()


class MessageViewSet(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):

    serializer_class = MessageSerializer

    def get_queryset(self, **kwargs):
        user = self.request.user

        if not user.is_authenticated:
            raise Http404()

        try:
            dialog = Dialog.objects.get(pk=self.kwargs['pk'])
        except Dialog.DoesNotExist:
            raise Http404()

        order = Order.objects.get(pk=dialog.order.pk)

        if user.pk == order.curier.pk or user.pk == order.customer.pk:
            return Message.objects.filter(dialog__pk=self.kwargs['pk'])
        else:
            raise Http404()
