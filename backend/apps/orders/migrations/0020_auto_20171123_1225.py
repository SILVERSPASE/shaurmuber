# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-23 12:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0019_auto_20171117_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='title',
            field=models.CharField(max_length=400),
        ),
    ]
