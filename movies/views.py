from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .models import Movie
from .forms import SignUpForm

def index(request):
    query = request.GET.get('q', '')
    if query:
        movies = Movie.objects.filter(title__icontains=query)
    else:
        movies = Movie.objects.all()
    return render(request, 'movies/index.html', {
        'movies': movies,
        'query': query,
    })

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Welcome, {user.username}! Your account has been created.")
            return redirect('index')
        else:
            messages.error(request, "Please correct the error below.")
    else:
        form = SignUpForm()
    return render(request, 'movies/signup.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        uname = request.POST['username']
        pwd = request.POST['password']
        user = authenticate(request, username=uname, password=pwd)
        if user:
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect('index')
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, 'movies/login.html')

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        messages.info(request, "You have been logged out.")
        return redirect('index')
    return render(request, 'movies/logout_confirm.html')

def movie_detail(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    return render(request, 'movies/movie_detail.html', {'movie': movie})


@login_required
def like_movie(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    if request.user in movie.liked_by.all():
        movie.liked_by.remove(request.user)
    else:
        movie.liked_by.add(request.user)
    return redirect('index')

@login_required
def profile(request):
    liked_movies = request.user.liked_movies.all()
    return render(request, 'movies/profile.html', {'liked_movies': liked_movies})
