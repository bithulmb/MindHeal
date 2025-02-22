from rest_framework import permissions
from .models import UserRole

class IsPatient(permissions.BasePermission):
    """
    Custom permission to only allow users with the role 'PATIENT' to access the view.
    """
    def has_permission(self, request, view):

      return request.user.is_authenticated and request.user.role == UserRole.PATIENT

class IsPsychologist(permissions.BasePermission):
    """
    Custom permission to only allow users with the role 'PATIENT' to access the view.
    """
    def has_permission(self, request, view):

      return request.user.is_authenticated and request.user.role == UserRole.PSYCHOLOGIST
        