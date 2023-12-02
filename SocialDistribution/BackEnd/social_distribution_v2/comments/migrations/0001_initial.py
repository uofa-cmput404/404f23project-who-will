# Generated by Django 4.2.7 on 2023-12-02 22:22

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('foreign', models.UUIDField(default=uuid.uuid4)),
                ('comment', models.CharField(max_length=4000)),
                ('comment_image', models.ImageField(blank=True, null=True, upload_to='comment_image')),
                ('post_date_time', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
