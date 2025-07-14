from django.contrib import admin
from .models import Movie, Cast

class CastInline(admin.TabularInline):
    model = Movie.casts.through
    extra = 1

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'like_count_display')
    search_fields = ('title',)
    inlines = [CastInline]
    exclude = ('liked_by',)

    def like_count_display(self, obj):
        return obj.like_count()
    like_count_display.short_description = 'Likes'

@admin.register(Cast)
class CastAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
