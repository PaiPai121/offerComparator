# 第一阶段：安装依赖
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 第二阶段：构建项目
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 禁用 Next.js 遥测数据采集
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 第三阶段：生产运行
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 只需要拷贝必要的运行时文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
# 启动 standalone 模式生成的入口文件
CMD ["node", "server.js"]