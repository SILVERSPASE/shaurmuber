# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-16 11:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_auto_20171116_1106'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='rating',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=1),
        ),
    ]
