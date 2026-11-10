FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl git bubblewrap \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g @openai/codex@0.166.0 \
 && npm cache clean --force
RUN ln -s /usr/local/lib/node_modules/@openai/codex/node_modules/@openai/codex-linux-x64/vendor/x86_64-unknown-linux-musl/bin/codex /usr/local/bin/codex-linux-sandbox
RUN mkdir -p /opt/worker /work/repo /work/runs /work/results /var/lib/codex/auth /run/worker \
 && chown -R node:node /work /var/lib/codex /run/worker
COPY worker.mjs container-start.mjs order-worker.mjs order-plan-schema.json sales-worker.mjs sales-intake-protocol.mjs sales-turn-schema.json /opt/worker/
COPY ben-code-worker.mjs /opt/worker/
COPY customer-assistant-worker.mjs customer-assistant-protocol.mjs customer-queue.mjs customer-turn-schema.json /opt/worker/
ENV HOME=/home/node CODEX_HOME=/var/lib/codex/auth
USER node
WORKDIR /work/repo
CMD ["node", "/opt/worker/container-start.mjs"]
