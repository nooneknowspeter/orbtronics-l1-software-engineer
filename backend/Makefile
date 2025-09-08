.PHONY: all clean test

MAIN_SRC_FILE=./src/orbtronics_l1_software_engineer_backend/main.py

dev:
	poetry run fastapi dev ${MAIN_SRC_FILE}
run:
	poetry run fastapi run ${MAIN_SRC_FILE}
pyright:
	chmod +x ./scripts/pyrightconfig.sh
	./scripts/pyrightconfig.sh
