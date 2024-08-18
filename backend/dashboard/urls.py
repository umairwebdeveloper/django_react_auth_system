from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, IncomeViewSet, CategoryListView, SourceListView, DashboardSummaryAPIView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expenses')
router.register(r'incomes', IncomeViewSet, basename='incomes')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/sources/', SourceListView.as_view(), name='source-list'),
    path('api/summary/', DashboardSummaryAPIView.as_view(), name="DashboardSummaryAPIView"),
]
