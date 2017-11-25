from django.db import models


class Country(models.Model):
    country_name = models.CharField(max_length=50)


class City(models.Model):
    country = models.ForeignKey(Country)
    region_name = models.CharField(max_length=50, default="")
    city_name = models.CharField(max_length=50)
    latitude = models.FloatField()
    longitude = models.FloatField()
