# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-22 20:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_auto_20171118_1022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tempuser',
            name='image',
            field=models.ImageField(blank=True, default='profile.png', null=True, upload_to='img/authentication/tmpusers/'),
        ),
    ]
