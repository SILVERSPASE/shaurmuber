import json
from django.db import models
from channels import Group
from apps.orders.models import Order
from apps.authentication.models import AuthUser

from .settings import MSG_TYPE_MESSAGE, IMAGE_ROOT


class Dialog(models.Model):
    order = models.ForeignKey(Order, related_name="dialog_order")
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    @property
    def websocket_group(self):
        """
        Returns the Channels Group that sockets should subscribe to to get sent
        messages as they are generated.
        """
        return Group("dialog-%s" % self.id)

    def send_message(self, message, user, msg_type=MSG_TYPE_MESSAGE):
        """
        Called to send a message to the dialog on behalf of a user.
        """
        # MESSAGE_TYPE
        if msg_type == MSG_TYPE_MESSAGE:
            mes = Message(dialog=self, text=message, sender=user)
            mes.save()
            final_msg = {
                'dialog': str(self.id),
                'message': message,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_id': user.id,
                'date': str(mes.date)[0:10] + 'T' + str(mes.date)[11:-6] + "Z",
                'message_id': mes.id,
                'msg_type': msg_type,
                'image': IMAGE_ROOT + str(mes.sender.profile.image),
            }
        else:
            final_msg = {
                'dialog': str(self.id),
                'message': message,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_id': user.id,
                'msg_type': msg_type
            }
        # Send out the message to dialog
        self.websocket_group.send(
            {"text": json.dumps(final_msg)}
        )

# TODO: add receiver
class Message(models.Model):
    sender = models.ForeignKey(AuthUser, related_name="sender")
    dialog = models.ForeignKey(Dialog, related_name="dialog_id")
    text = models.TextField(null=False, blank=True)
    date = models.DateTimeField(auto_now_add=True, null=False)

    def get_fist_name(self):
        return self.sender.first_name

    def get_last_name(self):
        return self.sender.last_name
