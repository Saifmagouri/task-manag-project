# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:22-alpine
WORKDIR /app
RUN addgroup -S angular && adduser -S angular -G angular

# Copy only the dist output (server + browser)
COPY --from=build /app/dist/FrontStage ./dist/FrontStage
# Copy package files for production node_modules
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

USER angular:angular
EXPOSE 4000
ENV PORT=4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/ || exit 1
CMD ["node", "dist/FrontStage/server/server.mjs"]
