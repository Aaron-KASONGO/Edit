from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def home(request):
    return render(request, 'edit_app/index.html')


def signin(request):
    return HttpResponse('Merci de vous connecter !')
