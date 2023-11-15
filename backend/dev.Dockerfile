FROM python:3.9

WORKDIR /workspace/backend

COPY . .

RUN apt-get update 

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python","main.py"]



