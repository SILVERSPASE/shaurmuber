import json
from channels import Channel
from channels.auth import channel_session_user_from_http, channel_session_user
from apps.notifications.web_notifications import WebNotifications

from .settings import MSG_TYPE_LEAVE, MSG_TYPE_ENTER, NOTIFY_USERS_ON_ENTER_OR_LEAVE_DIALOGS, MSG_TYPE_INDIALOG
from .models import Dialog
from .utils import get_dialog_or_error, catch_client_error
from .exceptions import ClientError


# WebSocket handling


# This decorator copies the user from the HTTP session (only available in
# websocket.connect or http.request messages) to the channel session (available
# in all consumers with the same reply_channel, so all three here)

@channel_session_user_from_http
def ws_connect(message):
    message.reply_channel.send({'accept': True})
    # Initialise their session
    message.channel_session['dialogs'] = []


# Unpacks the JSON in the received WebSocket frame and puts it onto a channel
# of its own with a few attributes extra so we can route it
# This doesn't need @channel_session_user as the next consumer will have that,
# and we preserve message.reply_channel (which that's based on)

def ws_receive(message):
    # All WebSocket frames have either a text or binary payload; we decode the
    # text part here assuming it's JSON.
    # You could easily build up a basic framework that did this encoding/decoding
    # for you as well as handling common errors.
    payload = json.loads(message['text'])
    payload['reply_channel'] = message.content['reply_channel']
    Channel("chat.receive").send(payload)


@channel_session_user
def ws_disconnect(message):
    # Unsubscribe from any connected dialogs
    for dialog_id in message.channel_session.get("dialogs", set()):
        try:
            dialog = Dialog.objects.get(pk=dialog_id)
            dialog.send_message('leave', message.user, MSG_TYPE_LEAVE)
            # Removes us from the dialog's send group. If this doesn't get run,
            # we'll get removed once our first reply message expires.
            dialog.websocket_group.discard(message.reply_channel)
        except Dialog.DoesNotExist:
            pass


# Chat channel handling


# Channel_session_user loads the user out from the channel session and presents
# it as message.user. There's also a http_session_user if you want to do this on
# a low-level HTTP handler, or just channel_session if all you want is the
# message.channel_session object without the auth fetching overhead.

@channel_session_user
@catch_client_error
def chat_join(message):
    # Find the dialog they requested (by ID) and add ourselves to the send group
    # Note that, because of channel_session_user, we have a message.user
    # object that works just like request.user would. Security!
    dialog = get_dialog_or_error(message["dialog"], message.user)

    # OK, add them in. The websocket_group is what we'll send messages
    # to so that everyone in the chat dialog gets them.
    dialog.websocket_group.add(message.reply_channel)
    message.channel_session['dialogs'] = list(set(message.channel_session['dialogs']).union([dialog.id]))

    if NOTIFY_USERS_ON_ENTER_OR_LEAVE_DIALOGS:
        dialog.send_message('join', message.user, MSG_TYPE_ENTER)

    # Send a message back that will prompt them to open the dialog
    # Done server-side so that we could, for example, make people
    # join dialogs automatically.
    message.reply_channel.send({
        "text": json.dumps({
            "join": str(dialog.id),
            "title": dialog.title,
            "user_id": message.user.id,
        }),
    })

@channel_session_user
@catch_client_error
def chat_leave(message):
    # Reverse of join - remove them from everything.
    dialog = get_dialog_or_error(message["dialog"], message.user)

    # Send a "leave message" to the dialog if available
    if NOTIFY_USERS_ON_ENTER_OR_LEAVE_DIALOGS:
        dialog.send_message(None, message.user, MSG_TYPE_LEAVE)

    dialog.websocket_group.discard(message.reply_channel)
    message.channel_session['dialogs'] = list(set(message.channel_session['dialogs']).difference([dialog.id]))

    # Send a message back that will prompt them to close the dialog
    message.reply_channel.send({
        "text": json.dumps({
            "leave": str(dialog.id),
        }),
    })


@channel_session_user
@catch_client_error
def chat_send(message):
    # Check that the user in the dialog
    if int(message['dialog']) not in message.channel_session['dialogs']:
        raise ClientError("DIALOG_ACCESS_DENIED")
    # Find the dialog they're sending to, check perms
    dialog = get_dialog_or_error(message["dialog"], message.user)
    # Send the message along
    dialog.send_message(message["message"], message.user)

@channel_session_user
@catch_client_error
def chat_in_dialog(message):
    dialog = get_dialog_or_error(message["dialog"], message.user)
    dialog.send_message('check', message.user, MSG_TYPE_INDIALOG)

@channel_session_user
@catch_client_error
def send_notification_async(message):
    dialog = get_dialog_or_error(message["dialog"], message.user)
    if dialog.order.customer != message.user:
        opponent = dialog.order.customer
    else:
        opponent = dialog.order.curier
    notification = WebNotifications(opponent.uuid, ('You have new message from ' +
                                    str(message.user.first_name) + ' ' + str(message.user.first_name)),
                                    '/dialog/' + str(dialog.order.pk))
    notification.send()
