from django.core.management.base import BaseCommand, CommandError
from apps.common.models import Country, City
import requests
import json


class Command(BaseCommand):

    help = 'Loads countries and cities to the corresponding tables ' \
           'from local JSON data file or a remote API'

    def add_arguments(self, parser):
        parser.add_argument(
            '--local',
            action="store_true",
            dest='local',
            default=False,
            help='Load cities from a local JSON file'
        )
        parser.add_argument(
            '--remote',
            action="store_true",
            dest='remote',
            default=False,
            help='Load cities from a remote API'
        )

    def handle(self, *args, **options):

        if options['local']:
            self.stdout.write('Loading cities from a local JSON file')

            new_cities_counter = 0
            country = Country.objects.create(country_name="Ukraine")

            with open('apps/common/data/cities_ua.json') as data_file:
                cities_data = json.load(data_file)

            for city in cities_data:
                latitude = city['lat']
                longitude = city['lng']
                city_name = city['name']
                region_name = city['adminName1']
                city_exists = City.objects.filter(longitude=longitude,
                                                  latitude=latitude).exists()

                if not city_exists:
                    new_cities_counter += 1
                    City.objects.create(latitude=latitude,
                                        longitude=longitude,
                                        city_name=city_name,
                                        country=country,
                                        region_name=region_name
                                        )

            self.stdout.write(
                self.style.SUCCESS('Successfully loaded {} new '
                                   'cities'.format(new_cities_counter)))

        elif options['remote']:
            self.stdout.write('Not implemented yet.')

        else:
            self.stdout.write(
                self.style.ERROR('You should use --local or --remote only. '
                                 'Type --help for detailed information.'))
