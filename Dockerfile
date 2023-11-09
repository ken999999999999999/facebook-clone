FROM python:3.9
FROM node:20 as node

RUN apt-get update 

RUN pip install --upgrade pip



WORKDIR /app

# COPY requirements.txt requirements.txt







