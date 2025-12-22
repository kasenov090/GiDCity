const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000');
    // Включаем подтверждение закрытия, чтобы случайно не выйти
    tg.enableClosingConfirmation();
}

// === УПРАВЛЕНИЕ ВКЛАДКАМИ ===
function goTab(id, btn) {
    // 1. Скрываем все экраны
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // 2. Показываем нужный
    const targetScreen = document.getElementById('screen-' + id);
    if (targetScreen) targetScreen.classList.add('active');
    
    // 3. Подсветка кнопок в доке
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    // 4. Логика центральной кнопки AI
    const aiBtn = document.getElementById('ai-main-btn');
    if (id === 'home') {
        aiBtn.classList.add('active-mode');
    } else {
        aiBtn.classList.remove('active-mode');
    }

    // 5. Управление фоновой сеткой (скрываем на карте для четкости)
    const bg = document.getElementById('background-layer');
    if (bg) bg.style.opacity = (id === 'map') ? '0' : '1';

    // Вибрация при переключении
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === ЦЕНТРАЛЬНАЯ КНОПКА (AI) ===
const aiBtn = document.getElementById('ai-main-btn');
let pressTimer;
let isLongPress = false;

aiBtn.addEventListener('touchstart', (e) => {
    isLongPress = false;
    aiBtn.style.transform = "scale(0.9) translateY(-15px)"; // Учитываем вылет кнопки вверх
    
    pressTimer = setTimeout(() => {
        isLongPress = true;
        if(tg) tg.HapticFeedback.impactOccurred('heavy');
        aiBtn.classList.add('listening'); // Нужно добавить в CSS для анимации пульсации
    }, 600);
});

aiBtn.addEventListener('touchend', (e) => {
    clearTimeout(pressTimer);
    aiBtn.style.transform = ""; 
    aiBtn.classList.remove('listening');

    if (isLongPress) {
        handleVoiceCommand();
    } else {
        goTab('home', null);
    }
});

// Имитация ИИ
function handleVoiceCommand() {
    if (!document.getElementById('screen-home').classList.contains('active')) {
        goTab('home', null);
    }

    const chat = document.querySelector('.chat-container');
    
    // Псевдо-распознавание
    setTimeout(() => {
        chat.innerHTML += `
            <div class="ai-msg">
                <div class="ai-avatar">Ai</div>
                <div class="msg-bubble">Поняла! Прокладываю маршрут до <b>City Mall</b>. Погода сегодня холодная, учитываю это в поиске машин.</div>
            </div>`;
        chat.scrollTop = chat.scrollHeight;

        // Заполняем поля автоматически
        const destInput = document.getElementById('inp-dest');
        const priceInput = document.getElementById('inp-price');
        
        if(destInput) destInput.value = "City Mall";
        if(priceInput) priceInput.placeholder = "Предложите (1200₸?)"; // AI подсказывает цену
        
        if(tg) tg.HapticFeedback.notificationOccurred('success');
    }, 400);
}

// === ТАРИФЫ (УБРАЛИ ЦЕНЫ) ===
function setTariff(el) {
    document.querySelectorAll('.tariff').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    
    // При выборе тарифа можно менять плейсхолдер цены
    const priceInp = document.getElementById('inp-price');
    if (el.innerText.includes('Lux')) {
        priceInp.placeholder = "Предложите от 2000";
    } else {
        priceInp.placeholder = "Предложите";
    }

    if(tg) tg.HapticFeedback.selectionChanged();
}

// === МОДАЛЬНЫЕ ОКНА ===
const overlay = document.getElementById('modal-overlay');

function openModal(id) {
    document.querySelectorAll('.modal-card').forEach(c => c.classList.remove('active'));
    overlay.classList.remove('hidden');
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    if(tg) tg.HapticFeedback.impactOccurred('medium');
}

// Закрытие по клику на крестик или оверлей
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-m') || e.target === overlay) {
        overlay.classList.add('hidden');
    }
});

// === САЙДБАР (НАСТРОЙКИ) ===
const sidebar = document.getElementById('sidebar-settings');

function openSidebar() {
    sidebar.classList.add('open');
    if(tg) tg.HapticFeedback.impactOccurred('light');
}

function closeSidebar() {
    sidebar.classList.remove('open');
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    // Установка активного состояния главной кнопки
    const aiBtn = document.getElementById('ai-main-btn');
    if(aiBtn) aiBtn.classList.add('active-mode');

    // Если есть карта, обновляем её высоту
    const mapFrame = document.getElementById('map-frame');
    if(mapFrame) {
        // Здесь можно вставить реальную ссылку на карту
        // mapFrame.src = "URL"; 
    }
});
