from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('like/<int:movie_id>/', views.like_movie, name='like_movie'),
    path('profile/', views.profile, name='profile'),
    path('movies/<int:movie_id>/', views.movie_detail, name='movie_detail'),
]
