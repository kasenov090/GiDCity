const { useState, useEffect, useMemo, useCallback, createContext, useContext } = React;

// ---------- Константы и утилиты ----------

const JSONBIN_ID = "6911fbe843b1c97be9a4dc97";
const JSONBIN_KEY = "$2a$10$tGtoDprB0qjFrz.cAvouWueOIGmsgCpArJqSirVeyyF/3KH1z52ZG";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;

const LOCAL_KEY = "gidcity_state_v1";

// режимы
const MODES = {
  SERVICES: "SERVICES",
  WORK: "WORK",
};

// языки
const LANGS = {
  RU: "ru",
  KZ: "kk",
  EN: "en",
};

// простая i18n-таблица
const t = (lang, key) => {
  const dict = {
    ru: {
      welcomeKz: "GiDCity-ға қош келдіңіз!",
      welcomeRu: "Добро пожаловать в GiDCity!",
      calendar: "Календарь",
      mainMenu: "Главное меню",
      services: "УСЛУГИ",
      work: "РАБОТА",
      notifications: "Уведомления",
      noNotifications: "Нет уведомлений",
      order: "ЗАКАЗ",
      orderBtn: "ЗАКАЗАТЬ",
      booking: "ЗАБРОНИРОВАТЬ",
      bookingEmpty: "Отсутствуют подключённые заведения к GiDCity",
      close: "Закрыть",
      addReminderSection: "Добавить напоминание",
      addReminderBtn: "Добавить напоминание",
      cancel: "Отмена",
      reminderNotePlaceholder: "Текст напоминания",
      cityChat: "City чат",
      messenger: "Мессенджер",
      wallet: "Кошелёк",
      serviceAds: "Объявление услуг",
      orderCreateTitle: "Создание заказа",
      serviceField: "Услуга",
      descriptionField: "Описание",
      deadlineField: "Дедлайн",
      budgetField: "Бюджет (₸)",
      categoryAny: "GiD заказ (любой тип услуги)",
      categoryHome: "Квартира / дом",
      categoryTaxi: "Такси",
      categoryCourier: "Курьер",
      categoryMaster: "Мастер / специалист",
      settings: "Настройки",
      language: "Язык",
      theme: "Тема",
      save: "Сохранить",
      findOrders: "Найти заказы",
      myProposals: "Мои отклики",
      proposeService: "Предложить услугу",
      proposalBudget: "Ваш бюджет (₸)",
      proposalComment: "Комментарий",
      publish: "Опубликовать",
      adsCategories: "Категории объявлений",
      adsVacancy: "Вакансии",
      adsBusiness: "Бизнес",
      adsSales: "Акции",
      adsEvents: "Афиша",
      adsGoods: "Товары",
      adsFood: "Продукты",
      title: "Заголовок",
      optionalPrice: "Цена (необязательно)",
      optionalContact: "Контакты (необязательно)",
      cityChatShare: "Поделитесь…",
      postPlaceholder: "Расскажите, что происходит в городе",
      post: "Опубликовать",
      contacts: "Контакты",
      dialogs: "Диалоги",
      createChat: "Создать чат",
      walletBalance: "Баланс",
      transfer: "Перевести",
      topup: "Пополнить",
      withdraw: "Снять",
      amount: "Сумма",
      recipient: "Получатель",
      confirm: "Подтвердить",
      noOrders: "Пока нет заказов",
      reminders: "Напоминания",
    },
    kk: {
      welcomeKz: "GiDCity-ға қош келдіңіз!",
      welcomeRu: "GiDCity-ге қош келдіңіз!",
      calendar: "Күнтізбе",
      mainMenu: "Басты мәзір",
      services: "ҚЫЗМЕТТЕР",
      work: "ЖҰМЫС",
      notifications: "Хабарламалар",
      noNotifications: "Хабарламалар жоқ",
      order: "ТАПСЫРЫС",
      orderBtn: "Тапсырыс беру",
      booking: "Брондау",
      bookingEmpty: "GiDCity-ге қосылған мекемелер жоқ",
      close: "Жабу",
      addReminderSection: "Еске салғыш қосу",
      addReminderBtn: "Еске салғыш қосу",
      cancel: "Болдырмау",
      reminderNotePlaceholder: "Еске салғыш мәтіні",
      cityChat: "City чат",
      messenger: "Хабарласу",
      wallet: "Әмиян",
      serviceAds: "Қызмет хабарландыруы",
      orderCreateTitle: "Тапсырыс жасау",
      serviceField: "Қызмет",
      descriptionField: "Сипаттама",
      deadlineField: "Мерзімі",
      budgetField: "Бюджет (₸)",
      categoryAny: "GiD тапсырыс (кез келген қызмет)",
      categoryHome: "Пәтер / үй",
      categoryTaxi: "Такси",
      categoryCourier: "Курьер",
      categoryMaster: "Шебер / маман",
      settings: "Баптаулар",
      language: "Тіл",
      theme: "Тақырып",
      save: "Сақтау",
      findOrders: "Тапсырыстарды табу",
      myProposals: "Менің өтінімдерім",
      proposeService: "Қызмет ұсыну",
      proposalBudget: "Бюджетіңіз (₸)",
      proposalComment: "Пікір",
      publish: "Жариялау",
      adsCategories: "Хабарландыру санаттары",
      adsVacancy: "Вакансиялар",
      adsBusiness: "Бизнес",
      adsSales: "Акциялар",
      adsEvents: "Афиша",
      adsGoods: "Тауарлар",
      adsFood: "Өнімдер",
      title: "Тақырып",
      optionalPrice: "Баға (міндетті емес)",
      optionalContact: "Байланыс (міндетті емес)",
      cityChatShare: "Бөлісіңіз…",
      postPlaceholder: "Қалада не болып жатқанын жазыңыз",
      post: "Жариялау",
      contacts: "Байланыстар",
      dialogs: "Диалогтар",
      createChat: "Чат құру",
      walletBalance: "Баланс",
      transfer: "Аудару",
      topup: "Толықтыру",
      withdraw: "Шығару",
      amount: "Сома",
      recipient: "Алушы",
      confirm: "Растау",
      noOrders: "Әзірге тапсырыс жоқ",
      reminders: "Еске салғыштар",
    },
    en: {
      welcomeKz: "GiDCity-ға қош келдіңіз!",
      welcomeRu: "Welcome to GiDCity!",
      calendar: "Calendar",
      mainMenu: "Main menu",
      services: "SERVICES",
      work: "WORK",
      notifications: "Notifications",
      noNotifications: "No notifications",
      order: "ORDER",
      orderBtn: "Create order",
      booking: "Book",
      bookingEmpty: "No venues connected to GiDCity yet",
      close: "Close",
      addReminderSection: "Add reminder",
      addReminderBtn: "Add reminder",
      cancel: "Cancel",
      reminderNotePlaceholder: "Reminder text",
      cityChat: "City chat",
      messenger: "Messenger",
      wallet: "Wallet",
      serviceAds: "Service Ads",
      orderCreateTitle: "Order creation",
      serviceField: "Service",
      descriptionField: "Description",
      deadlineField: "Deadline",
      budgetField: "Budget (₸)",
      categoryAny: "GiD order (any service type)",
      categoryHome: "Apartment / house",
      categoryTaxi: "Taxi",
      categoryCourier: "Courier",
      categoryMaster: "Master / specialist",
      settings: "Settings",
      language: "Language",
      theme: "Theme",
      save: "Save",
      findOrders: "Find orders",
      myProposals: "My proposals",
      proposeService: "Propose service",
      proposalBudget: "Your budget (₸)",
      proposalComment: "Comment",
      publish: "Publish",
      adsCategories: "Ad categories",
      adsVacancy: "Vacancies",
      adsBusiness: "Business",
      adsSales: "Sales",
      adsEvents: "Events",
      adsGoods: "Goods",
      adsFood: "Groceries",
      title: "Title",
      optionalPrice: "Price (optional)",
      optionalContact: "Contact (optional)",
      cityChatShare: "Share…",
      postPlaceholder: "What's happening in your city?",
      post: "Post",
      contacts: "Contacts",
      dialogs: "Dialogs",
      createChat: "Create chat",
      walletBalance: "Balance",
      transfer: "Transfer",
      topup: "Top up",
      withdraw: "Withdraw",
      amount: "Amount",
      recipient: "Recipient",
      confirm: "Confirm",
      noOrders: "No orders yet",
      reminders: "Reminders",
    },
  };
  return dict[lang][key] || key;
};

