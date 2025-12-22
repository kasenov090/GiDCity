const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand(); // Разворачиваем на весь экран
    tg.setHeaderColor("#000000"); // Черная шапка
}

// === ЛОГИКА ТАБОВ ===
function switchTab(tabName) {
    // 1. Скрываем все экраны
    document.querySelectorAll('.tab-screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });

    // 2. Убираем активный класс с кнопок дока
    document.querySelectorAll('.dock-item').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Показываем нужный
    const targetScreen = document.getElementById('tab-' + tabName);
    if (targetScreen) {
        targetScreen.style.display = 'block';
        // Небольшой таймаут для анимации, если нужно
        setTimeout(() => targetScreen.classList.add('active'), 10);
    }
    
    // 4. Подсвечиваем кнопку (ищем по иконке или индексу, здесь упрощенно)
    // В реальном проекте лучше добавить data-target атрибуты кнопкам
}

// === ВЫБОР АВТОМОБИЛЯ ===
function selectCar(element) {
    document.querySelectorAll('.car-card').forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    if (tg) {
        tg.HapticFeedback.selectionChanged(); // Вибрация при выборе
    }
}

// === AI ARIA ===
function openAria() {
    if (tg) tg.HapticFeedback.impactOccurred('medium');
    alert("Aria AI: Анализирую маршрут и погодные условия...");
    // Здесь можно открыть модальное окно с чатом
}

// === СМЕНА ФОНА (ИЗ МЕДИАТЕКИ) ===
document.getElementById('btn-settings').addEventListener('click', () => {
    // Триггерим скрытый инпут файла
    document.getElementById('bg-uploader').click();
});

document.getElementById('bg-uploader').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Устанавливаем картинку как фон контейнера карты
            const mapContainer = document.getElementById('map-container');
            mapContainer.style.backgroundImage = `url(${e.target.result})`;
            // Убираем сетку, если пользователь ставит фото, или оставляем для стиля
            // mapContainer.innerHTML = ''; // Если нужно убрать сетку
        };
        reader.readAsDataURL(file);
    }
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    // По умолчанию открыт таб такси
    switchTab('taxi');
});
