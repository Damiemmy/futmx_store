from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        code = getattr(exc, "default_code", "error")
        if isinstance(response.data, dict) and "detail" in response.data:
            response.data = {
                "detail": response.data["detail"],
                "code": str(code),
            }
        elif isinstance(response.data, dict):
            response.data = {
                "detail": response.data,
                "code": str(code),
            }
        else:
            response.data = {
                "detail": str(response.data),
                "code": str(code),
            }
        return response

    return Response(
        {"detail": "An unexpected error occurred.", "code": "server_error"},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
