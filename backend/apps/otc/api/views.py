from django.http import Http404
from django.utils.six import BytesIO
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from apps.otc.api.serializers import OneTimeCodeInputSerializer, OneTimeCodeOutputSerializer
from apps.otc.models import OneTimeCode

# "{'uuid':'5ce0e9a5-5ffa-654b-cee0-1238041fb31a'}"

class OTCView(generics.UpdateAPIView):

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OneTimeCodeOutputSerializer
        return OneTimeCodeInputSerializer

    def get_object(self, request):
        uuid = request.data['uuid']
        try:
            return OneTimeCode.objects.get(uuid=uuid)
        except:
            raise Http404()

    def put(self, request):
        otc_model = self.get_object(request)
        serializer = OneTimeCodeOutputSerializer(otc_model, data=request.data,\
                                           partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        raise Http404()


# Create your views here.
