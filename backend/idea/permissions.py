from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        """Allow read-only access to everyone, but write access only to the owner of the idea.
        """
        if view.action in ['retrieve', 'list', 'my_ideas']:
            return True
        return obj.created_by == request.user