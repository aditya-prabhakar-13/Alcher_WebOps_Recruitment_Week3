from django.db import models
from django.contrib.auth.models import User

class Cast(models.Model):
    name = models.CharField(max_length=100)
    photo = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    poster = models.URLField()
    casts = models.ManyToManyField(Cast, blank=True)
    liked_by = models.ManyToManyField(User, related_name='liked_movies', blank=True)

    def like_count(self):
        return self.liked_by.count()

    def __str__(self):
        return self.title
