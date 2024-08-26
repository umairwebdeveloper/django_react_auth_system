from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Expense, Income, Category, Source, UserPreference
from rest_framework import generics, status
from .serializers import ExpenseSerializer, IncomeSerializer, CategorySerializer, SourceSerializer, WeeklyExpenseSerializer, YearlyExpenseSerializer, WeeklyIncomeSerializer, YearlyIncomeSerializer, ChangePasswordSerializer, UserPreferenceSerializer
from django.db.models import Sum, Count
import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
User = get_user_model()

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Expense.objects.filter(user=user)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save(user=request.user)
        notification_sent = expense.check_and_notify()
        headers = self.get_success_headers(serializer.data)
        
        response_data = {
            **serializer.data,  # Include the serialized expense data
            'notification_sent': notification_sent  # Include whether a notification was sent
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        notification_sent = expense.check_and_notify()
        
        response_data = {
            **serializer.data,  # Include the serialized expense data
            'notification_sent': notification_sent  # Include whether a notification was sent
        }
        
        return Response(response_data)

class IncomeViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Income.objects.filter(user=user)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset
    
class CategoryListView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class SourceListView(viewsets.ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    

def calculate_user_expenses(user):
    today = now().date()
    start_of_week = today - timezone.timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)
    start_of_year = today.replace(month=1, day=1)

    total_today = Expense.objects.filter(user=user, date=today).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_week = Expense.objects.filter(user=user, date__gte=start_of_week).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_month = Expense.objects.filter(user=user, date__gte=start_of_month).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_year = Expense.objects.filter(user=user, date__gte=start_of_year).aggregate(total_amount=Sum('amount'), count=Count('id'))

    return {
        'total_today': total_today['total_amount'] or 0,
        'count_today': total_today['count'] or 0,
        'total_this_week': total_this_week['total_amount'] or 0,
        'count_this_week': total_this_week['count'] or 0,
        'total_this_month': total_this_month['total_amount'] or 0,
        'count_this_month': total_this_month['count'] or 0,
        'total_this_year': total_this_year['total_amount'] or 0,
        'count_this_year': total_this_year['count'] or 0,
    }
    
    
def calculate_user_incomes(user):
    today = now().date()
    start_of_week = today - timezone.timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)
    start_of_year = today.replace(month=1, day=1)
    
    total_today = Income.objects.filter(user=user, date=today).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_week = Income.objects.filter(user=user, date__gte=start_of_week).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_month = Income.objects.filter(user=user, date__gte=start_of_month).aggregate(total_amount=Sum('amount'), count=Count('id'))
    total_this_year = Income.objects.filter(user=user, date__gte=start_of_year).aggregate(total_amount=Sum('amount'), count=Count('id'))
    
    return {
        'total_today': total_today['total_amount'] or 0,
        'count_today': total_today['count'] or 0,
        'total_this_week': total_this_week['total_amount'] or 0,
        'count_this_week': total_this_week['count'] or 0,
        'total_this_month': total_this_month['total_amount'] or 0,
        'count_this_month': total_this_month['count'] or 0,
        'total_this_year': total_this_year['total_amount'] or 0,
        'count_this_year': total_this_year['count'] or 0,
    }
    
def get_weekly_expenses(user):
    # Get the current date and the start of the week (Monday)
    today = timezone.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    
    # Filter expenses for the current week
    expenses = Expense.objects.filter(
        user=user,
        date__range=[start_of_week, today]
    ).values('date').annotate(total_amount=Sum('amount'))

    # Format the data
    data = []
    for day in range(7):
        day_date = start_of_week + timedelta(days=day)
        day_expense = next((expense for expense in expenses if expense['date'] == day_date), None)
        data.append({
            'date': day_date,
            'total_amount': day_expense['total_amount'] if day_expense else 0
        })

    return data

def get_yearly_expenses(user):
    # Get the current date and the start of the year (January 1st)
    today = timezone.now().date()
    start_of_year = today.replace(month=1, day=1)
    
    # Filter expenses for the current year
    expenses = Expense.objects.filter(
        user=user,
        date__year=today.year
    ).values('date__month').annotate(total_amount=Sum('amount'))
    
    # Format the data by months
    data = []
    for month in range(1, 13):
        month_expense = next((expense for expense in expenses if expense['date__month'] == month), None)
        data.append({
            'month': month,
            'total_amount': month_expense['total_amount'] if month_expense else 0
        })

    return data
    
