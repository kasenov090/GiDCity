// --- Глобальные переменные для карт ---
let homeMap; // Карта заказа такси
let cityMap; // Карта города (в разделе City)

// --- Инициализация карт 2ГИС ---
// Весь код работы с картой должен быть внутри DG.then()
DG.then(function () {
    // 1. Инициализация главной карты (Home View)
    homeMap = DG.map('map-container', {
        center: [49.8029, 73.1021], // Центр Караганды
        zoom: 16,
        zoomControl: false,      // Скрываем стандартные кнопки зума
        fullscreenControl: false, // Скрываем кнопку полного экрана
        geoclicker: true         // Разрешаем кликать по зданиям
    });

    // Добавим маркер "Я" (центр экрана)
    DG.marker([49.8029, 73.1021]).addTo(homeMap);

    // 2. Инициализация карты города (City View)
    cityMap = DG.map('city-map-container', {
        center: [49.8029, 73.1021],
        zoom: 13,
        zoomControl: false,
        fullscreenControl: false
    });
});

// --- Логика навигации (Таббар) ---
function switchTab(tabId) {
    // Скрываем все view
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active');
        // Скрываем с анимацией (опционально) или просто display: none через CSS
    });
    
    // Показываем нужный
    const target = document.getElementById(tabId + '-view');
    if (target) {
        target.classList.add('active');
    }

    // Обновляем иконки в доке
    document.querySelectorAll('.dock-item').forEach(btn => {
        // Простая логика подсветки (можно доработать по ID)
        btn.style.color = 'var(--text-gray)';
    });
    
    // Спец-обработка для карты при переключении табов
    // (Иногда карта может стать серой, если инициализировалась в скрытом блоке)
    if (tabId === 'home' && homeMap) {
        homeMap.invalidateSize();
    }
    if (tabId === 'city' && cityMap) {
        // Если мы сразу попали на вкладку карты внутри сити
        setTimeout(() => cityMap.invalidateSize(), 100);
    }
}

// --- Логика раздела City (Афиша / Карта) ---
function switchCityTab(tabName) {
    // Переключение кнопок
    document.querySelectorAll('.c-tab').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Переключение контента
    document.querySelectorAll('.city-content').forEach(el => el.classList.remove('active'));
    
    if (tabName === 'billboard') {
        document.getElementById('tab-billboard').classList.add('active');
    } else {
        document.getElementById('tab-citymap').classList.add('active');
        // Важно: пересчитать размеры карты при показе
        if (cityMap) {
            cityMap.invalidateSize(); 
        }
    }
}

// --- Логика панели заказа (шторка) ---
let isPanelOpen = false;
function togglePanelState() {
    const panel = document.getElementById('main-panel');
    isPanelOpen = !isPanelOpen;
    
    if (isPanelOpen) {
        panel.style.transform = 'translateY(0)'; // Полностью открыта
        // panel.style.height = '80%'; // Можно менять высоту динамически
    } else {
        panel.style.transform = 'translateY(calc(100% - 180px))'; // Свернута, торчит низ
    }
}

// Выбор тарифа
function selectTariff(el) {
    document.querySelectorAll('.tariff-card').forEach(card => card.classList.remove('selected'));
    el.classList.add('selected');
}

// Центрирование карты (кнопка навигации)
function centerMap() {
    if (homeMap) {
        homeMap.setView([49.8029, 73.1021], 16);
    }
}

// --- Модальные окна ---
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    setTimeout(() => {
        document.getElementById(id).style.display = 'none';
    }, 200); // Задержка для анимации если есть
}

// --- Настройки (Settings) ---
function openSettings() {
    document.getElementById('settings-view').classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-view').classList.remove('active');
}

function openSubSetting(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('active');
}

function closeSubSetting(id) {
    document.getElementById(id).classList.remove('active');
    setTimeout(() => {
        document.getElementById(id).classList.add('hidden');
    }, 300);
}

// --- AI Чат (заглушка) ---
function sendMessage() {
    const input = document.getElementById('chatInput');
    const area = document.getElementById('ai-response-area');
    
    if (input.value.trim() === "") return;

    area.style.display = 'block';
    area.innerHTML = `<div class="ai-loading">Думаю...</div>`;
    
    setTimeout(() => {
        area.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <ion-icon name="sparkles" style="color:var(--accent)"></ion-icon>
                <span>Маршрут построен! Ехать 12 минут. Стоимость ~950₸</span>
            </div>
        `;
    }, 1500);
}

function startOrder() {
    // Логика начала поиска водителя
    openModal('order-negotiation-modal');
}

// --- Кошелек (Модалки) ---
function openWalletModal(type) {
    const title = type === 'deposit' ? 'Пополнение' : 'Перевод';
    alert(`Открываем окно: ${title} (В разработке)`);
}

// --- Аутентификация (Заглушка) ---
function sendSms() {
    document.getElementById('btn-login-action').innerText = 'Отправить снова';
    document.getElementById('sms-block').style.display = 'block';
}

function continueAsGuest() {
    document.getElementById('auth-screen').style.display = 'none';
}

// --- Соцсеть (Feed) ---
function toggleLike(btn) {
    const icon = btn.querySelector('ion-icon');
    if (icon.name === 'heart-outline') {
        icon.name = 'heart';
        icon.style.color = '#ff4757';
        btn.style.color = '#ff4757';
    } else {
        icon.name = 'heart-outline';
        icon.style.color = 'inherit';
        btn.style.color = 'inherit';
    }
}

function publishPost() {
    const text = document.getElementById('new-post-text').value;
    if (!text) return;
    
    // Создаем HTML нового поста
    const feed = document.getElementById('feed-stream');
    const newPost = document.createElement('div');
    newPost.className = 'post-card';
    newPost.innerHTML = `
        <div class="post-head">
            <div class="avatar-mini"><ion-icon name="person"></ion-icon></div>
            <div class="ph-info">
                <span class="ph-name">Гость</span>
                <span class="ph-time">Только что</span>
            </div>
        </div>
        <div class="post-text">${text}</div>
        <div class="post-actions">
            <button class="act-item" onclick="toggleLike(this)">
                <ion-icon name="heart-outline"></ion-icon> <span class="count">0</span>
            </button>
        </div>
    `;
    
    feed.prepend(newPost);
    closeModal('create-post-modal');
    document.getElementById('new-post-text').value = '';
}
