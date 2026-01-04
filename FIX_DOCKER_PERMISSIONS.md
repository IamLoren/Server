# Виправлення помилки "Permission denied" для Docker на Azure VM

## Проблема
```
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
```

## Швидке рішення (використовуйте sudo)

Якщо потрібно швидко зібрати образ:

```bash
sudo docker build -t backend-app:latest .
```

## Постійне рішення (рекомендовано)

### Крок 1: Додайте користувача до групи docker
```bash
sudo usermod -aG docker $USER
```

### Крок 2: Застосуйте зміни

**Варіант A:** Вийдіть та увійдіть знову в Azure Bastion сесію

**Варіант B:** Активуйте нову групу без виходу:
```bash
newgrp docker
```

### Крок 3: Перевірте, що все працює
```bash
# Перевірте, що ви в групі docker:
groups

# Має показати: azureuser docker ... (docker має бути в списку)

# Перевірте Docker:
docker ps

# Якщо немає помилок - все працює!
```

### Крок 4: Зберіть образ
```bash
docker build -t backend-app:latest .
```

## Перевірка статусу Docker

```bash
# Перевірте, чи запущений Docker daemon:
sudo systemctl status docker

# Якщо не запущений, запустіть:
sudo systemctl start docker

# Додайте в автозапуск:
sudo systemctl enable docker
```

## Повна послідовність команд (copy-paste)

```bash
# 1. Додати користувача до групи docker
sudo usermod -aG docker $USER

# 2. Активувати групу (або вийти/увійти)
newgrp docker

# 3. Перевірити групи
groups

# 4. Перевірити Docker
docker ps

# 5. Зібрати образ
docker build -t backend-app:latest .

# 6. Перевірити створений образ
docker images backend-app
```

## Якщо newgrp не працює

Якщо `newgrp docker` не спрацював, потрібно:

1. **Закрити поточну Bastion сесію**
2. **Відкрити нову Bastion сесію**
3. **Перевірити групи:** `groups`
4. **Спробувати Docker:** `docker ps`

## Альтернатива: Використання sudo (не рекомендовано для production)

Якщо не хочете додавати користувача до групи docker:

```bash
# Збірка з sudo
sudo docker build -t backend-app:latest .

# Запуск з sudo
sudo docker run -d -p 3000:3000 backend-app:latest

# Перегляд логів з sudo
sudo docker logs <container-id>
```

**Недоліки:**
- Потрібно завжди використовувати sudo
- Можливі проблеми з правами на файли
- Менш безпечно

## Troubleshooting

### Помилка: "group 'docker' does not exist"
```bash
# Перевірте, чи встановлений Docker:
docker --version

# Якщо не встановлений, встановіть:
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Помилка: "usermod: group 'docker' does not exist"
```bash
# Створіть групу docker:
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

### Після всіх дій все одно не працює
```bash
# Перевірте права на socket:
ls -la /var/run/docker.sock

# Має бути: srw-rw---- 1 root docker
# Якщо ні, виправте:
sudo chmod 666 /var/run/docker.sock
# Або краще:
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

