from functools import wraps

from .exceptions import ClientError
from .models import Dialog


def catch_client_error(func):
    """
    Decorator to catch the ClientError exception and translate it into a reply.
    """
    @wraps(func)
    def inner(message, *args, **kwargs):
        try:
            return func(message, *args, **kwargs)
        except ClientError as e:
            # If we catch a client error, tell it to send an error string
            # back to the client on their reply channel
            e.send_to(message.reply_channel)

    return inner


def get_dialog_or_error(dialog_id, user):
    """
    Tries to fetch a dialog for the user, checking permissions along the way.
    """
    # TODO: different exception types
    # Check if the user is logged in
    if not user.is_authenticated():
        raise ClientError("USER_HAS_TO_LOGIN")

    # Find the dialog they requested (by ID)
    try:
        dialog = Dialog.objects.get(pk=dialog_id)
    except Dialog.DoesNotExist:
        raise ClientError("DIALOG_INVALID")

    # Check permissions
    if user.pk != dialog.order.customer.pk \
            and user.pk != dialog.order.curier.pk:
        raise ClientError("DIALOG_ACCESS_DENIED")

    # If OK
    return dialog
