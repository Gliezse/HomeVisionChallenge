.PHONY: up down dev

up:
	docker compose up -d --build

down:
	docker compose down

restart: down up

dev:
	npm install
	npm run dev
