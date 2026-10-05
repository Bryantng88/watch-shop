FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=0 \
    RUNNER_ALLOW_RUNASROOT=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        coreutils \
        curl \
        docker-compose-v2 \
        docker.io \
        findutils \
        git \
        gzip \
        jq \
        libicu74 \
        libssl3t64 \
        tar \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /runner

ENTRYPOINT ["/runner/run.sh"]
