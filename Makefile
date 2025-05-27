# =====================
# Makefile for Online Survey System
# =====================

.PHONY: up down stop restart dev help rebuild-frontend

## Запустити всі сервіси (Back, Front, БД) у Docker
up:
	docker compose up -d --build

## Зупинити всі сервіси (без видалення даних)
stop:
	docker compose stop

## Зупинити і видалити всі сервіси та volume
# (повне очищення, включно з БД)
down:
	docker compose down -v

## Перезапустити всі сервіси з повним очищенням
restart:
	make down
	make up

## Повна перезбірка фронтенд-образу (зупинити, видалити, очистити node_modules, зібрати і запустити)
rebuild-frontend:
	docker compose stop react-app || true
	docker compose rm -f react-app || true
	rm -rf frontend/node_modules
	docker compose build react-app
	docker compose up -d react-app

## Dev-режим: база та фронт у Docker, бекенд локально
# (зручно для розробки)
dev:
	docker compose up -d mysql react-app
	# Запусти локально Spring Boot для хот-релоаду (Java)
	C:\\Users\\main\\.cursor\\extensions\\redhat.java-1.41.1-win32-x64\\jre\\21.0.6-win32-x86_64\\bin\\java.exe @C:\\Users\\main\\AppData\\Local\\Temp\\cp_728p990r9mvdru9d6frvz7a3v.argfile com.oss.OnlineSurveySystemApplication

## Показати всі доступні команди
help:
	@echo "Доступні команди:"
	@echo "  make up       - Запустити всі сервіси (бекенд, фронт, БД) у Docker"
	@echo "  make stop     - Зупинити всі сервіси (без видалення даних)"
	@echo "  make down     - Зупинити і видалити всі сервіси та volume (очищення)"
	@echo "  make restart  - Перезапустити всі сервіси з очищенням"
	@echo "  make dev      - Dev-режим: база та фронт у Docker, бекенд локально"
	@echo "  make help     - Показати цю підказку"