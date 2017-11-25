#!/bin/sh

echo "Starting migrations..."
python manage.py migrate
echo "Migrations finished..."
echo "Starting tests...." 
#yes yes | python manage.py test
python manage.py test --verbosity=2
#exit $?
echo "Testing complete..."
