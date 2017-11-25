from django.contrib import admin
from .models import Order, Candidate


class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 1


class AuthorAdmin(admin.ModelAdmin):
    inlines = [
        CandidateInline,
    ]


admin.site.register(Order, AuthorAdmin)
