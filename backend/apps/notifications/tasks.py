from __future__ import absolute_import, unicode_literals
import smtplib
import psycopg2
import traceback
from smtplib import SMTPException
from celery.task import task
from celery.utils.log import get_task_logger
from jinja2 import Environment, PackageLoader, select_autoescape
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = get_task_logger(__name__)

# makes environment for jinja2
env = Environment(
    loader=PackageLoader('apps.notifications', 'templates'),
    autoescape=select_autoescape(['html'])
)


class EmailHTMLSender(object):
    """
    class wrapper for sending emails with methods:
    make_email, send, save_email_to_database
    """
    def __init__(self, recipient, smtp_settings, database_settings, context=None,):
        self.recipient = recipient
        self.context = context
        self.user, self.password, self.email_host, self.email_port = smtp_settings
        self.db_name, self.db_user, self.db_pass, self.db_host = database_settings

    def make_email(self, subject, template):
        """
        creates message for sending by email
        :param subject: string, which configures email subject
        :param template: string - template name for rendering
        :return: msg instance and html content of the email in string format
        """
        html_body = env.get_template(template)
        if self.context:
            html_body = html_body.render(self.context)
        else:
            html_body = html_body.render()
        msg = MIMEMultipart('alternative')
        msg['subject'] = subject
        msg['To'] = self.recipient
        msg['From'] = self.user
        html_body = MIMEText(html_body, 'html')
        msg.attach(html_body)
        return msg, str(html_body)

    def send(self, msg):
        """
        Sends email according to parameters encapsulated in msg instance
        :param msg: msg instance to send via email
        :return: string named status and string name log
        """
        try:
            server = smtplib.SMTP(self.email_host, self.email_port)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(self.user, self.password)
            server.sendmail(self.user, self.recipient, msg.as_string())
            status = 'OK'
            log = 'email successfully sent'
            server.close()
        except SMTPException:
            status = 'KO'
            log = traceback.format_exc()
        except:
            status = 'KO'
            log = traceback.format_exc()

        return status, log

    def save_email_to_database(self, data):
        sql = """INSERT INTO notifications_emaillog(email, subject, html_body, 
                status, sent_log, sent_date) VALUES(%s, %s, %s, %s, %s, now() );"""
        conn = None
        try:
            conn = psycopg2.connect(host=self.db_host, database=self.db_name,
                                    user=self.db_user, password=self.db_pass)
            cur = conn.cursor()
            cur.execute(sql, data)
            conn.commit()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()


@task(name="send_registration_otc_task")
def send_registration_otc_task(email, smtp_settings, database_settings, context):
    """Send email confirmation for user registration with OTC."""

    logger.info("Starting task 'send_registration_otc_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("Email confirmation", "registration_otc.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_registration_otc_task'")


@task(name="send_registration_success_task")
def send_registration_success_task(email, smtp_settings, database_settings, context):
    """Send email notification about successful registration."""
    logger.info("Starting task 'send_registration_success_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("You have been successfully registered!", "registration_success.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_registration_success_task'")


@task(name="send_reset_password_otc_task")
def send_reset_password_otc_task(email, smtp_settings, database_settings, context):
    """Send email confirmation with OTC to reset password."""
    logger.info("Starting task 'send_reset_password_otc_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("Email confirmation for resetting password", "reset_email_otc.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_reset_password_otc_task'")


@task(name="send_reset_password_success_task")
def send_reset_password_success_task(email, smtp_settings, database_settings, context):
    """Send email notification about successful password reset."""
    logger.info("Starting task 'send_reset_password_success_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("Your password successfully changed!", "reset_password_success.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_reset_password_success_task'")


@task(name="send_reset_email_otc_task")
def send_reset_email_otc_task(email, smtp_settings, database_settings, context):
    """Send email confirmation with OTC to reset email."""
    logger.info("Starting task 'send_reset_email_otc_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("Email confirmation for resetting email", "reset_password_otc.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_reset_email_otc_task'")


@task(name="send_reset_email_success_task")
def send_reset_email_success_task(email, smtp_settings, database_settings, context):
    """Send email notification about successful email reset."""
    logger.info("Starting task 'send_reset_email_success_task'")

    new_email = EmailHTMLSender(email, smtp_settings, database_settings, context=context)
    msg, html_body = new_email.make_email("Your email changed successfully!", "reset_email_success.html")
    status, log = new_email.send(msg)
    new_email.save_email_to_database((msg['To'], msg['subject'], html_body, status, log))

    logger.info("Finished task 'send_reset_email_success_task'")
