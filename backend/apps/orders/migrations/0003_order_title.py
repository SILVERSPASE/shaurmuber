# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-11 09:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_auto_20170929_1444'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='title',
            field=models.CharField(default='title', max_length=40),
            preserve_default=False,
        ),
    ]
