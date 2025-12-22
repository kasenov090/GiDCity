const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#050505");
}

// === TABS LOGIC ===
function switchTab(tabId, btnElement) {
    // 1. Скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // 2. Показываем нужный
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // 3. Работа с кнопками в Dock
    if (btnElement) {
        document.querySelectorAll('.dock-item').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }

    // 4. Фон карты vs Фон AI
    const bgLayer = document.getElementById('bg-layer');
    if (tabId === 'map') {
        bgLayer.style.opacity = '0'; // Скрываем кибер-фон, показываем карту
    } else {
        bgLayer.style.opacity = '1';
    }
}

// === CAR SELECTION ===
function selectCar(el) {
    document.querySelectorAll('.car-option').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === SIDEBAR SETTINGS ===
document.getElementById('open-settings').addEventListener('click', () => {
    document.getElementById('settings-sidebar').classList.add('open');
});
function toggleSettings() {
    document.getElementById('settings-sidebar').classList.remove('open');
}

// === MAP PINS & MODALS ===
function openPin(type) {
    const modal = document.getElementById('modal-pin');
    const title = document.getElementById('modal-title');
    
    if (type === 'burger') {
        title.innerText = 'Burger King';
    } else if (type === 'cinema') {
        title.innerText = 'Kinopark 5';
    }
    
    modal.classList.remove('hidden');
    if(tg) tg.HapticFeedback.impactOccurred('light');
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
}

// === SOCIAL SHARE ===
function openShareModal() {
    document.getElementById('modal-share').classList.remove('hidden');
}

// === DRIVER / RENT ===
function openRentModal() {
    alert("Модальное окно: Выбор авто для аренды (Rentauto System)");
}

// === AI VOICE MOCKUP ===
function startListening() {
    document.querySelector('.ai-hold-btn').style.transform = "translateX(-50%) scale(1.2)";
    document.querySelector('.ai-hold-btn').style.borderColor = "#FFD700";
    if(tg) tg.HapticFeedback.impactOccurred('heavy');
}

function stopListening() {
    document.querySelector('.ai-hold-btn').style.transform = "translateX(-50%) scale(1)";
    document.querySelector('.ai-hold-btn').style.borderColor = "rgba(255,255,255,0.2)";
    
    // Симуляция ответа ИИ
    const bubble = document.querySelector('.ai-message');
    bubble.innerText = "Слушаю... Маршрут до Майкудука построен. Стоимость ~1200₸. Едем?";
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    // Желтая кнопка на старте активна
    const firstTabBtn = document.querySelector('.dock-item.active');
    if(firstTabBtn) firstTabBtn.classList.add('active');
});
