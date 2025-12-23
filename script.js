// === TELEGRAM WEB APP ===
const tg = window.Telegram?.WebApp;
if (tg) { 
    tg.ready(); 
    tg.expand(); 
    tg.setHeaderColor('#000000'); 
    tg.enableClosingConfirmation(); 
}

// === ПЕРЕМЕННЫЕ ===
let map, userMarker;

// === ГЛАВНАЯ НАВИГАЦИЯ ===
function switchTab(tabId) {
    // 1. Скрываем все экраны
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // 2. Убираем подсветку у всех кнопок
    document.querySelectorAll('.dock-item').forEach(item => {
        item.classList.remove('active');
    });

    // 3. Логика переключения
    const dockItems = document.querySelectorAll('.dock-item');
    
    if (tabId === 'home') {
        document.getElementById('home-view').classList.add('active');
        dockItems[0].classList.add('active'); // Первая кнопка (Навигация)
        
        // ВАЖНО: Инициализация карты при переходе на вкладку
        setTimeout(() => { 
            if(!map) initMap(); 
            else map.invalidateSize(); // Чтобы карта не была серой
        }, 100);
    } 
    else if (tabId === 'feed') {
        document.getElementById('feed-view').classList.add('active');
        dockItems[1].classList.add('active'); // Вторая кнопка (Лента)
    } 
    else if (tabId === 'wallet') {
        document.getElementById('wallet-view').classList.add('active');
        dockItems[2].classList.add('active'); // Третья кнопка (Кошелек)
    } 
    else if (tabId === 'driver') {
        document.getElementById('driver-view').classList.add('active');
        dockItems[3].classList.add('active'); // Четвертая кнопка (Водитель)
    }

    // Вибрация при переключении
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === КНОПКА AI (ЦЕНТРАЛЬНАЯ) ===
function activateAI() {
    switchTab('home'); // Возвращаем на карту
    const inputField = document.getElementById('chatInput');
    
    if (inputField) {
        // Фокус на поле ввода (открывает клавиатуру)
        inputField.focus();
        // Эффект удара (вибрация)
        if(tg) tg.HapticFeedback.impactOccurred('medium');
        
        // Небольшая анимация поля, чтобы привлечь внимание
        inputField.parentElement.style.transition = "0.2s";
        inputField.parentElement.style.transform = "scale(1.05)";
        setTimeout(() => {
            inputField.parentElement.style.transform = "scale(1)";
        }, 200);
    }
}

// === ЧАТ И СООБЩЕНИЯ ===
// Отправка по Enter
const chatInp = document.getElementById('chatInput');
if(chatInp) {
    chatInp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
// Отправка по кнопке микрофона (пока как текст)
const micBtn = document.querySelector('.mic-button');
if(micBtn) micBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    // 1. Сообщение пользователя
    addMessageBubble(text, 'user');
    input.value = '';

    // 2. Имитация ответа ИИ
    setTimeout(() => aiReply(text), 800);
}

function addMessageBubble(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-msg';

    if (sender === 'user') {
        msgDiv.style.justifyContent = 'flex-end';
        msgDiv.innerHTML = `<div class="msg-bubble" style="background:var(--accent); color:white; border-radius:18px 18px 4px 18px;">${text}</div>`;
    } else {
        msgDiv.innerHTML = `<div class="ai-avatar">Ai</div><div class="msg-bubble">${text}</div>`;
    }

    // Ищем контейнер чата
    let container = document.querySelector('.chat-container');
    if(!container) {
        // Если вдруг контейнера нет в HTML, создаем его
        container = document.createElement('div');
        container.className = 'chat-container';
        document.getElementById('home-view').insertBefore(container, document.querySelector('.order-panel'));
    }
    
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight; // Прокрутка вниз
    if(tg) tg.HapticFeedback.selectionChanged();
}

function aiReply(text) {
    let reply = "Ищу варианты...";
    const lower = text.toLowerCase();
    
    if(lower.includes("привет")) reply = "Салем! Куда поедем?";
    else if(lower.includes("цена")) reply = "Предложите свою цену в панели снизу.";
    else if(lower.includes("вокзал")) reply = "Понял, строю маршрут до вокзала.";
    else if(lower.includes("аэропорт")) reply = "В аэропорт? Какой терминал?";
    
    addMessageBubble(reply, 'ai');
}

// === КАРТА (LEAFLET) ===
function initMap() {
    const mapDiv = document.getElementById('map-container');
    if(mapDiv && !map) {
        map = L.map('map-container', { zoomControl: false }).setView([49.80, 73.10], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            maxZoom: 19
        }).addTo(map);
        centerMap();
    }
}

function centerMap() {
    if(!map) { initMap(); return; }
    map.locate({setView: true, maxZoom: 14});
    map.on('locationfound', (e) => {
        if(userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(e.latlng).addTo(map);
    });
}

// === БОКОВОЕ МЕНЮ (НАСТРОЙКИ) ===
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if(tg) tg.HapticFeedback.impactOccurred('light');
    }
}

// === МОДАЛКИ (Всплывающие окна) ===
function openModal(id) {
    const m = document.getElementById(id);
    if(m) { m.classList.add('active'); m.classList.remove('hidden'); }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if(m) { m.classList.remove('active'); setTimeout(() => m.classList.add('hidden'), 300); }
}

// === ЗАКАЗ (Кнопка Поехали) ===
function startOrder() {
    const btn = document.querySelector('.btn-go');
    if(btn) {
        const oldText = btn.innerText;
        btn.innerText = "Поиск...";
        btn.style.opacity = "0.7";
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.opacity = "1";
            if(tg) tg.showAlert("Заказ создан (Демо)");
        }, 1500);
    }
}

// Запуск при старте
document.addEventListener("DOMContentLoaded", () => {
    // Если открыта главная страница, грузим карту
    if(document.getElementById('home-view').classList.contains('active')) {
        initMap();
    }
});
