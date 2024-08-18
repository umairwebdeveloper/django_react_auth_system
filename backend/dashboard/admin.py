from django.contrib import admin
from .models import Expense, Income, Category, Source
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('amount', 'category', 'description', 'date', 'user')
    search_fields = ('description', 'category__name')
    list_filter = ('category', 'date', 'user')

class IncomeAdmin(admin.ModelAdmin):
    list_display = ('amount', 'source', 'description', 'date', 'user')
    search_fields = ('description', 'source__name')
    list_filter = ('source', 'date', 'user')
   
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
class SourceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    

admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Income, IncomeAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Source, SourceAdmin)