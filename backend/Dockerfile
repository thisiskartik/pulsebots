FROM python:3.11.7
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
RUN apt update
RUN apt install libreoffice -y
RUN pip install gunicorn
COPY . .
RUN chmod +x ./docker-entrypoint.sh
ENV PYTHONUNBUFFERED=1

ENTRYPOINT [ "./docker-entrypoint.sh" ]
