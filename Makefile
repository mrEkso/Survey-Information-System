up:
	docker compose up -d --build

migrate:
	mvn -f backend/pom.xml flyway:migrate

stop:
	docker compose stop

down:
	docker compose down -v

restart:
	make down
	make up