# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-16 15:37
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='courier',
            new_name='recipient',
        ),
        migrations.RenameField(
            model_name='comments',
            old_name='customer',
            new_name='sender',
        ),
        migrations.AddField(
            model_name='comments',
            name='status',
            field=models.CharField(choices=[('public', 'public'), ('deleted', 'deleted')], default='public', max_length=30),
        ),
        migrations.AddField(
            model_name='comments',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='comments',
            name='date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]