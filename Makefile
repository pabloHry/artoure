build:
	cd server && $(MAKE) build

run:
	docker-compose up -d --build

recreate:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

clean :
	docker-compose kill && docker system prune --force --volumes	