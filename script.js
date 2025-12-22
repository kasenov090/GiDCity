const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready(); tg.expand();
    tg.setHeaderColor("#000000");
}

// === УПРАВЛЕНИЕ ТАБАМИ ===
function switchTab(tabId, btnElement) {
    // 1. Смена экранов
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // 2. Смена активной кнопки в доке
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    // 3. Управление фоном (скрываем кибер-сетку на карте)
    const bg = document.getElementById('bg-layer');
    if (tabId === 'map') bg.style.opacity = '0';
    else bg.style.opacity = '1';

    if(tg) tg.HapticFeedback.selectionChanged();
}

// === ВЫБОР ТАРИФА ===
function selectTariff(el) {
    document.querySelectorAll('.tariff-item').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === ЛОГИКА AI (Имитация) ===
let aiTimeout;
const aiBtn = document.querySelector('.dock-btn-ai-large');
const aiTrigger = document.querySelector('.ai-hold-trigger'); // Невидимая зона

function startAiListening() {
    // Визуальный эффект на большой кнопке
    aiBtn.style.transform = "translateY(-22px) scale(0.95)";
    aiBtn.style.borderColor = "#0a84ff"; // Синяя подсветка при нажатии
    if(tg) tg.HapticFeedback.impactOccurred('medium');

    // Имитация задержки распознавания
    aiTimeout = setTimeout(() => {
        // 1. Добавляем сообщение от ИИ в чат
        const chatArea = document.querySelector('.ai-chat-area');
        const newMsg = document.createElement('div');
        newMsg.className = 'ai-message-bubble';
        newMsg.innerHTML = `<div class="ai-avatar-mini">Ai</div><div class="msg-text">Маршрут до "ТРЦ City Mall" построен. Тариф Eco, стоимость ~950₸.</div>`;
        chatArea.appendChild(newMsg);
        // Авто-скролл вниз
        chatArea.scrollTop = chatArea.scrollHeight;

        // 2. ИИ "заполняет" поля в фиксированной панели
        document.getElementById('input-destination').value = "ТРЦ City Mall";
        document.getElementById('input-budget').value = "950";
        
        if(tg) tg.HapticFeedback.notificationOccurred('success');
    }, 1500); // Через 1.5 секунды
}

function stopAiListening() {
    // Сброс визуальных эффектов
    aiBtn.style.transform = ""; // Возврат на место
    aiBtn.style.borderColor = "";
    clearTimeout(aiTimeout); // Отмена, если отпустил рано
}

// Подключаем триггер к тем же функциям
aiTrigger.addEventListener('touchstart', startAiListening);
aiTrigger.addEventListener('touchend', stopAiListening);


// === УПРАВЛЕНИЕ МОДАЛКАМИ ===
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        if(tg) tg.HapticFeedback.impactOccurred('light');
    }
}

function closeAllModals() {
    document.querySelectorAll('.glass-modal-overlay').forEach(m => m.classList.add('hidden'));
}

// Закрытие по клику на фон
document.querySelectorAll('.glass-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
    });
});

// Сайдбар настроек
document.getElementById('open-settings').addEventListener('click', () => {
    document.getElementById('settings-sidebar').classList.add('open');
});
function toggleSettings() {
    document.getElementById('settings-sidebar').classList.remove('open');
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    // Устанавливаем активный таб при старте
    switchTab('home', document.querySelector('.dock-btn.active'));
});
