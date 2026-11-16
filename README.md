# 08-zustand

Застосунок NoteHub для роботи з персональною колекцією нотаток на Next.js (App
Router) з розширеною маршрутизацією: сторінка Not found, фільтрація нотаток за
тегами через паралельні маршрути та модальне вікно з деталями нотатки через
перехоплення маршрутів. Дані зберігаються на бекенді
[NoteHub API](https://notehub-public.goit.study/api/docs).

**Демо:** https://07-routing-nextjs-neon-zeta.vercel.app

## Маршрути

- `/` — головна сторінка із загальною інформацією про NoteHub
- `/notes/filter/all` — усі нотатки (пошук, пагінація, створення та видалення)
- `/notes/filter/{tag}` — нотатки з обраним тегом, наприклад `/notes/filter/Work`
- `/notes/[id]` — сторінка з деталями нотатки
- будь-який неіснуючий маршрут — сторінка `404 - Page not found`

Адреси `/notes` і `/notes/filter` перенаправляють на `/notes/filter/all`.

## Як це працює

- **Фільтрація за тегами.** Макет `app/notes/filter/layout.tsx` приймає
  паралельний слот `@sidebar` з меню тегів (`SidebarNotes`) і `children` зі
  списком нотаток. Список рендериться catch-all маршрутом `[...slug]`, тому при
  виборі тегу змінюються лише URL і область нотаток, а меню та решта сторінки
  не перезавантажуються. Тег передається бекенду в параметрі `tag`; для
  `all` параметр не передається. Перелік тегів описано в `lib/constants.ts`.
  Невідомий тег у URL (наприклад, `/notes/filter/Foo`) перевіряється в
  `proxy.ts` ще до рендеру, тому сервер повертає сторінку 404 зі статусом `404`.
- **Модальне вікно нотатки.** Кореневий макет має паралельний слот `@modal`.
  Маршрут `app/@modal/(.)notes/[id]` перехоплює перехід на `/notes/[id]` і
  показує `NotePreview` у модальному вікні поверх поточного списку. Закриття
  (кнопка, `Escape` або клік по бекдропу) викликає `router.back()` і повертає
  на сторінку, з якої вікно відкрили, наприклад `/notes/filter/Work`. При
  прямому відкритті або оновленні `/notes/[id]` показується повна сторінка
  нотатки.
- **SSR + CSR.** Сторінки списку, деталей і модального вікна попередньо
  завантажують дані на сервері через TanStack Query (`prefetchQuery`) і
  передають їх клієнтським компонентам через `HydrationBoundary`. Подальші
  запити (пагінація, пошук, створення та видалення нотаток) виконуються на
  клієнті.

## Стек

- Next.js (App Router) + TypeScript
- TanStack Query (React Query)
- Axios
- Formik + Yup
- React Paginate
- use-debounce
- React Hot Toast
- CSS Modules
- modern-normalize
- Prettier

## Структура

```
app/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── not-found.tsx
├── @modal/
│   ├── default.tsx
│   └── (.)notes/[id]/
│       ├── page.tsx
│       └── NotePreview.client.tsx
└── notes/
    ├── [id]/
    │   ├── page.tsx
    │   ├── NoteDetails.client.tsx
    │   └── error.tsx
    └── filter/
        ├── layout.tsx
        ├── @sidebar/
        │   └── default.tsx
        └── [...slug]/
            ├── page.tsx
            ├── Notes.client.tsx
            ├── loading.tsx
            └── error.tsx
components/
├── EmptyState/
├── Footer/
├── Header/
├── Loader/
├── Modal/
├── NoteForm/
├── NoteList/
├── Pagination/
├── SearchBox/
└── TanStackProvider/
lib/
├── api.ts
├── constants.ts
└── utils.ts
types/
└── note.ts
proxy.ts
```

## Змінні оточення

Для запитів до бекенда потрібен персональний токен доступу. Його можна
отримати в [документації бекенда](https://notehub-public.goit.study/api/docs)
(маршрут `POST /auth`). Створіть у корені проєкту файл `.env.local` (за зразком
`.env.example`):

```
NEXT_PUBLIC_NOTEHUB_TOKEN=your_notehub_access_token
```

## Запуск

```bash
npm install
npm run dev
```

Застосунок буде доступний за адресою http://localhost:3000.

## Скрипти

- `npm run dev` — dev-сервер
- `npm run build` — production-збірка
- `npm run start` — запуск production-збірки
- `npm run lint` — лінтинг (ESLint)
- `npm run format` — форматування коду через Prettier
