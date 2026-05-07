# Build Stage
FROM node:20-alpine AS builder

# Use USTC Mirror
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

WORKDIR /app
COPY package*.json ./

# Config registry for speed if needed, though mostly reliable standard
RUN npm config set registry https://registry.npmmirror.com

RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
