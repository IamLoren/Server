# Виправлення проблеми з компіляцією index.ts

## Проблема
Файл `index.ts` не компілюється в Docker контейнері, хоча локально все працює.

## Причина
В `tsconfig.json` було налаштовано:
```json
"include": [
    "src/**/*",
    "**/*.test.ts",   
    "**/*.test.tsx"
]
```

Але `index.ts` знаходиться в корені проекту, не в `src/`, тому TypeScript може не компілювати його під час збірки в Docker.

## Рішення
Оновлено `tsconfig.json`:
```json
"include": [
    "**/*.ts",
    "**/*.tsx"
],
"exclude": [
    "node_modules",
    "build",
    "coverage",
    "aws"
]
```

Тепер TypeScript буде компілювати **всі** `.ts` файли в проекті, включаючи `index.ts` в корені.

## Перевірка

### Локально:
```bash
npm run build
ls -la build/index.js
```

### В Docker:
```bash
# Перебудуйте образ
sudo docker build --no-cache -t backend-app:latest .

# Перевірте, що файл існує
sudo docker run --rm backend-app:latest ls -la /app/build/index.js
```

## Альтернативне рішення (якщо проблема залишається)

Якщо проблема залишається, можна явно вказати файли для компіляції:

```json
"include": [
    "index.ts",
    "**/*.ts",
    "**/*.tsx"
]
```

Або використати `files` замість `include`:
```json
"files": [
    "index.ts"
],
"include": [
    "**/*.ts"
]
```

