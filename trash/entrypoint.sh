#!/bin/sh

python manage.py migrate
python manage.py collectstatic --noinput


if [ -f data.json ]; then
    python manage.py loaddata data.json
fi

exec "$@"