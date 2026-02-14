# from logging.config import dictConfig
#
#
# def configure_loggin():
#     dictConfig({
#         'version': 1,
#         'disable_existing_loggers': False,
#         "formatters": {
#           "console": {
#           "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
#           }
#         'handlers': dict(default={
#             'class': 'logging.StreamHandler',
#             'level': 'DEBUG',
#             'formatter': 'console'
#         }
#         "loggers": {
#             "storeapi": {
#                 "handlers": ["default"],
#                 "level": "DEBUG"
#             }
#         }
#
#
#     })