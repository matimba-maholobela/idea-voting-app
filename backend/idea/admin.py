from django.contrib import admin
from .models import Idea

class IdeaAdmin(admin.ModelAdmin):
    list_display = ('id','title','description', 'created_by', 'created_at', 'vote_count')
    search_fields = ('title', 'description', 'created_by__username')
    list_filter = ('created_at', 'created_by')

admin.site.register(Idea, IdeaAdmin)
