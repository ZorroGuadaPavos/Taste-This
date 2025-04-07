FROM oven/bun:latest AS builder
WORKDIR /tmp

COPY ./package.json ./
COPY ./bun.lock .
COPY ./runtime.ts ./runtime.ts
COPY ./src ./src

RUN bun install --frozen-lockfile
RUN bun add aws4fetch
RUN bun build --compile ./runtime.ts --outfile bootstrap

WORKDIR /tmp/src
RUN bun build --target=bun ./main.js --outfile main.js

WORKDIR /tmp
FROM public.ecr.aws/lambda/provided:al2
COPY --from=builder /tmp/src/main.js ${LAMBDA_TASK_ROOT}/
COPY --from=builder /tmp/bootstrap ${LAMBDA_RUNTIME_DIR}/

CMD ["main.fetch"]
