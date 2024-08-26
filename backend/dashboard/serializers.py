from rest_framework import serializers
from .models import Expense, Income, Category, Source, UserPreference
from django.contrib.auth.password_validation import validate_password


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


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct.")
        return value

    def validate_new_password(self, value):
        # Use Django's built-in password validators
        try:
            validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
    
class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['user', 'currency']
        read_only_fields = ['user']