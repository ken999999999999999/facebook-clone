FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./apps /code/apps

ENV PYTHONPATH "${PYTHONPATH}:/code"

EXPOSE 8000

CMD ["python","apps/main.py"]


