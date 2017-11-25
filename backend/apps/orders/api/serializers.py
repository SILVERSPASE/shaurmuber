from requests import Response
from rest_framework import serializers
from apps.orders.models import Order, Candidate
from apps.authentication.models import AuthUser
from apps.authentication.api.serializers import PublicUserSerializer, UserObjSerializer


class OrderSerializer(serializers.ModelSerializer):

    customer = serializers.CharField()

    # customer = UserObjSerializer()

    class Meta:
        model = Order
        exclude = ('id',)

    def create(self, validated_data):
        uuid = self.validated_data.get('customer')
        validated_data['customer'] = AuthUser.objects.get(uuid=uuid)
        order = Order.objects.create(**validated_data)
        return order

    def update(self, instance, validated_data):
        customer_uuid = self.validated_data.get('customer')
        if customer_uuid:
            validated_data['customer'] = AuthUser.objects.get(uuid=customer_uuid)

        for i in validated_data:
            setattr(instance, i, validated_data[i])
        instance.save()
        return instance


class OrderAssignCourier(serializers.ModelSerializer):
    curier = serializers.CharField(required=False)

    class Meta:
        model = Order
        exclude = ('id',)

    def update(self, instance, validated_data):

        curier_uuid = self.validated_data.get('curier')
        if curier_uuid:
            validated_data['curier'] = AuthUser.objects.get(uuid=curier_uuid)
        for i in validated_data:
            setattr(instance, i, validated_data[i])
        instance.save()
        return instance


class OrderGetSerializer(serializers.ModelSerializer):

    # customer = PublicUserSerializer()
    # curier = PublicUserSerializer()
    customers_rate = serializers.CharField(source='get_customers_rate')  # need for filtering on frontend

    customer = UserObjSerializer()
    curier = UserObjSerializer()

    class Meta:
        model = Order
        fields = "__all__"


class HttpResponseForbidden(object):
    pass


class CandidateCreateSerializer(serializers.ModelSerializer):
    candidate = serializers.CharField()
    order = serializers.CharField()

    class Meta:
        model = Candidate
        fields = '__all__'

    def create(self, validated_data):
        me = AuthUser.objects.get(uuid=validated_data["candidate"])
        order = Order.objects.get(uuid=validated_data["order"])
        if Candidate.objects.filter(candidate=me, order=order):
            return False
        candidate = Candidate.objects.create(candidate=me, order=order)
        return candidate


class CandidateGetSerializer(serializers.ModelSerializer):
    candidate = PublicUserSerializer()

    class Meta:
        model = Candidate
        fields = '__all__'


class OrderFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('order_price',)
