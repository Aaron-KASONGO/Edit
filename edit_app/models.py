from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Crime(models.Model):
    choices = [
        ('VL', 'Vol'),
        ('AG', 'Agression'),
        ('CB', 'Cambrioloage')
    ]

    author = models.OneToOneField(User, on_delete=models.CASCADE)
    nom = models.CharField(max_length=30)
    category = models.CharField(max_length=2, choices=choices)
    description = models.TextField()
    date_crime = models.DateTimeField()
    date_now = models.DateTimeField(auto_now_add=True)
    long = models.CharField(max_length=15)
    lat = models.CharField(max_length=15)
