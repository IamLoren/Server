# Використовуємо офіційний Node.js образ (Alpine для меншого розміру)
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо всі залежності (включаючи dev для збірки TypeScript)
RUN npm ci

# Копіюємо весь вихідний код
COPY . .

# Компілюємо TypeScript в JavaScript
RUN npm run build

# Видаляємо devDependencies та непотрібні файли для зменшення розміру
RUN npm prune --production && \
    rm -rf node_modules/.cache && \
    rm -rf coverage aws && \
    rm -rf .git

# Встановлюємо змінну оточення для production
ENV NODE_ENV=production

# Відкриваємо порт (за замовчуванням 3000, але можна змінити через змінні оточення)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запускаємо скомпільований JavaScript
CMD ["node", "build/index.js"]

