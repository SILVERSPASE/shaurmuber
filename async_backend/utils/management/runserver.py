import settings
import asyncio
from aiohttp import web
import sys
import aioredis
from aiopg.sa import create_engine


class Application():

    def __init__(self, *args):
        self.app = web.Application()
        self.host = '127.0.0.1'
        self.port = 9000

        if len(args) > 2:
            self.host = args[1].split(":")[0]
            self.port = args[1].split(":")[1]

    async def get_db(self):
        engine = await create_engine(
            database=settings.POSTGRE_DB,
            user=settings.POSTGRE_USER,
            password=settings.POSTGRE_PASSWORD,
            host=settings.POSTGRE_HOST,
            port=settings.POSTGRE_PORT,
        )
        self.app['db'] = engine
        return True

    async def get_redis(self):
        self.app['redis'] = await aioredis.create_redis(
            (settings.REDIS['HOST'], settings.REDIS['PORT']),
            db=settings.REDIS['DB'],
        )
        return True

    async def get_urls(self):
        all_urls = []

        for i in settings.INSTALLED_APPS:
            try:
                app_urls = __import__("apps.{app_name}.urls".format(app_name=i),
                    globals(),
                    locals(),
                    ['{}'.format(i)]
                )
                all_urls.append(app_urls.urls)
            except ImportError:
                print("Module {} not found".format(i))

            for urls in all_urls:
                for i in urls:
                    self.app.router.add_get(i[0], i[1])
            return True

    async def build_app(self):
        await self.get_urls()
        await self.get_redis()
        await self.get_db()
        return self.app

    def run(self):
        loop = asyncio.get_event_loop()
        app = loop.run_until_complete(self.build_app())
        web.run_app(app, host=self.host, port=self.port)


def execute(*args):
    app = Application(*args)
    app.run()


if __name__ == "__main__":
    execute(sys.argv)