// дата → строка по локали
const formatDateShort = (lang, date) => {
  const locale =
    lang === LANGS.RU ? "ru-RU" : lang === LANGS.KZ ? "kk-KZ" : "en-US";
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
};

const formatTimeHM = (date) =>
  date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

// ---------- контекст состояния ----------

const AppContext = createContext(null);

const createEmptyState = () => ({
  profile: { id: "me", name: "User", avatar: null },
  city: {
    name: "Almaty",
    coords: { lat: 43.238949, lon: 76.889709 },
    temperature: 5,
  },
  theme: "violet", // пока только один акцент
  language: LANGS.RU,
  mode: MODES.SERVICES,
  orders: [],
  proposals: [],
  cityChatFeed: [],
  messages: [],
  wallet: {
    balance: 0,
    history: [],
  },
  reminders: [],
  notifications: [],
  lastSync: null,
});

// ---------- JSONBin sync ----------

async function loadFromJsonBin() {
  try {
    const res = await fetch(JSONBIN_URL, {
      headers: {
        "X-Master-Key": JSONBIN_KEY,
      },
    });
    if (!res.ok) throw new Error("jsonbin error");
    const data = await res.json();
    return data.record || null;
  } catch (e) {
    console.warn("JSONBin load error", e);
    return null;
  }
}

