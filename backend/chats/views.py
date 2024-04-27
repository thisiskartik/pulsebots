from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED, HTTP_200_OK
from django.core.exceptions import ObjectDoesNotExist
from django.http import StreamingHttpResponse
from .models import Chat, Message
from .serializers import ChatSerializer
from .chain import build_chain


@api_view(['POST'])
def create_chat(request):
    if 'chatbot' not in request.data:
        return Response({'error': 'Missing parameters'}, status=HTTP_400_BAD_REQUEST)

    try:
        chatbot = request.user.chatbot_set.get(id=request.data['chatbot'])
    except ObjectDoesNotExist:
        return Response({'error': 'Invalid chatbot'}, status=HTTP_400_BAD_REQUEST)

    chat = Chat.objects.create(chatbot=chatbot, user=request.user)
    Message.objects.create(chat=chat,
                           message=f"You're are {chatbot.name} with the following description:\n{chatbot.description}\n"
                                   f"Answer all the questions in the given context only. Don\'t assume anything or"
                                   f"makeup any facts",
                           message_type='system')
    Message.objects.create(chat=chat,
                           message=chatbot.greeting_message,
                           message_type='ai')

    return Response(ChatSerializer(chat).data, status=HTTP_201_CREATED)


@api_view(['GET'])
def get_chat(request, chat_id):
    try:
        chat = request.user.chat_set.get(id=chat_id)
    except ObjectDoesNotExist:
        return Response({'error': 'Invalid chat'}, status=HTTP_400_BAD_REQUEST)

    return Response(ChatSerializer(chat).data, status=HTTP_200_OK)


@api_view(['POST'])
def invoke_chat(request, chat_id):
    if 'message' not in request.data:
        return Response({'error': 'Missing parameters'}, status=HTTP_400_BAD_REQUEST)

    try:
        chat = request.user.chat_set.get(id=chat_id)
    except ObjectDoesNotExist:
        return Response({'error': 'Invalid chat'}, status=HTTP_400_BAD_REQUEST)

    chain = build_chain(chat.id, chat.chatbot)
    message = chain.stream({"question": request.data['message']})
    return StreamingHttpResponse(message, content_type='text/event-stream')
