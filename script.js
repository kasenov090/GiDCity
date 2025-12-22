const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setHeaderColor('#000000'); tg.enableClosingConfirmation(); }

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let map, userMarker;
let selectedImage = null;

// === УПРАВЛЕНИЕ ВКЛАДКАМИ ===
function goTab(id, btn) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('screen-' + id);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    const aiBtn = document.getElementById('ai-main-btn');
    id === 'home' ? aiBtn.classList.add('active-mode') : aiBtn.classList.remove('active-mode');

    // Инициализация карты только при переходе на её вкладку
    if (id === 'map' && !map) {
        initMap();
    }

    if(tg) tg.HapticFeedback.selectionChanged();
}

// === 1. ЛОГИКА ЛЕНТЫ (SOCIAL) ===

// Обработка выбора файла
const fileInput = document.getElementById('file-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image-btn');

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = e.target.result;
            imagePreview.src = selectedImage;
            imagePreviewContainer.classList.add('visible');
        }
        reader.readAsDataURL(file);
    }
});

removeImageBtn.addEventListener('click', () => {
    selectedImage = null;
    fileInput.value = '';
    imagePreviewContainer.classList.remove('visible');
});

// Публикация поста
function publishPost() {
    const textInput = document.getElementById('post-text-input');
    const text = textInput.value.trim();
    
    if (!text && !selectedImage) {
        if(tg) tg.showAlert('Напишите текст или добавьте фото');
        return;
    }

    const feedContainer = document.getElementById('feed-container');
    const newPost = document.createElement('div');
    newPost.className = 'post-card glass-morphism';
    
    let imageHTML = '';
    if (selectedImage) {
        imageHTML = `<img src="${selectedImage}" class="post-image">`;
    }

    newPost.innerHTML = `
        <div class="post-head">
            <div class="avatar-mini">R</div>
            <span class="name">Руслан</span><span class="time">Только что</span>
        </div>
        ${text ? `<div class="text">${text}</div>` : ''}
        ${imageHTML}
        <div class="post-actions">
            <button class="act-btn like-btn" onclick="toggleLike(this)">
                <ion-icon name="heart-outline"></ion-icon> <span class="count">0</span>
            </button>
            <button class="act-btn comment-btn">
                <ion-icon name="chatbubble-outline"></ion-icon> <span class="count">0</span>
            </button>
            <button class="act-btn share-btn" onclick="sharePost(this)">
                <ion-icon name="share-social-outline"></ion-icon>
            </button>
        </div>
    `;

    // Добавляем в начало ленты с анимацией
    newPost.style.opacity = 0;
    feedContainer.insertBefore(newPost, feedContainer.firstChild);
    setTimeout(() => newPost.style.opacity = 1, 50);

    // Сброс формы
    textInput.value = '';
    removeImageBtn.click();
    if(tg) tg.HapticFeedback.notificationOccurred('success');
}

// Лайки
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const countSpan = btn.querySelector('.count');
    let count = parseInt(countSpan.innerText);
    
    if (btn.classList.contains('liked')) {
        count++;
        btn.querySelector('ion-icon').setAttribute('name', 'heart');
    } else {
        count--;
        btn.querySelector('ion-icon').setAttribute('name', 'heart-outline');
    }
    countSpan.innerText = count;
    if(tg) tg.HapticFeedback.impactOccurred('light');
}

// Поделиться (Web Share API)
function sharePost(btn) {
    const post = btn.closest('.post-card');
    const text = post.querySelector('.text')?.innerText || 'Посмотрите этот пост в Aitax!';
    
    if (navigator.share) {
        navigator.share({
            title: 'Aitax Post',
            text: text,
            url: window.location.href // Или ссылка на конкретный пост, если бы она была
        }).catch(console.error);
    } else {
        if(tg) tg.showAlert('Sharing not supported on this device');
    }
}


// === 2. ЛОГИКА КАРТЫ (LEAFLET) ===
function initMap() {
    // Караганда по умолчанию
    const defaultPos = [49.8028, 73.1021];
    
    map = L.map('map-container', { zoomControl: false }).setView(defaultPos, 13);

    // Добавляем слой OpenStreetMap (темный стиль через CSS фильтры)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Иконка пользователя (синяя точка)
    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="width: 16px; height: 16px; background: #0a84ff; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #0a84ff;"></div>',
        iconSize: [20, 20]
    });

    // Иконки для акций (Бургер, Кино) - просто эмодзи маркеры
    const createPromoMarker = (emoji, lat, lng, title) => {
       const icon = L.divIcon({
           className: 'promo-marker',
           html: `<div class="glass-effect" style="padding: 8px; border-radius: 12px; font-size: 20px;">${emoji}</div>`,
           iconSize: [40, 40]
       });
       L.marker([lat, lng], {icon: icon}).addTo(map).bindPopup(title);
    }

    // Пытаемся найти пользователя
    map.locate({setView: true, maxZoom: 15});

    map.on('locationfound', function(e) {
        if (userMarker) map.removeLayer(userMarker);
        userMarker = L.marker(e.latlng, {icon: userIcon}).addTo(map);
        
        // Добавляем фейковые акции ВОКРУГ пользователя
        createPromoMarker('🍔', e.latlng.lat + 0.005, e.latlng.lng + 0.005, 'Burger King -20%');
        createPromoMarker('🎬', e.latlng.lat - 0.005, e.latlng.lng - 0.003, 'Кинопарк: Попкорн в подарок');
    });

    map.on('locationerror', function(e) {
       if(tg) tg.showAlert("Не удалось определить местоположение. Показан центр города.");
       // Акции в центре, если не нашли юзера
       createPromoMarker('🍔', 49.81, 73.11, 'Burger King');
    });
}

function locateUser() {
    if(map) {
        map.locate({setView: true, maxZoom: 15});
        if(tg) tg.HapticFeedback.impactOccurred('medium');
    }
}

// === ОСТАЛЬНАЯ ЛОГИКА (AI, Тарифы, Модалки) ===
// (Оставляем как было в предыдущей версии, она рабочая)
const aiBtn = document.getElementById('ai-main-btn');
let pressTimer;
aiBtn.addEventListener('touchstart', (e) => {
    aiBtn.style.transform = "scale(0.9)";
    pressTimer = setTimeout(() => { if(tg) tg.HapticFeedback.impactOccurred('heavy'); aiBtn.classList.add('listening'); }, 600);
});
aiBtn.addEventListener('touchend', () => {
    clearTimeout(pressTimer); aiBtn.style.transform = ""; aiBtn.classList.remove('listening'); goTab('home', null);
});

function setTariff(el) {
    document.querySelectorAll('.tariff').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    if(tg) tg.HapticFeedback.selectionChanged();
}

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

function openSidebar() { document.getElementById('sidebar-settings').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar-settings').classList.remove('open'); }
