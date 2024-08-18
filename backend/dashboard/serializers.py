from rest_framework import serializers
from .models import Expense, Income, Category, Source, Currency, UserPreference


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Source
        fields = ['id', 'name']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'category_name', 'description', 'date', 'user', 'created_at', 'updated_at']
        

class IncomeSerializer(serializers.ModelSerializer):
    source_name = serializers.ReadOnlyField(source='source.name')

    class Meta:
        model = Income
        fields = ['id', 'amount', 'source', 'source_name', 'description', 'date', 'user', 'created_at', 'updated_at']


class WeeklyExpenseSerializer(serializers.Serializer):
    date = serializers.DateField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    
class YearlyExpenseSerializer(serializers.Serializer):
    month = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
class WeeklyIncomeSerializer(serializers.Serializer):
    date = serializers.DateField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
class YearlyIncomeSerializer(serializers.Serializer):
    month = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)