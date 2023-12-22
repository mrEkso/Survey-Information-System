up:
	docker compose up -d --build

stop:
	docker compose stop

down:
	docker compose down -v

restart:
	make down
	make up
