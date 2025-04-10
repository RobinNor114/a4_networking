from django.urls import path
from .views import (
    post_list_and_create,
    hello_world_view,
    load_post_data_view,
    like_dislike_post,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-page'),
    path('like-dislike/', like_dislike_post, name='like-dislike'),
    path('hello-world/', hello_world_view, name='hello-world'),
    path('data/<int:num_posts>/', load_post_data_view, name='posts-data'),
]