from django.contrib import admin
from .models import Vote

class VoteAdmin(admin.ModelAdmin):
    list_display = ('id','user_id', 'idea', 'created_at')
    search_fields = ('user__username', 'idea__title')
    list_filter = ('created_at',)

admin.site.register(Vote, VoteAdmin)
