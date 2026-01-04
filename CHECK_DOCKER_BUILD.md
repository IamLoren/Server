# Швидка перевірка проблеми з Docker build

## На Azure VM виконайте ці команди:

### 1. Перевірте логи контейнера:
```bash
sudo docker logs backend-container
```

### 2. Підключіться до контейнера:
```bash
sudo docker exec -it backend-container sh
```

### 3. Всередині контейнера перевірте:
```bash
# Перевірте поточну директорію
pwd
# Має бути: /app

# Перевірте наявність файлів
ls -la

# Перевірте наявність build директорії
ls -la build/

# Перевірте наявність index.js
ls -la build/index.js

# Якщо файл не існує, перевірте package.json
cat package.json | grep '"type"'

# Спробуйте запустити build вручну
npm run build

# Перевірте результат
ls -la build/
```

### 4. Якщо build/index.js не існує:

**Варіант A:** Перебудуйте образ з очищенням кешу:
```bash
# На VM (вийдіть з контейнера спочатку)
sudo docker build --no-cache -t backend-app:latest .
```

**Варіант B:** Перевірте, чи компілюється TypeScript локально:
```bash
# На VM в директорії Server
npm run build
ls -la build/
```

### 5. Якщо файл існує, але не запускається:

Можлива проблема з ESM. Спробуйте в контейнері:
```bash
node --input-type=module build/index.js
```

## Оновлений Dockerfile

Я оновив Dockerfile, щоб він перевіряв наявність файлу після build. Перебудуйте образ:

```bash
sudo docker build --no-cache -t backend-app:latest .
```

## Оновлений tsconfig.json

Я змінив `moduleResolution` з `"bundler"` на `"node"` для правильної роботи з Node.js. Перебудуйте образ після цієї зміни.

