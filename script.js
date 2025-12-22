const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#000000');
    tg.enableClosingConfirmation();
}

// === ВКЛАДКИ ===
function goTab(id, btn) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('screen-' + id);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    const aiBtn = document.getElementById('ai-main-btn');
    id === 'home' ? aiBtn.classList.add('active-mode') : aiBtn.classList.remove('active-mode');

    const bg = document.getElementById('background-layer');
    if (bg) bg.style.opacity = (id === 'map') ? '0' : '1';

    if(tg) tg.HapticFeedback.selectionChanged();
}

// === AI КНОПКА ===
const aiBtn = document.getElementById('ai-main-btn');
let pressTimer;

aiBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    aiBtn.style.transform = "scale(0.9) translateY(-10px)";
    pressTimer = setTimeout(() => {
        if(tg) tg.HapticFeedback.impactOccurred('heavy');
        aiBtn.classList.add('listening');
    }, 600);
});

aiBtn.addEventListener('touchend', () => {
    clearTimeout(pressTimer);
    aiBtn.style.transform = "";
    aiBtn.classList.remove('listening');
    goTab('home', null);
});

// === ТАРИФЫ ===
function setTariff(el) {
    document.querySelectorAll('.tariff').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === МОДАЛКИ ===
function openModal(id) {
    document.querySelectorAll('.modal-card').forEach(c => c.classList.remove('active'));
    document.getElementById('modal-overlay').classList.remove('hidden');
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    if(tg) tg.HapticFeedback.impactOccurred('medium');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-m') || e.target.id === 'modal-overlay') {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
});

// === САЙДБАР ===
function openSidebar() { document.getElementById('sidebar-settings').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar-settings').classList.remove('open'); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ai-main-btn').classList.add('active-mode');
});
