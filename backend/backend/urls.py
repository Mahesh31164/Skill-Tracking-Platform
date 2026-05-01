"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/certificates/', include('certificates.urls')),
]

# Always serve media files (needed for local dev and Railway fallback)
# In production with Cloudinary, files are served from Cloudinary CDN directly
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
