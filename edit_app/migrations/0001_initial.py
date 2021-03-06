# Generated by Django 4.0.2 on 2022-02-17 08:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Crime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=30)),
                ('category', models.CharField(choices=[('VL', 'Vol'), ('AG', 'Agression'), ('CB', 'Cambrioloage')], max_length=2)),
                ('description', models.TextField()),
                ('date_crime', models.DateTimeField()),
                ('date_now', models.DateTimeField(auto_now_add=True)),
                ('long', models.CharField(max_length=15)),
                ('lat', models.CharField(max_length=15)),
                ('author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
