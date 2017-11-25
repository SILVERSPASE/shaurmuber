from django.contrib import admin
from .models import Dialog


admin.site.register(
    Dialog,
    list_display=["id", "title", "order"],
    list_display_links=["id", "title"],
)
