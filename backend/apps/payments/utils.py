from django.conf import settings
from apps.liqpay.liqpay3 import LiqPay

PRIVATE_KEY = settings.LIQPAY_PRIVATE_KEY
PUBLIC_KEY = settings.LIQPAY_PUBLIC_KEY
JSON_DATA = {
    "public_key": PUBLIC_KEY,
    "version": "3",
    "action": "pay",
    "currency": "UAH",
    "description": "ShaurmUber order",
    # testing mode
    "sandbox": "0"
}

STATUS_DATA = {
    "action": "status",
    "version": "3",
}


def make_liqpay_data(amount, order_id):
    JSON_DATA['amount'] = amount
    JSON_DATA['order_id'] = order_id
    liqpay = LiqPay(PUBLIC_KEY, PRIVATE_KEY)
    data = liqpay.cnb_data(JSON_DATA)
    signature = liqpay.cnb_signature(JSON_DATA)

    return data, signature


def get_status_from_liqpay(order_id):

    STATUS_DATA['order_id'] = order_id
    liqpay = LiqPay(PUBLIC_KEY, PRIVATE_KEY)
    res = liqpay.api("request", STATUS_DATA)

    return res['status']