def get_weekly_incomes(user):
    # Get the current date and the start of the week (Monday)
    today = timezone.now().date()
    start_of_week = today - timedelta(days=today.weekday())
    
    # Filter incomes for the current week
    incomes = Income.objects.filter(
        user=user,
        date__range=[start_of_week, today]
    ).values('date').annotate(total_amount=Sum('amount'))

    # Format the data
    data = []
    for day in range(7):
        day_date = start_of_week + timedelta(days=day)
        day_income = next((income for income in incomes if income['date'] == day_date), None)
        data.append({
            'date': day_date,
            'total_amount': day_income['total_amount'] if day_income else 0
        })

    return data

def get_yearly_incomes(user):
    # Get the current date and the start of the year (January 1st)
    today = timezone.now().date()
    start_of_year = today.replace(month=1, day=1)
    
    # Filter incomes for the current year
    incomes = Income.objects.filter(
        user=user,
        date__year=today.year
    ).values('date__month').annotate(total_amount=Sum('amount'))
    
    # Format the data by months
    data = []
    for month in range(1, 13):
        month_income = next((income for income in incomes if income['date__month'] == month), None)
        data.append({
            'month': month,
            'total_amount': month_income['total_amount'] if month_income else 0
        })

    return data    

class DashboardSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this API

    def get(self, request, *args, **kwargs):
        todays_date = datetime.date.today()
        six_months_ago = todays_date - datetime.timedelta(days=30*6)
        
        # Aggregate the sum of amounts by category for the user's expenses
        expenses_by_category = Expense.objects.filter(
            user=request.user,
            date__gte=six_months_ago,
            date__lte=todays_date
        ).values('category__name').annotate(total_amount=Sum('amount'))
        
        # Aggregate the sum of amounts by Source for the user's incomes
        incomes_by_source = Income.objects.filter(
            user=request.user,
            date__gte=six_months_ago,
            date__lte=todays_date
        ).values('source__name').annotate(total_amount=Sum('amount'))

        # Convert the queryset into a dictionary with category names as keys and total amounts as values
        finalrep_exp = {expense['category__name']: expense['total_amount'] for expense in expenses_by_category}
        
        # Convert the queryset into a dictionary with source names as keys and total amounts as values
        finalrep_inc = {income['source__name']: income['total_amount'] for income in incomes_by_source}
        
        # calculate the user's expenses
        user_expenses = calculate_user_expenses(request.user)
        
        # calculate the user's incomes
        user_incomes = calculate_user_incomes(request.user)
        
        # calculate the weekly expenses
        weekly_expenses = get_weekly_expenses(request.user)
        weekly_expenses_serializer = WeeklyExpenseSerializer(weekly_expenses, many=True)
        
        # calculate the yearly expenses
        yearly_expenses = get_yearly_expenses(request.user)
        yearly_expense_serializer = YearlyExpenseSerializer(yearly_expenses, many=True)
        
        # calculate the weekly incomes
        weekly_incomes = get_weekly_incomes(request.user)
        weekly_income_serializer = WeeklyIncomeSerializer(weekly_incomes, many=True)
        
        # calculate the yearly incomes
        yearly_incomes = get_yearly_incomes(request.user)
        yearly_income_serializer = YearlyIncomeSerializer(yearly_incomes, many=True)
        
        return Response({'expense_category_data': finalrep_exp, 'income_source_data': finalrep_inc,
                         'user_expenses': user_expenses, 'user_incomes': user_incomes, 'weekly_expenses': weekly_expenses_serializer.data,
                         'yearly_expenses': yearly_expense_serializer.data, 'weekly_incomes': weekly_income_serializer.data, 'yearly_incomes': yearly_income_serializer.data})
        
class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Save the new password
            serializer.update(request.user, serializer.validated_data)
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserPreferenceRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        user_preference, created = UserPreference.objects.get_or_create(user=user)
        return user_preference