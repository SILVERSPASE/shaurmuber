from aiohttp import web
import pickle
import aioredis
from aioredis.abc import AbcConnection
import settings


async def get_user_uuid(request, user_pk):

    async with request.app['db'].acquire() as conn:
        user = await conn.execute("SELECT * FROM authentication_authuser WHERE id={}".format(user_pk))
        row = await user.fetchone()
        return row['uuid']

async def notification_handler(request):

    ws = web.WebSocketResponse()
    await ws.prepare(request)
    user_session_id = request.cookies['sessionid']
    redis = request.app['redis']
    user = await redis.get(':1:django.contrib.sessions.cache{}'.format(user_session_id))
    user = pickle.loads(user)
    user_uuid = await get_user_uuid(request, user['_auth_user_id'])

    if not user_uuid:
        ws.close()


    sub = await aioredis.create_redis(
        address=(
            settings.REDIS['HOST'],
            settings.REDIS['PORT'],
        ),
        db=settings.REDIS['DB']
    )
    channel = await sub.subscribe('django_web_notifications:{user_uuid}:message'.format(user_uuid=user_uuid))
    while await channel[0].wait_message():
        msg = await channel[0].get(encoding='utf-8')
        ws.send_json(msg)
    return ws
