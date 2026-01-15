# HealthMe — Roadmap (от нуля до готового продукта)

Основано на ТЗ проекта HealthMe fileciteturn0file4.

## Дизайн-концепция (актуально на 2026)
**Цель UI:** ощущение нативного мобильного приложения, “calm tech”, максимальная ясность, доверие и мягкая иерархия.

**Визуальные принципы**
- Mobile-first, touch-first: крупные зоны, минимум мелких контролов, “thumb zone” для ключевых действий.
- “Soft clinical”: светлый нейтральный фон + мягкие поверхности, умеренные тени, чистая типографика.
- Компонентность: карточки, чипы, bottom-nav, формы — единый язык.
- Минимум декоративности, максимум читаемости и состояния (loading/success/error).
- Анимации: короткие, безопасные (transform/opacity), с поддержкой `prefers-reduced-motion`.

**Дизайн-система (токены)**
- Цвета: `--bg`, `--surface`, `--text`, `--muted`, `--primary`, `--success`, `--danger`, `--border`
- Радиусы: 12–16px (кнопки/карточки), 999px (чипы)
- Тени: 2–3 уровня (очень мягкие)
- Отступы: шкала через `clamp()` (fluid spacing)
- Типографика: system-ui/variable font, `clamp()` для заголовков
- Состояния: через `data-state` (`idle/loading/success/error`, `open/closed`, `active`)

**Структура UI (страницы)**
- `index.html`: header (app bar) → hero → категории (horizontal scroll) → список врачей (grid) → how-it-works → отзывы → форма записи → bottom nav → footer fileciteturn0file4
- `doctor.html` (опционально): карточка врача + расписание (тайм-слоты) + форма записи fileciteturn0file4


---

## Roadmap

### 0) Инициализация проекта
- [x] Создать репозиторий и структуру папок:
  - [x] `index.html`, `doctor.html` (опционально)
  - [x] `src/styles/` (ITCSS), `src/js/`, `src/assets/`
  - [x] `dist/` (если сборка), либо статический проект без сборки
- [x] Подключить Normalize/Reset (слой `generic`)
- [ ] Настроить базовые правила качества:
  - [ ] единый форматтер (Prettier)
  - [ ] базовый ESLint (по желанию)
  - [ ] соглашения: BEM, `data-*` для состояний
- [x] Создать `README.md` с командами/описанием проекта

### 1) Дизайн-система и базовая инфраструктура стилей
- [x] Реализовать ITCSS-слои:
  - [x] `settings/` (токены: цвета, типографика, радиусы, тени, spacing)
  - [x] `generic/` (reset/normalize, базовые правила)
  - [x] `elements/` (стили `body`, `a`, `button`, `input`, `img`)
  - [x] `objects/` (контейнер, grid, stack, cluster)
  - [x] `components/` (карточки, чипы, навигация, форма)
  - [x] `utilities/` (u-hidden, u-visually-hidden, u-sr-only, u-center)
- [x] Добавить темы (минимум light; опционально dark):
  - [x] `:root` токены
  - [x] `html[data-theme="dark"]` override
- [x] Настроить fluid типографику и отступы через `clamp()`
- [x] Включить “motion-safe”:
  - [x] базовые transition-токены
  - [x] `@media (prefers-reduced-motion: reduce)` выключает анимации

### 2) Каркас страниц и семантика (a11y-first)
- [x] Собрать семантический скелет `index.html`:
  - [x] `header` (app bar)
  - [x] `main` с секциями и `aria-labelledby` fileciteturn0file4
  - [x] `footer`
- [x] Собрать скелет `doctor.html` (если делаем) fileciteturn0file4
- [x] Добавить базовую доступность:
  - [x] один `h1`, корректная иерархия заголовков
  - [x] видимый `:focus-visible`
  - [ ] `alt` у изображений врачей fileciteturn0file4
  - [x] “skip to content” ссылка

### 3) Header (App Bar) + навигация приложения
- [x] Сверстать app bar:
  - [x] логотип/название “HealthMe”
  - [x] кнопка “поиск/уведомления” (заглушки)
- [x] Реализовать Bottom Navigation (mobile):
  - [x] 4 пункта: Главная, Врачи, Запись, Профиль fileciteturn0file4
  - [x] `aria-current="page"` для активного
  - [x] кликабельность ≥ 44px fileciteturn0file4
- [x] Правила адаптива:
  - [x] на `>1024px` bottom nav скрывается fileciteturn0file4
### 4) Hero-секция (ценностное предложение)
- [x] Сверстать hero:
  - [x] заголовок + краткое описание
  - [x] primary CTA: “Записаться”
  - [x] secondary CTA: “Выбрать врача”
- [x] Добавить мягкий визуальный акцент (иллюстрация/абстракция) без перегруза
- [x] Подготовить “scroll reveal” (позже подключим JS)
### 5) Категории врачей (горизонтальный скролл)
- [x] Сверстать список категорий как “chips”:
  - [x] горизонтальный скролл с `scroll-snap` (опционально)
  - [x] иконка + название fileciteturn0file4
  - [x] состояние активной категории (`data-active="true"`)
