# Generated by Django 4.2.7 on 2023-11-27 00:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user_profile', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Categories',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(blank=True, default=None, max_length=3000, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.CharField(blank=True, max_length=4000)),
                ('description', models.CharField(blank=True, max_length=4000)),
                ('post_image', models.CharField(max_length=1000000, null=True)),
                ('post_date_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('title', models.CharField(blank=True, default=None, max_length=3000, null=True)),
                ('source', models.CharField(blank=True, default=None, max_length=3000, null=True)),
                ('origin', models.CharField(blank=True, default=None, max_length=3000, null=True)),
                ('visibility', models.CharField(choices=[('public', 'public'), ('private', 'private'), ('friends only', 'friends only')], max_length=30)),
                ('categories', models.ManyToManyField(blank=True, to='posts.categories')),
                ('message_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='message_to', to='user_profile.userprofile')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
