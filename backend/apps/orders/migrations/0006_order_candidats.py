# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-22 19:27
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '0005_auto_20171019_1314'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='candidats',
            field=models.ManyToManyField(blank=True, related_name='related_candidats', to=settings.AUTH_USER_MODEL),
        ),
    ]