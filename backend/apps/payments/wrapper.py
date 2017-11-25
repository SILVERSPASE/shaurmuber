from apps.payments.tasks import task_get_order_status


class Wrapper:
    @staticmethod
    def get_order_status(order_id):
        task_get_order_status.delay(order_id)