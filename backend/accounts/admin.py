from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ()
    list_filter = ()
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'mobile_number')}),
        ('Permissions', {'fields': ('is_active', 'is_blocked', 'is_staff', 'is_superuser', 'role')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)