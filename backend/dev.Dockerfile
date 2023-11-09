FROM python:3.9

WORKDIR /workspace/backend

COPY requirements.txt requirements.txt

RUN apt-get update 

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver",'8000']


