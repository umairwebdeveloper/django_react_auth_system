from django.db import models
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone
User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Source(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Currency(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=3, null=True, blank=True)
    symbol = models.CharField(max_length=5, null=True, blank=True)

    def __str__(self):
        return self.name
    
    
class UserPreference(models.Model):
    user = models.OneToOneField(to=User, on_delete=models.CASCADE)
    currency = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.user)+'s' + 'preferences'
    

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, related_name="expenses", on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    currency = models.ForeignKey(Currency, related_name="expenses", on_delete=models.CASCADE, null=True, blank=True)
    field = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.amount} - {self.category.name}"

class Income(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    source = models.ForeignKey(Source, related_name="incomes", on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    currency = models.ForeignKey(Currency, related_name="incomes", on_delete=models.CASCADE, null=True, blank=True)
    field = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.amount} - {self.category.name}"
