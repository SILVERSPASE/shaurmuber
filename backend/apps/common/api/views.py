from django.shortcuts import render
from rest_framework.generics import ListAPIView

from apps.common.models import City
from apps.common.api.serializers import CitySerializer


class CityListAPIView(ListAPIView):
    serializer_class = CitySerializer

    def get_queryset(self):
        queryset = City.objects.all()

        region_name = self.request.query_params.get('region_name', None)
        city_name = self.request.query_params.get('city_name', None)
        city_id = self.request.query_params.get('city_id')

        if region_name is not None:
            return queryset.filter(region_name=region_name)
        elif city_name is not None:
            return queryset.filter(city_name=city_name)
        elif city_id is not None:
            return queryset.filter(pk=city_id)

        # return queryset.filter(city_name="Kyiv")
        return queryset
