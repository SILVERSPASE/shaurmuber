# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-19 12:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_order_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('draft', 'draft'), ('active', 'active'), ('public', 'public'), ('canceled', 'canceled'), ('done', 'done')], max_length=10),
        ),
    ]
