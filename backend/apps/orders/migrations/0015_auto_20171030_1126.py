# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-30 11:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0014_auto_20171030_1126'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('draft', 'draft'), ('public', 'public'), ('waiting_for_payment', 'waiting_for_payment'), ('active', 'active'), ('delivered', 'delivered'), ('canceled_by_customer', 'canceled_by_customer'), ('canceled_by_courier', 'canceled_by_courier'), ('done', 'done')], max_length=30),
        ),
    ]
