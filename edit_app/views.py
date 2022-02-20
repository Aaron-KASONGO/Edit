from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def home(request):
    return render(request, 'edit_app/index.html')


def signin(request):
    return HttpResponse('Merci de vous connecter !')


def sign_up(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'edit_app/signup.html', {'form': form})
    else:
        form = UserCreationForm()
        return render(request, 'edit_app/signup.html', {'form': form})
