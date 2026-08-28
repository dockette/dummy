DOCKER_IMAGE=dockette/dummy
DOCKER_VARIANT?=mcp
DOCKER_TAG?=$(DOCKER_VARIANT)
DOCKER_PLATFORMS?=linux/amd64,linux/arm64

MCP_PORT?=3000

.PHONY: install
install:
	cd ${DOCKER_VARIANT} && bun install --frozen-lockfile

.PHONY: test
test:
	cd ${DOCKER_VARIANT} && bun test

.PHONY: typecheck
typecheck:
	cd ${DOCKER_VARIANT} && bun run typecheck

.PHONY: start
start:
	cd ${DOCKER_VARIANT} && bun run start

.PHONY: dev
dev:
	cd ${DOCKER_VARIANT} && bun run dev

.PHONY: build
build:
	docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_VARIANT}/

.PHONY: push
push:
	docker buildx build --platform ${DOCKER_PLATFORMS} -t ${DOCKER_IMAGE}:${DOCKER_TAG} --push ${DOCKER_VARIANT}/

.PHONY: run
run:
	docker run --rm -it -p ${MCP_PORT}:3000 -e MCP_WHO=dummy ${DOCKER_IMAGE}:${DOCKER_TAG}

# Smoke test: start the image, list the tools, call both of them
.PHONY: test-docker
test-docker:
	docker run --rm -d --name dummy-smoke -p 13000:3000 -e MCP_WHO=smoke ${DOCKER_IMAGE}:${DOCKER_TAG}
	MCP_URL=http://127.0.0.1:13000 ./${DOCKER_VARIANT}/tests/smoke.sh; \
	status=$$?; \
	docker rm -f dummy-smoke > /dev/null; \
	exit $$status
