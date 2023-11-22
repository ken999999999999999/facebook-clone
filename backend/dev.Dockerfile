FROM python:3.9

WORKDIR /workspace/backend

COPY . .

RUN apt-get update 

RUN pip install --upgrade pip

RUN pip install debugpy

RUN pip install -r requirements.txt

CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "apps/main.py"]


