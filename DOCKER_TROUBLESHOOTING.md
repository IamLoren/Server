# Troubleshooting: Cannot find module '/app/build/index.js'

## Проблема
```
Error: Cannot find module '/app/build/index.js'
```

## Можливі причини та рішення

### 1. Перевірте, чи успішно виконався build

Підключіться до контейнера та перевірте:

```bash
# Подивіться логи збірки
sudo docker logs backend-container

# Або підключіться до контейнера
sudo docker exec -it backend-container sh

# Всередині контейнера:
ls -la /app/build/
ls -la /app/build/index.js
```

### 2. Перевірте логи збірки Docker образу

Під час збірки перевірте, чи успішно виконався `npm run build`:

```bash
sudo docker build -t backend-app:latest . 2>&1 | grep -A 10 "npm run build"
```

### 3. Перевірте структуру файлів в контейнері

```bash
# Підключіться до контейнера
sudo docker exec -it backend-container sh

# Перевірте структуру:
cd /app
ls -la
ls -la build/
cat build/index.js | head -20
```

### 4. Можлива проблема з ESM модулями

Якщо проект використовує ESM (`"type": "module"`), перевірте:

```bash
# Всередині контейнера
cat /app/package.json | grep '"type"'
```

Якщо `"type": "module"`, то потрібно використовувати `.js` розширення в імпортах, що вже є в коді.

### 5. Перевірте tsconfig.json

Можлива проблема з `moduleResolution: "bundler"`. Для Node.js краще використовувати:

```json
"moduleResolution": "node"
```

### 6. Перебудуйте образ з детальними логами

```bash
# З детальними логами
sudo docker build --progress=plain --no-cache -t backend-app:latest . 2>&1 | tee build.log

# Перевірте логи
grep -i "error\|fail\|build/index.js" build.log
```

### 7. Типове рішення: Перевірка після build

Додайте в Dockerfile перевірку:

```dockerfile
RUN npm run build && \
    ls -la build/ && \
    test -f build/index.js || (echo "ERROR: build/index.js not found!" && exit 1)
```

### 8. Альтернатива: Використання tsx для запуску

Якщо проблема з компіляцією, можна запускати через tsx:

```dockerfile
# Замість CMD ["node", "build/index.js"]
CMD ["npx", "tsx", "index.ts"]
```

Але це потребує devDependencies, тому не рекомендовано для production.

## Швидка діагностика

Виконайте ці команди на Azure VM:

```bash
# 1. Перевірте логи контейнера
sudo docker logs backend-container

# 2. Підключіться до контейнера
sudo docker exec -it backend-container sh

# 3. Всередині контейнера виконайте:
cd /app
pwd
ls -la
ls -la build/
cat package.json | grep '"type"'
node --version
npm --version

# 4. Спробуйте запустити вручну
node build/index.js
```

## Якщо build/index.js не існує

1. **Перевірте, чи компілюється TypeScript:**
   ```bash
   # В контейнері
   cd /app
   npm run build
   ls -la build/
   ```

2. **Перевірте tsconfig.json:**
   ```bash
   cat tsconfig.json | grep -A 2 "outDir"
   ```

3. **Перебудуйте образ:**
   ```bash
   sudo docker build --no-cache -t backend-app:latest .
   ```

## Якщо файл існує, але не запускається

Можлива проблема з ESM. Спробуйте:

```bash
# В контейнері
node --input-type=module build/index.js
```

Або змініть CMD в Dockerfile:

```dockerfile
CMD ["node", "--input-type=module", "build/index.js"]
```

