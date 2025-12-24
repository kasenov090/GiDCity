// === ИНИЦИАЛИЗАЦИЯ ===
const tg = window.Telegram?.WebApp;
if(tg) { tg.ready(); tg.expand(); tg.setHeaderColor('#000000'); }

let map, cityMap;
let isPanelCollapsed = false;

document.addEventListener("DOMContentLoaded", () => {
    // Показ экрана авторизации
    document.getElementById('auth-screen').style.display = 'flex';
    
    // Инит логики сворачивания панели
    const mapContainer = document.getElementById('map-container');
    const panel = document.getElementById('main-panel');
    
    mapContainer.addEventListener('click', () => {
        isPanelCollapsed = !isPanelCollapsed;
        if(isPanelCollapsed) panel.classList.add('collapsed');
        else panel.classList.remove('collapsed');
    });
});

// === АВТОРИЗАЦИЯ ===
function sendSms() {
    const codeBlock = document.getElementById('sms-block');
    const btn = document.getElementById('btn-login-action');
    
    if(codeBlock.style.display === 'none') {
        codeBlock.style.display = 'block';
        btn.innerText = "Войти";
        document.getElementById('auth-code').focus();
    } else {
        document.getElementById('auth-screen').style.display = 'none';
        switchTab('home');
    }
}
function continueAsGuest() {
    document.getElementById('auth-screen').style.display = 'none';
    switchTab('feed');
}

// === НАВИГАЦИЯ (TABS) ===
function switchTab(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.dock-item').forEach(b => b.classList.remove('active'));
    
    // Активация
    const target = document.getElementById(id + '-view');
    if(target) target.classList.add('active');
    
    // Инициализация карт
    if(id === 'home') setTimeout(initMap, 100);
    if(id === 'city') {
        setTimeout(initCityMap, 100);
        document.querySelector('[onclick="switchTab(\'city\')"]').classList.add('active');
    }
    if(id === 'feed') document.querySelector('[onclick="switchTab(\'feed\')"]').classList.add('active');
    if(id === 'wallet') document.querySelector('[onclick="switchTab(\'wallet\')"]').classList.add('active');
    if(id === 'driver') document.querySelector('[onclick="switchTab(\'driver\')"]').classList.add('active');
}

// === КАРТЫ (Leaflet) ===
function initMap() {
    if(!map) {
        map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([49.80, 73.10], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        // Клик по карте сворачивает панель
        map.on('click', () => document.getElementById('main-panel').classList.toggle('collapsed'));
    } else {
        map.invalidateSize();
    }
}
function initCityMap() {
    if(!cityMap) {
        cityMap = L.map('city-map-container', { zoomControl: false, attributionControl: false }).setView([49.80, 73.10], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(cityMap);
    } else {
        cityMap.invalidateSize();
    }
}
function centerMap() {
    if(map) map.flyTo([49.80, 73.10], 14);
}

// === ГОРОД (АФИША/КАРТА) ===
function switchCityTab(tab) {
    document.querySelectorAll('.c-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.city-content').forEach(c => c.classList.remove('active'));
    
    if(tab === 'billboard') {
        document.querySelectorAll('.c-tab')[0].classList.add('active');
        document.getElementById('tab-billboard').classList.add('active');
    } else {
        document.querySelectorAll('.c-tab')[1].classList.add('active');
        document.getElementById('tab-citymap').classList.add('active');
        initCityMap();
    }
}

// === МОДАЛКИ И ФУНКЦИОНАЛ ===
function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Смена тарифа
function selectTariff(el) {
    document.querySelectorAll('.tariff-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

// Лента: Создание поста с фото
const postImgInput = document.getElementById('post-img-input');
if(postImgInput) {
    postImgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('img-preview-area').classList.remove('hidden');
                document.getElementById('img-preview-tag').src = ev.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
}
function removeImg() {
    document.getElementById('post-img-input').value = "";
    document.getElementById('img-preview-area').classList.add('hidden');
}

function publishPost() {
    const text = document.getElementById('new-post-text').value;
    if(!text) return;
    
    const stream = document.getElementById('feed-stream');
    const newPost = `
    <div class="post-card glass-panel">
        <div class="post-head">
            <div class="avatar-mini">Я</div>
            <div class="ph-info"><span class="ph-name">Вы</span><span class="ph-time">Только что</span></div>
            <button class="icon-btn-text text-danger" onclick="deletePost(this)"><ion-icon name="trash-outline"></ion-icon></button>
        </div>
        <div class="post-text">${text}</div>
        ${!document.getElementById('img-preview-area').classList.contains('hidden') ? '<img src="'+document.getElementById('img-preview-tag').src+'" style="width:100%; border-radius:10px; margin-top:10px;">' : ''}
        <div class="post-actions">
            <button class="act-item"><ion-icon name="heart-outline"></ion-icon> 0</button>
            <button class="act-item"><ion-icon name="chatbubble-outline"></ion-icon> 0</button>
        </div>
    </div>`;
    
    stream.insertAdjacentHTML('afterbegin', newPost);
    closeModal('create-post-modal');
    document.getElementById('new-post-text').value = "";
    removeImg();
}

function deletePost(btn) {
    if(confirm('Удалить пост?')) btn.closest('.post-card').remove();
}
function toggleLike(btn) {
    const icon = btn.querySelector('ion-icon');
    if(icon.name === 'heart-outline') {
        icon.name = 'heart';
        icon.style.color = '#ff453a';
    } else {
        icon.name = 'heart-outline';
        icon.style.color = 'white';
    }
}
function openComments(id) {
    openModal('thread-view-modal');
}

// === НАСТРОЙКИ (НОВЫЙ ЭКРАН) ===
function openSettings() {
    document.getElementById('settings-view').classList.add('active');
}
function closeSettings() {
    document.getElementById('settings-view').classList.remove('active');
}
function openSubSetting(id) {
    document.getElementById(id).classList.add('active');
}
function closeSubSetting(id) {
    document.getElementById(id).classList.remove('active');
}
function saveProfile() {
    const name = document.getElementById('edit-name-inp').value;
    document.getElementById('settings-name-preview').innerText = name;
    closeSubSetting('profile-edit');
}

// === ВОДИТЕЛЬ И КОШЕЛЕК ===
function openOrderNegotiation(id) { openModal('order-negotiation-modal'); }
function offerMyPrice() { 
    const p = prompt("Ваша цена:"); 
    if(p) document.querySelector('.offer-price-display').innerText = p + " ₸"; 
}
function acceptPrice() { 
    closeModal('order-negotiation-modal'); 
    alert("Предложение отправлено!"); 
}
function openWalletModal(type) {
    const t = document.getElementById('wallet-modal-title');
    if(type==='deposit') t.innerText = "Пополнение";
    if(type==='transfer') t.innerText = "Перевод";
    openModal('wallet-action-modal');
}