async function saveToJsonBin(state) {
  try {
    const body = JSON.stringify(state);
    const res = await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_KEY,
      },
      body,
    });
    if (!res.ok) throw new Error("jsonbin save error");
    return true;
  } catch (e) {
    console.warn("JSONBin save error", e);
    return false;
  }
}

// ---------- AppProvider ----------

function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("local load error", e);
    }
    return createEmptyState();
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // локальный автосейв
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // первичная подгрузка из JSONBin
  useEffect(() => {
    (async () => {
      const remote = await loadFromJsonBin();
      if (remote) {
        setState((prev) => ({ ...prev, ...remote }));
      }
    })();
  }, []);

  // периодический sync
  useEffect(() => {
    const id = setInterval(async () => {
      setIsSyncing(true);
      await saveToJsonBin(state);
      setIsSyncing(false);
    }, 30000); // каждые 30 сек
    return () => clearInterval(id);
  }, [state]);

  // проверка напоминаний
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => {
        const now = Date.now();
        let changed = false;
        const reminders = prev.reminders.map((r) => {
          if (!r.fired && r.timestamp <= now) {
            changed = true;
            return { ...r, fired: true };
          }
          return r;
        });
        let notifications = prev.notifications;
        if (changed) {
          const newNotifications = reminders
            .filter((r) => r.fired && !prev.notifications.some((n) => n.id === r.id))
            .map((r) => ({
              id: r.id,
              type: "reminder",
              title: t(prev.language, "reminders"),
              description: r.note,
              timestamp: r.timestamp,
              unread: true,
            }));
          notifications = [...notifications, ...newNotifications];
        }
        if (!changed) return prev;
        return { ...prev, reminders, notifications };
      });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const updateState = (patch) =>
    setState((prev) => ({ ...prev, ...patch }));

  const ctxValue = useMemo(
    () => ({ state, setState, updateState, isSyncing }),
    [state, isSyncing]
  );

  return <AppContext.Provider value={ctxValue}>{children}</AppContext.Provider>;
}

const useApp = () => useContext(AppContext);

// ---------- Компоненты ----------

// Приветственный оверлей

function WelcomeOverlay({ language, onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1400),
      setTimeout(() => setPhase(2), 2800),
      setTimeout(onDone, 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const text =
    phase === 0
      ? t(language, "welcomeKz")
      : phase === 1
      ? t(language, "welcomeRu")
      : "";

  if (phase === 2) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 30 }}>
      <div
        className="glass-card"
        style={{
          padding: 20,
          borderRadius: 26,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600 }}>{text}</div>
      </div>
    </div>
  );
}

// Header: логотип, календарь, настройки, город+погода

