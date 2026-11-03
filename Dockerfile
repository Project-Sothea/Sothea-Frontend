FROM ghcr.io/pnpm/pnpm:12-alpine AS build

RUN apk add --no-cache nodejs

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

ARG VITE_API_URL="/api"
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine-slim AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# FROM caddy:alpine AS production

# COPY --from=build /app/dist /usr/share/caddy
# COPY Caddyfile /etc/caddy/Caddyfile
