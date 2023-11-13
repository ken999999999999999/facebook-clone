FROM python:3.9

WORKDIR /workspace/backend

COPY . .

RUN apt-get update 

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 8000 

ENTRYPOINT ["python3"]

CMD ["manage.py", "runserver", "0.0.0.0:8000"]

