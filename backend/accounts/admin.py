from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

# Register your models here.

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('id','email', 'first_name', 'last_name', 'role', 'is_active','is_email_verified')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('id',)
    
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ()
    list_filter = ()
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_email_verified','is_blocked', 'is_staff', 'is_superuser', 'role')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)