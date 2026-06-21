#!/bin/sh
set -e

echo "Waiting for database..."
python -c "
import os, time, sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'futreg.settings')
django.setup()
from django.db import connection
for i in range(30):
    try:
        connection.ensure_connection()
        break
    except Exception:
        time.sleep(1)
else:
    sys.exit('Database unavailable')
"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn futreg.wsgi:application --bind 0.0.0.0:8000 --workers 3
