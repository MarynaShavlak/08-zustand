# 08-zustand

Застосунок NoteHub для роботи з персональною колекцією нотаток на Next.js (App
Router). Фінальна версія проєкту: SEO-метадані та Open Graph для всіх сторінок,
глобальний шрифт Roboto, окрема сторінка створення нотатки та збереження
чернетки за допомогою Zustand. Дані зберігаються на бекенді
[NoteHub API](https://notehub-public.goit.study/api/docs).

**Демо:** https://08-zustand-xi-bay.vercel.app

## Маршрути

- `/` — головна сторінка із загальною інформацією про NoteHub
- `/notes/filter/all` — усі нотатки (пошук, пагінація, видалення)
- `/notes/filter/{tag}` — нотатки з обраним тегом, наприклад `/notes/filter/Work`
- `/notes/action/create` — сторінка створення нотатки
- `/notes/[id]` — сторінка з деталями нотатки (при переході зі списку
  відкривається в модальному вікні)
- будь-який неіснуючий маршрут — сторінка `404 - Page not found`

Адреси `/notes` і `/notes/filter` перенаправляють на `/notes/filter/all`.

## Як це працює

- **SEO та Open Graph.** Кореневий макет `app/layout.tsx` експортує `metadata`
  з назвою та описом застосунку, а також Open Graph-теги `title`,
  `description`, `url` та `images`. Сторінки `not-found.tsx` і
  `notes/action/create/page.tsx` мають власний статичний об'єкт `metadata`.
  Сторінки `notes/filter/[...slug]/page.tsx` і `notes/[id]/page.tsx`
  формують метадані функцією `generateMetadata`: для списку — з урахуванням
  обраного фільтру, для деталей — із заголовком і коротким описом нотатки.
  Спільні значення (адреса сайту, зображення для Open Graph) описано в
  `lib/seo.ts`. Адреса сайту береться зі змінної `NEXT_PUBLIC_SITE_URL`, а на
  Vercel — з production-домену проєкту.
- **Шрифт.** Roboto підключається в `app/layout.tsx` через `next/font/google`
  (`weight`, `variable`, `display`, `subsets`) і застосовується глобально через
  CSS-змінну `--font-roboto`.
- **Створення нотатки.** Кнопка `Create note +` на сторінці списку — посилання
  на `/notes/action/create`. Форма `NoteForm` — звичайна HTML-форма з
  `action`, значення читаються з `FormData` і перевіряються схемою Yup. Після
  успішного створення список нотаток оновлюється, а користувач повертається на
  попередню сторінку. `Cancel` також повертає назад.
- **Чернетка (Zustand).** Стор `lib/store/noteStore.ts` містить `draft`,
  `setDraft(note)` і `clearDraft()`; початковий стан — `initialDraft`
  (`title: ''`, `content: ''`, `tag: 'Todo'`). Кожна зміна поля форми одразу
  записується в `draft` через `onChange`. Middleware `persist` зберігає
  чернетку в `localStorage`, тому вона відновлюється при повторному відкритті
  сторінки створення та після перезавантаження. Чернетка очищується лише після
  успішного створення нотатки, `Cancel` її не змінює.
- **Фільтрація за тегами.** Макет `app/notes/filter/layout.tsx` приймає
  паралельний слот `@sidebar` з меню тегів і `children` зі списком нотаток.
  Невідомий тег у URL перевіряється в `proxy.ts`, тому сервер повертає
  сторінку 404 зі статусом `404`.
- **Модальне вікно нотатки.** Маршрут `app/@modal/(.)notes/[id]` перехоплює
  перехід на `/notes/[id]` і показує нотатку в модальному вікні поверх списку.
- **SSR + CSR.** Сторінки списку, деталей і модального вікна попередньо
  завантажують дані на сервері через TanStack Query (`prefetchQuery`) і
  передають їх клієнтським компонентам через `HydrationBoundary`. Подальші
  запити (пагінація, пошук, створення та видалення) виконуються на клієнті.

## Стек

- Next.js (App Router) + TypeScript
- Zustand (`persist` middleware)
- TanStack Query (React Query)
- Axios
- Yup
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
    ├── action/create/
    │   └── page.tsx
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
├── api/
│   ├── api.ts
│   └── notes.ts
├── store/
│   └── noteStore.ts
├── constants.ts
├── seo.ts
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
# необов'язково: публічна адреса застосунку для Open Graph
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
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
