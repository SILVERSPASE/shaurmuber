#!/bin/sh

echo "Starting deployment..." 
python manage.py migrate
uwsgi --http :8000 --module project.wsgi
echo "Deployment Finished!" 