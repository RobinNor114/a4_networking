from django.urls import path
from .views import (
    post_list_and_create,
    load_post_data_view,
    like_dislike_post,
    post_detail,
    post_detail_data_view
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-page'),
    path('like-dislike/', like_dislike_post, name='like-dislike'),
    path('<pk>/',post_detail, name='post_detail'),
    path('<pk>/data/', post_detail_data_view, name='post-detail-data'),
    path('data/<int:num_posts>/', load_post_data_view, name='posts-data'),
]