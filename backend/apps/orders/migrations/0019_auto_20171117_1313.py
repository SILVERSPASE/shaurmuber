# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-17 13:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0018_order_distance'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='distance',
            field=models.CharField(default=1, max_length=10),
        ),
    ]