import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Create default admin user if not exists'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        username = os.environ.get('ADMIN_USERNAME', 'Admin')
        password = os.environ.get('ADMIN_PASSWORD', 'Admin@1234')
        email    = os.environ.get('ADMIN_EMAIL', 'admin@skilltracker.com')

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(
                f'Admin "{username}" already exists — skipping.'
            ))
            return

        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        user.role = 'admin'
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'Admin "{username}" created successfully.'
        ))
