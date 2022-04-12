from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Crime(models.Model):


    author = models.OneToOneField(User, on_delete=models.CASCADE)
    nom = models.CharField(max_length=30, blank=True)
    category = models.CharField(max_length=2)
    description = models.TextField(blank=True)
    date_crime = models.DateTimeField()
    date_now = models.DateTimeField(auto_now_add=True)
    long = models.CharField(max_length=15, blank=True)
    lat = models.CharField(max_length=15, blank=True)
