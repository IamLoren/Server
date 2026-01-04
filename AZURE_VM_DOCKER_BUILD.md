# Інструкція по збірці Docker образу на Azure VM

## Правильна команда для збірки

### Базовий варіант (локальний тег):
```bash
docker build -t backend-app:latest .
```

### Для Azure Container Registry:
```bash
docker build -t myregistry.azurecr.io/backend-app:latest .
```

**Важливо:** 
- Не копіюйте shell prompt (`azureuser@backend-vm:~/Server$`) в команду
- Тег має бути в нижньому регістрі
- Крапка `.` в кінці вказує на поточну директорію як build context

## Крок за кроком

### 1. Перевірте, що ви в правильній директорії:
```bash
pwd
# Має показати: /home/azureuser/Server
```

### 2. Перевірте наявність Dockerfile:
```bash
ls -la Dockerfile
```

### 3. Зберіть Docker образ:
```bash
docker build -t backend-app:latest .
```

### 4. Перевірте створений образ:
```bash
docker images backend-app
```

## Якщо виникають помилки

### Помилка: "invalid reference format"
- **Причина:** Тег містить недопустимі символи або великі літери
- **Рішення:** Використовуйте тільки маленькі літери, цифри, дефіси та крапки

### Помилка: "Cannot connect to the Docker daemon"
- **Рішення:** Перевірте, чи запущений Docker:
```bash
sudo systemctl status docker
sudo systemctl start docker
```

### Помилка: "Permission denied" (найчастіша проблема!)
- **Причина:** Користувач не має прав для доступу до Docker daemon socket
- **Рішення 1 (рекомендовано):** Додайте користувача до групи docker:
```bash
# Додати користувача до групи docker
sudo usermod -aG docker $USER

# Застосувати зміни (вийти та увійти знову, або):
newgrp docker

# Перевірити, що користувач в групі docker:
groups

# Тепер спробуйте знову:
docker build -t backend-app:latest .
```

- **Рішення 2 (швидке, але менш безпечне):** Використовуйте sudo:
```bash
sudo docker build -t backend-app:latest .
```

**Важливо:** Після `sudo usermod -aG docker $USER` потрібно **вийти та увійти знову** в сесію (або перезапустити Bastion підключення), щоб зміни набули чинності!

## Після успішної збірки

### Тестування образу локально:
```bash
docker run -d -p 3000:3000 --name backend-test \
  -e DB_HOST="your-mongodb-connection" \
  -e JWT_SECRET="your-secret" \
  -e PORT="3000" \
  backend-app:latest
```

### Перевірка логів:
```bash
docker logs backend-test
```

### Зупинка тестового контейнера:
```bash
docker stop backend-test
docker rm backend-test
```

## Завантаження в Azure Container Registry

### 1. Увійдіть в ACR:
```bash
az acr login --name myregistry
```

### 2. Зберіть образ з правильним тегом:
```bash
docker build -t myregistry.azurecr.io/backend-app:latest .
```

### 3. Завантажте образ:
```bash
docker push myregistry.azurecr.io/backend-app:latest
```

## Альтернатива: Використання BuildKit (рекомендовано)

Якщо бачите попередження про deprecated legacy builder:

```bash
# Встановіть buildx (якщо ще не встановлено)
docker buildx version

# Створіть builder (якщо потрібно)
docker buildx create --use

# Зберіть з buildx
docker buildx build -t backend-app:latest --load .
```

## Корисні команди

```bash
# Перегляд історії збірки
docker history backend-app:latest

# Перегляд розміру образу
docker images backend-app

# Видалення образу
docker rmi backend-app:latest

# Очищення невикористаних образів
docker image prune -a
```

