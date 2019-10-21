# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-27 13:03
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_order_waiting_for_candidate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='candidate',
            old_name='isChose',
            new_name='isChosen',
        ),
        migrations.AlterField(
            model_name='candidate',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='candidates', to='orders.Order'),
        ),
    ]