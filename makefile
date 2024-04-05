.PHONY: *

up-test: bun-run

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

bun-run:
	bun run run


