from rest_framework import serializers

from apps.payments.models import PayRequest


class PayRequestSerializer(serializers.ModelSerializer):
    order = serializers.CharField()

    class Meta:
        model = PayRequest
        fields = ('order', )
