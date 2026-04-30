from django.db import migrations


def create_default_admin(apps, schema_editor):
    """Create the default admin superuser if it doesn't already exist."""
    from django.contrib.auth import get_user_model
    User = get_user_model()

    username = 'Admin'
    password = 'Admin@1234'
    email    = 'admin@skilltracker.com'

    if not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        user.role = 'admin'
        user.save()
        print(f'[OK] Default admin "{username}" created successfully.')
    else:
        print(f'[SKIP] Admin "{username}" already exists.')


def reverse_create_admin(apps, schema_editor):
    """Reverse: remove the default admin (only if it exists)."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.filter(username='Admin').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_remove_passwordresettoken_user_and_more'),
    ]

    operations = [
        migrations.RunPython(create_default_admin, reverse_create_admin),
    ]
