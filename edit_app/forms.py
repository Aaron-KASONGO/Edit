from django import forms
from .models import Crime

CRIMES = [
        ('VL', 'Vol'),
        ('AG', 'Agression'),
        ('CB', 'Cambrioloage')
    ]


class CrimeForm(forms.ModelForm):
    date_crime = forms.DateTimeField(widget=forms.DateTimeInput(attrs={'id': 'temps', 'type': 'datetime-local'}))
    category = forms.ChoiceField(choices=CRIMES, widget=forms.Select(attrs={'id': 'choix'}))

    class Meta:
        model = Crime
        fields = ('category', 'date_crime')
