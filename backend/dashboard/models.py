from decimal import Decimal
from django.db import models
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Sum
from django.contrib.auth import get_user_model
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
    
    def check_and_notify(self):
        user_preference = UserPreference.objects.filter(user=self.user).first()
        
        if user_preference is None or user_preference.currency is None:
            return False
        
        if user_preference and user_preference.currency:
            # Sum all expenses for the user
            total_expenses = Expense.objects.filter(user=self.user).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
            
            # Convert user preference currency amount to Decimal for comparison
            preference_amount = Decimal(user_preference.currency)
            
            if total_expenses > preference_amount:
                self.send_notification_email(total_expenses, preference_amount)
                return True
        return False
    
    def send_notification_email(self, total_expenses, preference_amount):
        subject = 'Expense Alert'
        message = (f'Your total expenses have reached {total_expenses}, which exceeds your preferred amount of '
                   f'{preference_amount}.')
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [self.user.email]
        
        send_mail(subject, message, from_email, recipient_list)
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.check_and_notify()

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
