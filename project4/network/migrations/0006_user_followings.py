# Generated by Django 4.0.2 on 2022-04-07 08:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_remove_user_followers_num_remove_user_followings_num'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='followings',
            field=models.IntegerField(default=0),
        ),
    ]