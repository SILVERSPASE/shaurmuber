# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-18 10:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authuser',
            name='email',
            field=models.EmailField(blank=True, max_length=255),
        ),
    ]
