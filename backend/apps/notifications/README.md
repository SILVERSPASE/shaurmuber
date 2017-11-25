## How to use notifications app

##### 1. Install RabbitMQ
<<<<<<< HEAD
Visit - /https://www.rabbitmq.com/download.html
=======
Visit - https://www.rabbitmq.com/download.html
>>>>>>> kvpyt-34-registration-by-social-networks

Default guest/guest username and password are used by Celery automatically.

##### 2. Start RabbitMQ
`sudo rabbitmq-server`

##### 3. Start Celery
`celery -A project worker -l info`

##### 4. Import tasks.py
`from apps.notifications.notifications import *`

##### 5. Send email
`Notifications.send_registration_success("Viktor", "Levytskyi",
"hellolevytskyi@gmail.com")`