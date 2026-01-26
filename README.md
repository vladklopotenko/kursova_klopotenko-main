# Your Energy (SPA)

Односторінковий застосунок (Vanilla JS + Vite) для перегляду категорій та вправ, додавання до улюблених, оцінювання вправ і підписки на розсилку.

## Запуск локально

```bash
npm i
npm run dev
```

## Збірка

```bash
npm run build
npm run preview
```

## API

Використовується API: `https://your-energy.b.goit.study`.

- Swagger: https://your-energy.b.goit.study/api-docs/#/
- Figma: https://www.figma.com/file/1ifqGcQBIzMoc21yIqyV5q/Your-energy?type=design&node-id=205-6586&mode=design

## Функціонал

- Quote of the day (кешування 1 раз на день у localStorage)
- Фільтри: Muscles / Body parts / Equipment
- Категорії → каталог вправ
- Пошук за ключовим словом
- Пагінація (page + limit)
- Модальне вікно вправи + форма оцінювання
- Favorites (localStorage)
- Підписка на email (subscription)

## Deploy

GitHub Pages (через Actions):
- https://github.com/vladklopotenko/kursova_klopotenko-main
