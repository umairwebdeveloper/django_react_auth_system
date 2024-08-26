from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, IncomeViewSet, CategoryListView, SourceListView, DashboardSummaryAPIView, ChangePasswordView, UserPreferenceRetrieveUpdateView

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expenses')
router.register(r'incomes', IncomeViewSet, basename='incomes')
router.register(r'categories', CategoryListView, basename="categories")
router.register(r'sources', SourceListView, basename="sources")

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/summary/', DashboardSummaryAPIView.as_view(), name="DashboardSummaryAPIView"),
    path('api/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/user-preference/', UserPreferenceRetrieveUpdateView.as_view(), name='user-preference'),
]
