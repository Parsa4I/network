# Generated by Django 4.0.2 on 2022-04-07 08:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_remove_user_followings_alter_user_followers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='followers_num',
        ),
        migrations.RemoveField(
            model_name='user',
            name='followings_num',
        ),
    ]