function Header({ onCalendarOpen, onSettingsOpen }) {
  const { state } = useApp();
  const lang = state.language;

  const todayLabel = formatDateShort(lang, new Date());
  const cityLine = `${state.city.name} · ${state.city.temperature}°C`;

  return (
    <>
      <div className="app-header">
        <div className="logo-wordmark">GiDCity</div>

        <div
          className="glass-card header-pill"
          style={{ cursor: "pointer" }}
          onClick={onCalendarOpen}
        >
          {todayLabel}
        </div>

        <div
          className="glass-card header-icon"
          onClick={onSettingsOpen}
          style={{ cursor: "pointer" }}
        >
          <span>⚙️</span>
        </div>
      </div>
      <div className="header-subline">{cityLine}</div>
    </>
  );
}

// Переключатель режимов

function ModeToggle() {
  const { state, updateState } = useApp();
  const lang = state.language;

  const setMode = (mode) => updateState({ mode });

  return (
    <div className="mode-toggle">
      <div className="mode-toggle-inner">
        <div
          className={
            "mode-segment " +
            (state.mode === MODES.SERVICES ? "active" : "inactive")
          }
          onClick={() => setMode(MODES.SERVICES)}
        >
          {t(lang, "services")}
        </div>
        <div
          className={
            "mode-segment " +
            (state.mode === MODES.WORK ? "active" : "inactive")
          }
          onClick={() => setMode(MODES.WORK)}
        >
          {t(lang, "work")}
        </div>
      </div>
    </div>
  );
}

// Главное меню + уведомления

function MainMenu({ onOpenModal, onOpenNotifications }) {
  const { state } = useApp();
  const lang = state.language;

  const unreadCount = state.notifications.filter((n) => n.unread).length;

  const isServices = state.mode === MODES.SERVICES;

  return (
    <div className="glass-card main-card">
      <div className="main-card-header">
        <div className="main-title">{t(lang, "mainMenu")}</div>
        <div className="bell-wrapper" onClick={onOpenNotifications}>
          <div
            className="glass-card header-icon"
            style={{ width: 32, height: 32, borderRadius: 999 }}
          >
            <span role="img" aria-label="bell">
              🔔
            </span>
          </div>
          {unreadCount > 0 && (
            <div className="bell-badge">{unreadCount}</div>
          )}
        </div>
      </div>

      {isServices ? (
        <ServicesMenu onOpenModal={onOpenModal} />
      ) : (
        <WorkMenu onOpenModal={onOpenModal} />
      )}
    </div>
  );
}

