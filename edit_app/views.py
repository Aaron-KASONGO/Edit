from django.shortcuts import render


# Create your views here.

def home(request):
    return render(request, 'edit_app/index.html')
