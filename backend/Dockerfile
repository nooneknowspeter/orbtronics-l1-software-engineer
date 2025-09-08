FROM python:3.13

WORKDIR /usr/src/app

RUN pip install --no-cache-dir poetry==2.1.4

COPY . .
RUN poetry install

EXPOSE 8000

CMD [ "poetry", "run", "fastapi", "run", "./src/orbtronics_l1_software_engineer_backend/main.py" ]