function ServicesMenu({ onOpenModal }) {
  const { state } = useApp();
  const lang = state.language;

  const tiles = [
    {
      key: "order",
      title: t(lang, "orderBtn"),
      sub: t(lang, "orderCreateTitle"),
    },
    {
      key: "booking",
      title: t(lang, "booking"),
      sub: t(lang, "bookingEmpty"),
    },
    {
      key: "ads",
      title: t(lang, "serviceAds"),
      sub: t(lang, "adsCategories"),
    },
    {
      key: "citychat",
      title: t(lang, "cityChat"),
      sub: t(lang, "postPlaceholder"),
    },
    {
      key: "messenger",
      title: t(lang, "messenger"),
      sub: "",
    },
    {
      key: "wallet",
      title: t(lang, "wallet"),
      sub: t(lang, "walletBalance"),
    },
  ];

  return (
    <div className="menu-grid">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="menu-tile"
          onClick={() => onOpenModal(tile.key)}
        >
          <div className="menu-title">{tile.title}</div>
          {tile.sub && <div className="menu-subtitle">{tile.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function WorkMenu({ onOpenModal }) {
  const { state } = useApp();
  const lang = state.language;

  const primary = [
    { key: "findOrders", title: t(lang, "findOrders") },
    { key: "myProposals", title: t(lang, "myProposals") },
  ];

  const secondary = [
    { key: "ads", title: t(lang, "serviceAds"), sub: "" },
    { key: "citychat", title: t(lang, "cityChat"), sub: "" },
    { key: "messenger", title: t(lang, "messenger"), sub: "" },
    { key: "wallet", title: t(lang, "wallet"), sub: "" },
  ];

  return (
    <>
      <div className="menu-row-large">
        {primary.map((tile) => (
          <div
            key={tile.key}
            className="menu-tile-large"
            onClick={() => onOpenModal(tile.key)}
          >
            <div className="menu-title">{tile.title}</div>
          </div>
        ))}
      </div>
      <div className="menu-grid">
        {secondary.map((tile) => (
          <div
            key={tile.key}
            className="menu-tile"
            onClick={() => onOpenModal(tile.key)}
          >
            <div className="menu-title">{tile.title}</div>
            {tile.sub && <div className="menu-subtitle">{tile.sub}</div>}
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Модалки ----------

// Календарь + напоминания

function CalendarModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderNote, setReminderNote] = useState("");

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const weekday = startOfMonth.getDay(); // 0-6
  const weekdayOffset = (weekday === 0 ? 6 : weekday - 1); // чтобы Пн был первым
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const daysArray = [];
  for (let i = 0; i < weekdayOffset; i++) daysArray.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)
    );
  }

  const locales = {
    ru: "ru-RU",
    kk: "kk-KZ",
    en: "en-US",
  };

  const monthLabel = new Intl.DateTimeFormat(locales[lang], {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  const weekdayNames = (() => {
    const base = new Date(2023, 4, 1); // Пн
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(
        new Intl.DateTimeFormat(locales[lang], { weekday: "short" }).format(d)
      );
    }
    return arr;
  })();

  const onAddReminder = () => {
    if (!reminderNote.trim()) return;
    const [hh, mm] = reminderTime.split(":").map((x) => parseInt(x, 10));
    const dt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hh,
      mm
    );
    const id = "rem_" + dt.getTime() + "_" + Math.random().toString(36).slice(2);
    const newReminder = {
      id,
      timestamp: dt.getTime(),
      note: reminderNote.trim(),
      fired: false,
    };
    updateState({ reminders: [...state.reminders, newReminder] });
    setReminderNote("");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "calendar")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <button
              className="btn-secondary"
              style={{ flex: "0 0 auto", padding: "4px 8px", fontSize: 12 }}
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                )
              }
            >
              ‹
            </button>
            <div style={{ textTransform: "capitalize" }}>{monthLabel}</div>
            <button
              className="btn-secondary"
              style={{ flex: "0 0 auto", padding: "4px 8px", fontSize: 12 }}
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
            >
              ›
            </button>
          </div>

          <div className="calendar-grid">
            {weekdayNames.map((w, idx) => (
              <div key={idx} className="calendar-weekday">
                {w}
              </div>
            ))}
            {daysArray.map((d, idx) => {
              if (!d)
                return <div key={idx} className="calendar-day"></div>;
              const isToday =
                d.toDateString() === new Date().toDateString();
              const isSelected =
                d.toDateString() === selectedDate.toDateString();
              return (
                <div
                  key={idx}
                  className={
                    "calendar-day" +
                    (isSelected ? " selected" : "") +
                    (isToday ? " today" : "")
                  }
                  onClick={() => setSelectedDate(d)}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {t(lang, "addReminderSection")}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input
                type="time"
                className="text-input"
                style={{ flex: "0 0 120px" }}
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <input
                type="text"
                className="text-input"
                style={{ flex: 1 }}
                placeholder={t(lang, "reminderNotePlaceholder")}
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
            </div>
            <div className="button-row">
              <button className="btn-primary" onClick={onAddReminder}>
                {t(lang, "addReminderBtn")}
              </button>
              <button className="btn-secondary" onClick={onClose}>
                {t(lang, "cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications

function NotificationsModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  useEffect(() => {
    // пометить все прочитанными
    if (state.notifications.some((n) => n.unread)) {
      const updated = state.notifications.map((n) => ({ ...n, unread: false }));
      updateState({ notifications: updated });
    }
  }, []);

  const list = [...state.notifications].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "notifications")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          {list.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {t(lang, "noNotifications")}
            </div>
          )}
          {list.map((n) => (
            <div key={n.id} className="notification-item">
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
              <div style={{ marginBottom: 2 }}>{n.description}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                }}
              >
                {formatTimeHM(new Date(n.timestamp))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Модалка "ЗАКАЗ"

function OrderModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  const categories = [
    { key: "any", label: t(lang, "categoryAny") },
    { key: "home", label: t(lang, "categoryHome") },
    { key: "taxi", label: t(lang, "categoryTaxi") },
    { key: "courier", label: t(lang, "categoryCourier") },
    { key: "master", label: t(lang, "categoryMaster") },
  ];

  const [category, setCategory] = useState(categories[0].key);
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const onSubmit = () => {
    if (!description.trim()) return;
    const id = "ord_" + Date.now();
    const order = {
      id,
      category,
      description: description.trim(),
      deadline,
      budget: Number(budget) || 0,
      city: state.city.name,
      status: "open",
      createdAt: Date.now(),
      ownerId: state.profile.id,
    };
    updateState({ orders: [...state.orders, order] });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "order")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div className="field-label">{t(lang, "serviceField")}</div>
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "descriptionField")}
          </div>
          <textarea
            className="text-area"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "deadlineField")}
          </div>
          <input
            type="date"
            className="text-input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "budgetField")}
          </div>
          <input
            type="number"
            className="text-input"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <div className="button-row">
            <button className="btn-primary" onClick={onSubmit}>
              {t(lang, "orderBtn")}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              {t(lang, "close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Бронирование

function BookingModal({ onClose }) {
  const { state } = useApp();
  const lang = state.language;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "booking")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, marginBottom: 12 }}>
            {t(lang, "bookingEmpty")}
          </p>
          <div className="button-row">
            <button className="btn-secondary" onClick={onClose}>
              {t(lang, "close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Объявление услуг

function AdsModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  const categories = [
    { key: "vacancy", label: t(lang, "adsVacancy") },
    { key: "business", label: t(lang, "adsBusiness") },
    { key: "sales", label: t(lang, "adsSales") },
    { key: "events", label: t(lang, "adsEvents") },
    { key: "goods", label: t(lang, "adsGoods") },
    { key: "food", label: t(lang, "adsFood") },
  ];

  const [category, setCategory] = useState(categories[0].key);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");

  const onPublish = () => {
    if (!title.trim()) return;
    const ad = {
      id: "ad_" + Date.now(),
      category,
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      contact: contact.trim(),
      city: state.city.name,
      ownerId: state.profile.id,
      createdAt: Date.now(),
    };
    // сохраним в cityChatFeed как отдельный тип или можно создать ads массив
    const adsFeed = state.cityChatFeed || [];
    updateState({ cityChatFeed: [...adsFeed, { ...ad, type: "ad" }] });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "serviceAds")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div className="field-label">{t(lang, "adsCategories")}</div>
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "title")}
          </div>
          <input
            className="text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "descriptionField")}
          </div>
          <textarea
            className="text-area"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "optionalPrice")}
          </div>
          <input
            className="text-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="field-label" style={{ marginTop: 8 }}>
            {t(lang, "optionalContact")}
          </div>
          <input
            className="text-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <div className="button-row">
            <button className="btn-primary" onClick={onPublish}>
              {t(lang, "publish")}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              {t(lang, "close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// City чат (упрощённый каркас: посты без комментариев/репостов)

function CityChatModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  const [composerOpen, setComposerOpen] = useState(false);
  const [text, setText] = useState("");

  const feed = (state.cityChatFeed || []).filter(
    (p) => p.city === state.city.name || !p.city
  );

  const onPost = () => {
    if (!text.trim()) return;
    const post = {
      id: "post_" + Date.now(),
      type: "post",
      authorId: state.profile.id,
      authorName: state.profile.name,
      city: state.city.name,
      text: text.trim(),
      createdAt: Date.now(),
    };
    updateState({ cityChatFeed: [post, ...feed] });
    setText("");
    setComposerOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "cityChat")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 6,
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13 }}>{state.profile.name}</div>
            <div
              style={{
                fontSize: 13,
                color: "var(--accent-yellow)",
                cursor: "pointer",
              }}
              onClick={() => setComposerOpen(true)}
            >
              {t(lang, "cityChatShare")}
            </div>
          </div>

          {composerOpen && (
            <div
              className="glass-card"
              style={{ padding: 10, marginBottom: 10 }}
            >
              <textarea
                className="text-area"
                placeholder={t(lang, "postPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="button-row">
                <button className="btn-primary" onClick={onPost}>
                  {t(lang, "post")}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setComposerOpen(false)}
                >
                  {t(lang, "cancel")}
                </button>
              </div>
            </div>
          )}

          {feed.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              …
            </div>
          )}

          {feed.map((p) => (
            <div
              key={p.id}
              className="glass-card"
              style={{ padding: 8, marginBottom: 8 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <div>{p.authorName || "User"}</div>
                <div style={{ color: "var(--text-secondary)" }}>
                  {formatTimeHM(new Date(p.createdAt))}
                </div>
              </div>
              <div style={{ fontSize: 13 }}>{p.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Мессенджер (каркас: только список диалогов и заглушка)

function MessengerModal({ onClose }) {
  const { state } = useApp();
  const lang = state.language;

  const [tab, setTab] = useState("dialogs");

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "messenger")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div
            className="mode-toggle-inner"
            style={{
              margin: "0 auto 10px",
              padding: 2,
            }}
          >
            <div
              className={
                "mode-segment " + (tab === "contacts" ? "active" : "inactive")
              }
              style={{ fontSize: 12, padding: "5px 16px" }}
              onClick={() => setTab("contacts")}
            >
              {t(lang, "contacts")}
            </div>
            <div
              className={
                "mode-segment " + (tab === "dialogs" ? "active" : "inactive")
              }
              style={{ fontSize: 12, padding: "5px 16px" }}
              onClick={() => setTab("dialogs")}
            >
              {t(lang, "dialogs")}
            </div>
          </div>

          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            (Здесь позже добавим полноценные чаты, систему контактов и
            привязку к заказам.)
          </p>
        </div>
      </div>
    </div>
  );
}

// Кошелёк

function WalletModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;
  const wallet = state.wallet;

  const [action, setAction] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const runAction = (type) => {
    if (!amount) return;
    const value = Number(amount);
    if (!value) return;
    let balance = wallet.balance;
    if (type === "topup") balance += value;
    if (type === "withdraw" || type === "transfer") balance -= value;

    const tx = {
      id: "tx_" + Date.now(),
      type,
      amount: value,
      recipient: recipient || null,
      timestamp: Date.now(),
    };

    updateState({
      wallet: {
        balance,
        history: [tx, ...(wallet.history || [])],
      },
    });
    setAction(null);
    setAmount("");
    setRecipient("");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "wallet")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div
            className="glass-card"
            style={{
              padding: 12,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 13 }}>{t(lang, "walletBalance")}</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {wallet.balance.toLocaleString("ru-RU")} ₸
            </div>
          </div>

          <div className="button-row">
            <button
              className="btn-primary"
              onClick={() => setAction("transfer")}
            >
              {t(lang, "transfer")}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setAction("topup")}
            >
              {t(lang, "topup")}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setAction("withdraw")}
            >
              {t(lang, "withdraw")}
            </button>
          </div>

          {action && (
            <div
              className="glass-card"
              style={{ padding: 10, marginTop: 10 }}
            >
              <div className="field-label">{t(lang, "amount")}</div>
              <input
                type="number"
                className="text-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {action === "transfer" && (
                <>
                  <div className="field-label" style={{ marginTop: 8 }}>
                    {t(lang, "recipient")}
                  </div>
                  <input
                    className="text-input"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </>
              )}
              <div className="button-row">
                <button
                  className="btn-primary"
                  onClick={() => runAction(action)}
                >
                  {t(lang, "confirm")}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setAction(null)}
                >
                  {t(lang, "cancel")}
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            История
          </div>
          {(wallet.history || []).map((tx) => (
            <div key={tx.id} className="notification-item">
              <div>
                {tx.type} · {tx.amount} ₸
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {formatTimeHM(new Date(tx.timestamp))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Найти заказы (WORK)

function FindOrdersModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [budget, setBudget] = useState("");
  const [comment, setComment] = useState("");

  const orders = state.orders.filter(
    (o) => o.status === "open" && o.city === state.city.name
  );

  const submitProposal = () => {
    if (!selectedOrder) return;
    const proposal = {
      id: "pr_" + Date.now(),
      orderId: selectedOrder.id,
      workerId: state.profile.id,
      budget: Number(budget) || 0,
      comment: comment.trim(),
      status: "pending",
      createdAt: Date.now(),
    };
    updateState({ proposals: [...state.proposals, proposal] });

    const notification = {
      id: "notif_" + Date.now(),
      type: "proposal",
      title: t(lang, "proposeService"),
      description: comment || "",
      timestamp: Date.now(),
      unread: true,
    };
    updateState({
      notifications: [...state.notifications, notification],
    });
    setSelectedOrder(null);
    setBudget("");
    setComment("");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "findOrders")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          {orders.length === 0 && (
            <div style={{ fontSize: 13 }}>{t(lang, "noOrders")}</div>
          )}
          {orders.map((o) => (
            <div
              key={o.id}
              className="glass-card"
              style={{ padding: 8, marginBottom: 8 }}
            >
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                {o.category} · {o.city}
              </div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                {o.description}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  marginBottom: 4,
                }}
              >
                {o.deadline && `⏱ ${o.deadline}`} ·{" "}
                {o.budget ? `${o.budget} ₸` : ""}
              </div>
              <button
                className="btn-primary"
                onClick={() => setSelectedOrder(o)}
              >
                {t(lang, "proposeService")}
              </button>
            </div>
          ))}

          {selectedOrder && (
            <div
              className="glass-card"
              style={{ padding: 10, marginTop: 8 }}
            >
              <div
                style={{ fontSize: 13, marginBottom: 6, fontWeight: 600 }}
              >
                {t(lang, "proposeService")}
              </div>
              <div className="field-label">
                {t(lang, "proposalBudget")}
              </div>
              <input
                type="number"
                className="text-input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <div
                className="field-label"
                style={{ marginTop: 8 }}
              >
                {t(lang, "proposalComment")}
              </div>
              <textarea
                className="text-area"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="button-row">
                <button className="btn-primary" onClick={submitProposal}>
                  {t(lang, "confirm")}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  {t(lang, "cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Мои отклики (WORK)

function MyProposalsModal({ onClose }) {
  const { state } = useApp();
  const lang = state.language;

  const proposals = state.proposals.filter(
    (p) => p.workerId === state.profile.id
  );

  const ordersById = Object.fromEntries(
    state.orders.map((o) => [o.id, o])
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "myProposals")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          {proposals.map((p) => {
            const ord = ordersById[p.orderId];
            return (
              <div
                key={p.id}
                className="glass-card"
                style={{ padding: 8, marginBottom: 8 }}
              >
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  {ord ? ord.description : "Order"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  {p.comment}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  {p.budget} ₸ · {p.status}
                </div>
              </div>
            );
          })}
          {proposals.length === 0 && (
            <div style={{ fontSize: 13 }}>{t(lang, "noOrders")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Настройки (язык, тема)

function SettingsModal({ onClose }) {
  const { state, updateState } = useApp();
  const lang = state.language;
  const [language, setLanguage] = useState(state.language);

  const onSave = () => {
    updateState({ language });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">{t(lang, "settings")}</div>
          <div className="modal-close" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <div className="field-label">{t(lang, "language")}</div>
          <select
            className="select-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value={LANGS.RU}>Русский</option>
            <option value={LANGS.KZ}>Қазақша</option>
            <option value={LANGS.EN}>English</option>
          </select>

          <div className="button-row">
            <button className="btn-primary" onClick={onSave}>
              {t(lang, "save")}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              {t(lang, "cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Корневой App ----------

function App() {
  const { state } = useApp();
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const isDay = state.mode === MODES.SERVICES;

  return (
    <div className="app-root">
      <div className="app-shell glass-card" style={{ padding: 12 }}>
        <div
          className="app-bg"
          style={{
            background: isDay ? "var(--bg-day)" : "var(--bg-night)",
          }}
        ></div>

        <Header
          onCalendarOpen={() => setActiveModal("calendar")}
          onSettingsOpen={() => setActiveModal("settings")}
        />

        <ModeToggle />

        <MainMenu
          onOpenModal={setActiveModal}
          onOpenNotifications={() => setActiveModal("notifications")}
        />

        <div className="footer-label">KASSEN TECHNOLOGY INC.</div>

        {!welcomeDone && (
          <WelcomeOverlay
            language={state.language}
            onDone={() => setWelcomeDone(true)}
          />
        )}

        {activeModal === "calendar" && (
          <CalendarModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "notifications" && (
          <NotificationsModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "order" && (
          <OrderModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "booking" && (
          <BookingModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "ads" && (
          <AdsModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "citychat" && (
          <CityChatModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "messenger" && (
          <MessengerModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "wallet" && (
          <WalletModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "findOrders" && (
          <FindOrdersModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "myProposals" && (
          <MyProposalsModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "settings" && (
          <SettingsModal onClose={() => setActiveModal(null)} />
        )}
      </div>
    </div>
  );
}

// ---------- Рендер ----------

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
  </AppProvider>
);