const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor('#000000'); tg.enableClosingConfirmation(); }

let map, userMarker;
let selectedImage = null;

// === УПРАВЛЕНИЕ ВКЛАДКАМИ ===
function goTab(id, btn) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');
    
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    const aiBtn = document.getElementById('ai-main-btn');
    if(id === 'home') aiBtn.classList.add('active-mode'); else aiBtn.classList.remove('active-mode');

    // ФИКС КАРТЫ
    if (id === 'map') {
        if (!map) initMap();
        setTimeout(() => map.invalidateSize(), 200); 
    }
    if(tg) tg.HapticFeedback.selectionChanged();
}

// === ЛОГИКА КНОПКИ AI ===
const aiBtn = document.getElementById('ai-main-btn');
let pressTimer;
let isLongPress = false;

aiBtn.addEventListener('touchstart', (e) => {
    isLongPress = false;
    aiBtn.style.transform = "scale(0.9)";
    pressTimer = setTimeout(() => {
        isLongPress = true;
        if(tg) tg.HapticFeedback.impactOccurred('heavy');
        aiBtn.classList.add('listening'); 
    }, 600);
});

aiBtn.addEventListener('touchend', (e) => {
    clearTimeout(pressTimer);
    aiBtn.style.transform = ""; 
    aiBtn.classList.remove('listening');

    if (isLongPress) {
        // Тут была бы логика голоса
    } else {
        // ВСЕГДА ВОЗВРАЩАЕТ НА ГЛАВНУЮ
        goTab('home', null);
    }
});

// === ЗАКАЗ ===
function createOrder() {
    const dest = document.getElementById('inp-dest').value;
    const price = document.getElementById('inp-price').value;
    if(!dest || !price) {
        if(tg) tg.showAlert('Заполните адрес и цену');
        return;
    }
    openModal('modal-searching');
    
    // Создаем заказ для водителя
    const etherContainer = document.getElementById('ether-container');
    const newOrderHtml = `
        <div class="order-strip glass-morphism">
            <div class="route-info">
                <div class="route-line"><span class="dot a"></span> Моё местоположение</div>
                <div class="route-arrow">↓</div>
                <div class="route-line"><span class="dot b"></span> ${dest}</div>
            </div>
            <div class="order-action">
                <div class="price-tag">${price}₸</div>
                <button class="take-btn-big glow-anim" onclick="openOfferModal(${price})">Взять</button>
            </div>
        </div>
    `;
    etherContainer.insertAdjacentHTML('afterbegin', newOrderHtml);
}

function minimizeSearch() {
    document.getElementById('modal-overlay').classList.add('hidden');
    // Показываем мини-статус или просто выходим
}

function cancelOrder() {
    document.getElementById('modal-overlay').classList.add('hidden');
    if(tg) tg.HapticFeedback.impactOccurred('light');
}

// === ВОДИТЕЛЬ: ТОРГ ===
function openOfferModal(price) {
    document.querySelector('#modal-driver-offer .offer-price-big').innerText = price + ' ₸';
    openModal('modal-driver-offer');
}
function acceptOrder() {
    document.getElementById('modal-overlay').classList.add('hidden');
    if(tg) tg.showAlert('Вы приняли заказ!');
}

// === ЛЕНТА: КНОПКИ ===
function sharePost(btn) {
    if(navigator.share) navigator.share({title: 'Aitax', text: 'Пост из Aitax', url: window.location.href});
}
function openComments() {
    openModal('modal-comments');
}
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const icon = btn.querySelector('ion-icon');
    icon.setAttribute('name', btn.classList.contains('liked') ? 'heart' : 'heart-outline');
    if(tg) tg.HapticFeedback.selectionChanged();
}
// (Публикация поста осталась прежней, сокращаю для лимита)
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const previewCont = document.getElementById('image-preview-container');
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { selectedImage = e.target.result; imagePreview.src = selectedImage; previewCont.classList.add('visible'); };
        reader.readAsDataURL(file);
    }
});
document.getElementById('remove-image-btn').addEventListener('click', () => { selectedImage = null; fileInput.value = ''; previewCont.classList.remove('visible'); });
function publishPost() {
    const text = document.getElementById('post-text-input').value;
    if(!text && !selectedImage) return;
    const cont = document.getElementById('feed-container');
    const post = document.createElement('div');
    post.className = 'post-card glass-morphism';
    post.innerHTML = `
        <button class="delete-post-btn" onclick="this.closest('.post-card').remove()">✕</button>
        <div class="post-head"><div class="avatar-mini" style="background:var(--accent)">E</div><span class="name">Елназар</span><span class="time">Только что</span></div>
        ${text ? `<div class="text">${text}</div>` : ''}
        ${selectedImage ? `<img src="${selectedImage}" class="post-image" style="width:100%;border-radius:10px;margin-bottom:10px;">` : ''}
        <div class="post-actions">
            <button class="act-btn" onclick="toggleLike(this)"><ion-icon name="heart-outline"></ion-icon></button>
            <button class="act-btn" onclick="openComments()"><ion-icon name="chatbubble-outline"></ion-icon></button>
            <button class="act-btn" onclick="sharePost()"><ion-icon name="share-social-outline"></ion-icon></button>
        </div>
    `;
    cont.insertBefore(post, cont.firstChild);
    document.getElementById('post-text-input').value = '';
    document.getElementById('remove-image-btn').click();
    if(tg) tg.HapticFeedback.notificationOccurred('success');
}

// === КАРТА ===
function initMap() {
    map = L.map('map-container', { zoomControl: false }).setView([49.8028, 73.1021], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    locateUser();
}
function locateUser() {
    if(!map) return;
    map.locate({setView: true, maxZoom: 14});
    map.on('locationfound', (e) => {
        if(userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(e.latlng).addTo(map);
    });
}

// === ОБЩЕЕ ===
function selectCity(name, weather) {
    document.getElementById('current-city').innerText = name;
    document.getElementById('current-weather').innerText = weather;
    document.getElementById('modal-overlay').classList.add('hidden');
}
function setTheme(color) {
    document.documentElement.style.setProperty('--accent', color);
    document.getElementById('modal-overlay').classList.add('hidden');
}
function openModal(id) {
    document.querySelectorAll('.modal-card').forEach(c => c.classList.remove('active'));
    document.getElementById('modal-overlay').classList.remove('hidden');
    document.getElementById(id).classList.add('active');
    closeSidebar();
}
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('close-m') || e.target.id === 'modal-overlay') {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
});
function openSidebar() { document.getElementById('sidebar-settings').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar-settings').classList.remove('open'); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ai-main-btn').classList.add('active-mode');
});
