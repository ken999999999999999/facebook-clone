FROM python:3.9

RUN apt-get update 

RUN pip install --upgrade pip

FROM node:20

WORKDIR /app

# COPY requirements.txt requirements.txt







