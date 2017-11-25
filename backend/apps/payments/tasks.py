import time
from celery.task import task
from celery.utils.log import get_task_logger
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

from apps.payments.utils import get_status_from_liqpay
from apps.payments.models import PayRequest, Transaction
from apps.orders.models import Order


logger = get_task_logger(__name__)


@task(name='task_get_order_status')
def task_get_order_status(order_id):
    """Get order status by id from LiqPay"""

    time.sleep(100)

    try:
        pay_request = PayRequest.objects.get(pk=order_id-settings.CONST)
        status = get_status_from_liqpay(pay_request.id+settings.CONST)

        if status == 'wait_accept':
            order = Order.objects.get(pk=pay_request.order_id)
            order.status = 'active'
            order.save()
            Transaction.objects.create(pay_request_id=pay_request.pk, status='approved')
        else:
            Transaction.objects.create(pay_request_id=pay_request.pk, status='declined')
            task_periodic_request.delay(order_id)
            raise ValueError('Not valid status')
    except ObjectDoesNotExist:
        raise ObjectDoesNotExist('PayRequest object does not exist!')


@task(name="task_periodic_request", default_retry_delay=15 * 60)
def task_periodic_request(order_id):
    """Get order's status of declined transaction"""

    transaction = Transaction.objects.get(pay_request=order_id-settings.CONST)
    if transaction.status == 'declined':
        try:
            status = get_status_from_liqpay(transaction.pay_request_id+settings.CONST)
            if status == 'wait_accept':
                pay_request = PayRequest.objects.get(pk=order_id - settings.CONST)
                order = Order.objects.get(pk=pay_request.order_id)
                order.status = 'active'
                order.save()
                transaction.status = 'approved'
                transaction.save()
        except ValueError:
            raise ValueError("Not valid status")
