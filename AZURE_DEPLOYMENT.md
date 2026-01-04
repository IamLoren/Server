# Інструкція по деплою в Azure

## Варіанти деплою

### Варіант 1: Azure Container Apps (Рекомендовано)

Azure Container Apps - це сучасний сервіс для запуску контейнерів без необхідності керувати інфраструктурою.

#### Крок 1: Підготовка

1. Встановіть Azure CLI:

    ```bash
    # Windows (через PowerShell)
    Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
    ```

2. Увійдіть в Azure:

    ```bash
    az login
    ```

3. Створіть Resource Group:

    ```bash
    az group create --name myResourceGroup --location eastus
    ```

4. Створіть Azure Container Registry (ACR):
    ```bash
    az acr create --resource-group myResourceGroup --name myregistry --sku Basic
    ```

#### Крок 2: Збірка та публікація образу

1. Увійдіть в ACR:

    ```bash
    az acr login --name myregistry
    ```

2. Зберіть Docker образ:

    ```bash
    docker build -t myregistry.azurecr.io/server-app:latest .
    ```

3. Завантажте образ в ACR:
    ```bash
    docker push myregistry.azurecr.io/server-app:latest
    ```

#### Крок 3: Створення Container App

1. Створіть Container App Environment:

    ```bash
    az containerapp env create \
      --name my-container-env \
      --resource-group myResourceGroup \
      --location eastus
    ```

2. Створіть Container App:
    ```bash
    az containerapp create \
      --name server-app \
      --resource-group myResourceGroup \
      --environment my-container-env \
      --image myregistry.azurecr.io/server-app:latest \
      --registry-server myregistry.azurecr.io \
      --target-port 3000 \
      --ingress external \
      --env-vars "DB_HOST=your-mongodb-connection-string" "JWT_SECRET=your-jwt-secret" "PORT=3000"
    ```

### Варіант 2: Azure App Service (Web App for Containers)

#### Крок 1: Створення App Service Plan

```bash
az appservice plan create \
  --name myAppServicePlan \
  --resource-group myResourceGroup \
  --is-linux \
  --sku B1
```

#### Крок 2: Створення Web App

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name my-server-app \
  --deployment-container-image-name myregistry.azurecr.io/server-app:latest
```

#### Крок 3: Налаштування змінних оточення

```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name my-server-app \
  --settings \
    DB_HOST="your-mongodb-connection-string" \
    JWT_SECRET="your-jwt-secret" \
    PORT="3000" \
    NODE_ENV="production"
```

#### Крок 4: Налаштування Continuous Deployment

```bash
az webapp deployment container config \
  --name my-server-app \
  --resource-group myResourceGroup \
  --enable-cd true
```

### Варіант 3: Azure Container Instances (ACI)

Для швидкого тестування:

```bash
az container create \
  --resource-group myResourceGroup \
  --name server-app \
  --image myregistry.azurecr.io/server-app:latest \
  --dns-name-label my-server-app \
  --ports 3000 \
  --environment-variables \
    DB_HOST="your-mongodb-connection-string" \
    JWT_SECRET="your-jwt-secret" \
    PORT="3000"
```

## Налаштування змінних оточення

Обов'язкові змінні оточення для роботи додатку:

-   `DB_HOST` - рядок підключення до MongoDB
-   `JWT_SECRET` - секретний ключ для JWT токенів
-   `PORT` - порт сервера (за замовчуванням 3000)

Додаткові змінні (якщо використовуються):

-   `CLOUDINARY_CLOUD_NAME` - для Cloudinary
-   `CLOUDINARY_API_KEY` - для Cloudinary
-   `CLOUDINARY_API_SECRET` - для Cloudinary

## MongoDB в Azure

Рекомендовано використовувати:

-   **Azure Cosmos DB** (MongoDB API) - повністю керований сервіс
-   **MongoDB Atlas** - хмарний сервіс MongoDB

## Перевірка деплою

Після деплою перевірте:

1. Логи контейнера:

    ```bash
    az containerapp logs show --name server-app --resource-group myResourceGroup
    ```

2. Статус додатку:

    ```bash
    az webapp show --name my-server-app --resource-group myResourceGroup --query state
    ```

3. Тестування API:
    ```bash
    curl https://my-server-app.azurecontainerapps.io/api/auth/signin
    ```

## Troubleshooting

### Помилка підключення до бази даних

-   Перевірте, чи MongoDB доступна з Azure
-   Перевірте firewall правила
-   Перевірте правильність connection string

### Помилка при збірці образу

-   Перевірте, чи всі файли скопійовані (перевірте .dockerignore)
-   Перевірте, чи `npm run build` виконується успішно

### Помилка при запуску

-   Перевірте логи контейнера
-   Перевірте змінні оточення
-   Перевірте, чи порт 3000 відкритий

## Оптимізація

1. **Multi-stage build** - для зменшення розміру образу:

    ```dockerfile
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build

    FROM node:18-alpine AS production
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci --only=production
    COPY --from=builder /app/build ./build
    CMD ["node", "build/index.js"]
    ```

2. **Health checks** - додайте health check endpoint в Express
3. **Scaling** - налаштуйте auto-scaling в Azure Container Apps
