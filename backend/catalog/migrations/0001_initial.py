import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Author",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("bio", models.TextField(blank=True)),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Category",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100, unique=True)),
                ("slug", models.SlugField(max_length=120, unique=True)),
            ],
            options={"verbose_name_plural": "categories", "ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="Book",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("slug", models.SlugField(max_length=280, unique=True)),
                ("isbn", models.CharField(max_length=20, unique=True)),
                ("description", models.TextField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("stock", models.PositiveIntegerField(default=0)),
                ("cover_image", models.ImageField(blank=True, null=True, upload_to="books/covers/")),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("authors", models.ManyToManyField(blank=True, related_name="books", to="catalog.author")),
                ("category", models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="books", to="catalog.category")),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.AddIndex(
            model_name="book",
            index=models.Index(fields=["slug"], name="catalog_boo_slug_123abc_idx"),
        ),
        migrations.AddIndex(
            model_name="book",
            index=models.Index(fields=["isbn"], name="catalog_boo_isbn_456def_idx"),
        ),
        migrations.AddIndex(
            model_name="book",
            index=models.Index(fields=["is_active"], name="catalog_boo_is_acti_789ghi_idx"),
        ),
    ]