- [x] Touch UX:
  - [x] `:active` анимация нажатия (scale 0.97 → 1) fileciteturn0file4
  - [x] не мешать скроллу (никаких тяжёлых обработчиков)
### 6) Список специалистов (карточки врачей)
- [x] Сверстать карточку врача (BEM-компонент):
  - [x] фото (круглое), имя, специализация, опыт, рейтинг, CTA fileciteturn0file4
  - [x] зарезервировать место под изображение (aspect-ratio) fileciteturn0file4
  - [x] `loading="lazy"` + `decoding="async"` для фото fileciteturn0file4
- [x] Сетка карточек:
  - [x] <600px: 1 колонка
  - [x] 600–1024px: 2 колонки
  - [x] >1024px: 3 колонки fileciteturn0file4
- [x] Добавить skeleton-состояние карточек (опционально для демонстрации качества)
### 7) “Как это работает” + отзывы
- [x] Секция “Как это работает”:
  - [x] 3–4 шага (карточки/иконки)
  - [x] адаптивная сетка (auto-fit/minmax)
- [x] Секция отзывов:
  - [x] карточки отзывов, рейтинг, имя
  - [x] безопасная типографика (короткие строки, комфортная ширина)
### 8) Форма записи (валидируемая, доступная, state machine)
- [x] Сверстать форму с полями: Имя, Телефон, Категория, Комментарий, Чекбокс согласия fileciteturn0file4
- [x] Доступность формы:
  - [x] `label` для каждого поля
  - [x] ошибки под полем + связь через `aria-describedby`
  - [x] статус формы через `role="status"` и `aria-live="polite"` fileciteturn0file4
- [x] UX формы:
  - [x] ошибки показывать после blur/submit
  - [x] кнопка блокируется в `loading`
  - [x] состояния формы через `data-state="idle|loading|success|error"`
### 9) JavaScript: данные, рендер, фильтрация, навигация
- [x] Подготовить данные врачей (мок-JSON в `src/js/data/doctors.js`):
  - [x] `id`, `name`, `specialty`, `category`, `experienceYears`, `rating`, `avatar`, `price` (опционально)
- [x] Рендер списка врачей:
  - [x] генерация карточек из данных
  - [x] пустое состояние “нет специалистов” (если фильтр ничего не дал)
- [x] Фильтрация по категориям fileciteturn0file4:
  - [x] клик по категории → обновить список
  - [x] сохранить активную категорию в состоянии (в памяти)
  - [x] синхронизировать UI (active chip)
- [x] Bottom navigation поведение:
  - [x] “Врачи” скроллит к списку
  - [x] “Запись” скроллит к форме
  - [x] “Профиль” — заглушка (toast/placeholder)
- [x] Scroll reveal через IntersectionObserver fileciteturn0file4:
  - [x] hero, категории, список врачей — появление по мере прокрутки
  - [x] `data-visible="true"` + CSS transitions
### 10) Fetch-отправка формы на mock endpoint
- [x] Реализовать отправку формы через `fetch` на mock endpoint fileciteturn0file4
- [x] Обработка ошибок:
  - [x] network error
  - [x] `!response.ok`
  - [x] таймаут (опционально)
- [x] UX результата:
  - [x] success-сообщение в `aria-live`
  - [x] очистка формы после успеха
  - [x] сохранение введённых данных при ошибке
### 11) Страница врача (опционально, но усиливает “продакшн”)
- [x] Создать `doctor.html` fileciteturn0file4
- [x] Роутинг без фреймворков:
  - [x] переход по ссылке `doctor.html?id=...`
  - [x] парсинг query params
- [x] Блоки страницы:
  - [x] профиль врача (фото/имя/описание/рейтинг)
  - [x] расписание (тайм-слоты) fileciteturn0file4
  - [x] выбор слота + запись (интеграция с формой)
- [x] Состояния:
  - [x] выбранный слот (`data-selected`)
  - [x] disabled для недоступных слотов
### 12) Оптимизация ассетов и финальная полировка UI
- [ ] Изображения:
  - [ ] подготовить WebP/AVIF версии fileciteturn0file4
  - [ ] использовать `<picture>` (AVIF → WebP → JPG fallback)
- [x] CLS-стабильность:
  - [x] фиксировать `width/height` или `aspect-ratio` у медиа fileciteturn0file4
- [x] Производительность:
  - [x] минимизировать JS в рантайме
  - [x] один обработчик на контейнер (делегирование), где возможно
- [ ] UI-полировка:
  - [ ] унификация радиусов/теней/состояний
  - [ ] проверка 3 ширин: mobile / tablet / desktop fileciteturn0file4

### 13) Критерии “готово” (в рамках текущего этапа)
- [ ] Полностью реализован mobile-first UX fileciteturn0file4
- [ ] Рабочая фильтрация врачей fileciteturn0file4
- [ ] Карточки врачей: фото, рейтинг, опыт, CTA fileciteturn0file4
- [ ] Bottom navigation как в приложении fileciteturn0file4
- [ ] Форма записи: валидация + loading + fetch + aria-live fileciteturn0file4
- [ ] Scroll reveal + touch-эффекты + prefers-reduced-motion fileciteturn0file4
- [ ] Изображения оптимизированы, lazy-loading включён fileciteturn0file4
