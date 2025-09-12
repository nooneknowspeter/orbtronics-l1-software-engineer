.PHONY:  all clean test compose-dev compose-prod

compose-prod:
	docker compose --file compose.prod.yaml up -d
compose-dev:
	docker compose up -d
