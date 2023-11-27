from .serializers import PostSerializer, CategoriesSerializer
from .models import Post, Categories
from django.shortcuts import render
from rest_framework import generics
from rest_framework import permissions
from user_profile.permissions import IsOwnerOrReadOnly
from rest_framework import status, viewsets
from rest_framework.response import Response
from .serializers import PostSerializer, CategoriesSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    Posts
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def list(self, request):
        # TODO NOT DONE
        print("list")
        print(request.path)
        ending= request.path.split('/')[-1]
        print(ending)
        # Implement your logic for retrieving a list of posts
        queryset = self.get_queryset()
        local_serializer = self.get_serializer(queryset, many=True)
        print(local_serializer.data)



        external_api_url = "https://cmput404-social-network-401e4cab2cc0.herokuapp.com/service/authors/"
        external_api_response = requests.get(
            external_api_url,
            auth=HTTPBasicAuth('whoiswill', 'cmput404')
        )
        if external_api_response.status_code == 200:
            # Deserialize the external API response
            external_api_data = external_api_response.json()
            # print(external_api_data['results'])
            refactored_external_api_data = []
            for i in external_api_data['items']:
                refactored_external_api_data.append(
                    {
                        "id": i['key'],
                        "username": i['key'],
                        "is_active": 'true',
                        "profile_data": {
                            "id": i['user'],
                            "owner": i['key'],
                            "gender": None,
                            "dob": None,
                            "phone": None,
                            "github": i['github'],
                            "profile_image": None,
                            "follow_requests": [],
                            "following": following_master_list[i['key']]
                        }
                    }
                )
            # team === good send



            # Combine external and internal data
            combined_data = refactored_external_api_data + local_serializer.data



















        return Response(serializer.data)

    def retrieve(self, request, pk):
        print("retrieve")
        # Implement your logic for retrieving a single post by ID
        post = self.get_object()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    '''
    categories
    '''
    queryset = Categories.objects.all()
    serializer_class =  CategoriesSerializer
    