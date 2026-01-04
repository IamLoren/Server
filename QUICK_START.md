# Швидкий старт для деплою в Azure

## Локальне тестування Docker образу

1. **Зберіть Docker образ:**
   ```bash
   docker build -t server-app:latest .
   ```

2. **Запустіть контейнер локально:**
   ```bash
   docker run -p 3000:3000 --env-file .env server-app:latest
   ```

   Або використовуйте docker-compose:
   ```bash
   docker-compose up --build
   ```

3. **Перевірте роботу:**
   ```bash
   curl http://localhost:3000/health
   ```

## Швидкий деплой в Azure Container Apps

### 1. Підготовка (один раз)

```bash
# Увійдіть в Azure
az login

# Створіть Resource Group
az group create --name myResourceGroup --location eastus

# Створіть Azure Container Registry
az acr create --resource-group myResourceGroup --name myregistry --sku Basic
```

### 2. Збірка та публікація

```bash
# Увійдіть в ACR
az acr login --name myregistry

# Зберіть та завантажте образ
docker build -t myregistry.azurecr.io/server-app:latest .
docker push myregistry.azurecr.io/server-app:latest
```

### 3. Створення Container App

```bash
# Створіть Environment
az containerapp env create \
  --name my-container-env \
  --resource-group myResourceGroup \
  --location eastus

# Створіть Container App
az containerapp create \
  --name server-app \
  --resource-group myResourceGroup \
  --environment my-container-env \
  --image myregistry.azurecr.io/server-app:latest \
  --registry-server myregistry.azurecr.io \
  --target-port 3000 \
  --ingress external \
  --env-vars "DB_HOST=your-mongodb-connection" "JWT_SECRET=your-secret" "PORT=3000"
```

### 4. Отримайте URL

```bash
az containerapp show \
  --name server-app \
  --resource-group myResourceGroup \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

## Важливі змінні оточення

Обов'язково налаштуйте в Azure:
- `DB_HOST` - MongoDB connection string
- `JWT_SECRET` - секретний ключ для JWT
- `PORT` - порт (за замовчуванням 3000)

## Оптимізований Dockerfile

Для production використовуйте `Dockerfile.optimized` (multi-stage build, менший розмір):

```bash
docker build -f Dockerfile.optimized -t server-app:latest .
```

## Детальні інструкції

Дивіться [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) для повної документації.

