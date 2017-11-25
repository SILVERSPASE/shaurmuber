from rest_framework import serializers
from apps.otc.models import OneTimeCode
from apps.otc.otc_fabric import OTCFabric
from django.http import Http404

class OneTimeCodeOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = OneTimeCode
        fields = ['otc_type']

    def update(self, instance, validated_data):
        otc_fabric = OTCFabric()
        otc = otc_fabric.fabric(instance)
        if otc:
            otc.execute()
            return instance
        raise Http404()


class OneTimeCodeInputSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format='hex_verbose')

    class Meta:
        model = OneTimeCode
        fields = ['uuid']
