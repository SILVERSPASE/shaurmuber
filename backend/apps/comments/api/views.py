from rest_framework import viewsets, mixins, generics
from rest_framework.generics import GenericAPIView
from apps.comments.models import Comments
from apps.comments.api.serializers import CommentsSerializer
from apps.authentication.models import AuthUser


# class CommentsViewSet(
#                       mixins.ListModelMixin,
#                       mixins.RetrieveModelMixin,
#                       mixins.DestroyModelMixin,
#                       mixins.UpdateModelMixin,
#                       viewsets.GenericViewSet
#                       ):
#     serializer_class = CommentsSerializer
#     queryset = Comments.objects.all()
#
#     lookup_field = 'uuid'
#     lookup_url_kwarg = 'uuid'
#
#     def get_queryset(self):
#         return Comments.objects.filter(status='public', recipient=AuthUser.objects.get(uuid=self.kwargs['uuid']))
#
#     def get_object(self):
#         return Comments.objects.get(uuid=self.kwargs['uuid'])
#



class CommentCreateView(generics.ListCreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer


class CommentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    lookup_field = 'uuid'
    lookup_url_kwarg = 'uuid'


class CommentGetView(generics.ListAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

    def get_queryset(self):
        print(AuthUser.objects.get(uuid=self.kwargs['uuid']))
        return Comments.objects.filter(status='public', recipient=AuthUser.objects.get(uuid=self.kwargs['uuid']))

class CommentGetView(generics.ListAPIView):
    serializer_class = CommentsSerializer
    model = serializer_class.Meta.model

    def get_queryset(self):
        return Comments.objects.filter(status='public', recipient=AuthUser.objects.get(uuid=self.kwargs['uuid']))