# RecruitAI Frontend

Фронтенд-приложение для системы автоматизации подбора персонала RecruitAI.

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Zustand** - управление состоянием
- **Axios** - HTTP клиент
- **Recharts** - графики и диаграммы

## Структура проекта

```
frontend/
├── src/
│   ├── app/              # Next.js App Router страницы
│   │   ├── dashboard/    # Дашборд
│   │   ├── candidates/   # Кандидаты
│   │   ├── vacancies/    # Вакансии
│   │   ├── analytics/    # Аналитика
│   │   ├── integrations/ # Интеграции
│   │   ├── login/        # Страница входа
│   │   └── register/     # Страница регистрации
│   ├── components/       # React компоненты
│   ├── store/           # Zustand store
│   ├── services/        # API клиенты
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript типы
│   └── utils/           # Утилиты
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Установка

```bash
npm install
```

## Запуск

```bash
# Режим разработки
npm run dev

# Сборка
npm run build

# Продакшен
npm start
```

## Переменные окружения

Создайте файл `.env.local`:

```env
API_URL=http://localhost:3001
```

## Основные функции

- **Аутентификация** - вход, регистрация, JWT токены
- **Дашборд** - статистика, воронка подбора, последние кандидаты
- **Кандидаты** - список, фильтрация, скоринг, чат
- **Вакансии** - CRUD операции
- **Аналитика** - метрики, конверсии, причины отказов
- **Интеграции** - подключение hh.ru, Telegram, WhatsApp

## API

Все API запросы идут на бэкенд через axios инстанс с автоматической обработкой токенов.

## Авторизация

Тестовые учетные данные:
- Email: admin@example.com
- Пароль: admin123
