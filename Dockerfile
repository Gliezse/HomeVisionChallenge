# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE
ARG VITE_INQUIRY_EMAIL
ARG VITE_INQUIRY_SUBJECT
RUN \
  if [ -n "${VITE_API_BASE}" ]; then export VITE_API_BASE="${VITE_API_BASE}"; fi && \
  if [ -n "${VITE_INQUIRY_EMAIL}" ]; then export VITE_INQUIRY_EMAIL="${VITE_INQUIRY_EMAIL}"; fi && \
  if [ -n "${VITE_INQUIRY_SUBJECT}" ]; then export VITE_INQUIRY_SUBJECT="${VITE_INQUIRY_SUBJECT}"; fi && \
  npm run build

FROM nginx:1.27-alpine AS runner

COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null || exit 1
