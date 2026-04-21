// ========== ОБНОВЛЕНИЕ КНОПОК ВХОДА/ВЫХОДА ==========
function updateAuthButtons() {
    const authContainer = document.getElementById('authButtons');
    if (!authContainer) return;
    
    const currentUser = localStorage.getItem('currentUser');
    const isLoggedIn = currentUser !== null;
    
    if (isLoggedIn) {
        // Получаем имя пользователя из localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === currentUser);
        const userName = user ? user.name : currentUser.split('@')[0];
        
        authContainer.innerHTML = `
            <span class="user-name">${userName}</span>
            <button class="auth-btn logout-btn" onclick="logout()">Выйти</button>
        `;
    } else {
        authContainer.innerHTML = `
            <button class="auth-btn login-btn" onclick="location.href='login.html'">Вход</button>
            <button class="auth-btn register-btn" onclick="location.href='register.html'">Регистрация</button>
        `;
    }
}

// ========== ВЫХОД ИЗ АККАУНТА ==========
function logout() {
    localStorage.removeItem('currentUser');
    alert('Вы вышли из аккаунта');
    location.reload();
}

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// ========== ДОБАВЛЕНИЕ В КОРЗИНУ (ТОЛЬКО ДЛЯ АВТОРИЗОВАННЫХ) ==========
function addToCartCheckLogin(productId, productName, productPrice) {
    if (!isUserLoggedIn()) {
        alert('Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину');
        window.location.href = 'login.html';
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Товар "${productName}" добавлен в корзину`);
}

function displayCart() {
    const cartContainer = document.getElementById('cartContent');
    if (!cartContainer) return;
    
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p class="empty-cart-text">Ваша корзина пуста</p>
                <p class="empty-cart-text">Для добавления товаров - войдите в аккаунт</p>
            </div>
        `;
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <p class="empty-cart-text">Ваша корзина пуста</p>
                <p class="empty-cart-text">Чтобы добавить товары - перейдите в каталог</p>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let html = '<div class="cart-items">';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Цена: ${item.price} руб.</p>
                    <p>Количество: ${item.quantity} шт.</p>
                    <p>Сумма: ${itemTotal} руб.</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Удалить</button>
            </div>
        `;
    });
    
    // ВОТ ЗДЕСЬ КНОПКА "ОФОРМИТЬ ЗАКАЗ" - ОНА ВЕДЁТ НА checkout.html
    html += `</div><div class="cart-total"><h3>Итого: ${total} руб.</h3><button class="checkout-btn" onclick="location.href='checkout.html'">Оформить заказ</button></div>`;
    cartContainer.innerHTML = html;
}

// ========== УДАЛЕНИЕ ИЗ КОРЗИНЫ ==========
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
function checkout() {
    alert('Спасибо за заказ! Наш менеджер свяжется с вами.');
    localStorage.removeItem('cart');
    displayCart();
}

// ========== ДАННЫЕ ТОВАРОВ ДЛЯ PRODUCT-CARD ==========
const products = {
    1: { name: "НЕЖНОСТЬ", price: 6000, description: "АВТОРСКИЙ БУКЕТ ДЛЯ ОСЕННЕГО НАСТРОЕНИЯ", composition: ["РОЗЫ", "КУСТОВЫЕ ГВОЗДИКИ", "ЭУСТОМА", "ЭВКАЛИПТ"], image: "images/product1.jpg" },
    2: { name: "РОЗОВОЕ ЧУДО", price: 3000, description: "НЕЖНОЕ СОВЕРШЕНСТВО", composition: ["РОЗЫ", "ГИПСОФИЛА", "ФРЕЗИЯ", "ЭВКАЛИПТ"], image: "images/product2.jpg" },
    3: { name: "ЗАКАТ", price: 2700, description: "АВТОРСКАЯ КОМПОЗИЦИЯ В ЯРКО-КРАСНЫХ ТОНАХ", composition: ["КРАСНЫЕ РОЗЫ", "АЛЬСТРОМЕРИЯ", "ГВОЗДИКИ", "КРАСНЫЙ ЭВКАЛИПТ"], image: "images/product3.jpg" },
    4: { name: "ЛЕТО КРАСНОЕ", price: 3000, description: "АВТОРСКАЯ КОМПОЗИЦИЯ В ЯРКИХ СОЛНЕЧНЫХ ТОНАХ", composition: ["ПОДСОЛНУХИ", "РОМАШКИ", "ГВОЗДИКИ", "ЗЕЛЕНЬ"], image: "images/product4.jpg" },
    5: { name: "НЕЖНОЕ УТРО", price: 2600, description: "ВОЗДУШНЫЕ КУСТОВЫЕ РОЗЫ", composition: ["КУСТОВЫЕ РОЗЫ", "ГИПСОФИЛА", "ЭВКАЛИПТ"], image: "images/product5.jpg" },
    6: { name: "СУМЕРКИ", price: 2500, description: "АВТОРСКАЯ КОМПОЗИЦИЯ В СИРЕНЕВЫХ ТОНАХ", composition: ["СИРЕНЬ", "ЛАВАНДА", "ЭУСТОМА", "ЭВКАЛИПТ"], image: "images/product6.jpg" }
};

// ========== ИНИЦИАЛИЗАЦИЯ PRODUCT-CARD ==========
function initProductCard() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    if (!productId || !products[productId]) productId = 1;
    
    const product = products[productId];
    
    const nameEl = document.getElementById('productName');
    const priceEl = document.getElementById('productPrice');
    const descEl = document.getElementById('productDescription');
    const imageEl = document.getElementById('productImage');
    const compositionEl = document.getElementById('productComposition');
    
    if (nameEl) nameEl.textContent = product.name;
    if (priceEl) priceEl.textContent = product.price + " РУБ.";
    if (descEl) descEl.textContent = product.description;
    if (imageEl) { imageEl.src = product.image; imageEl.alt = product.name; }
    
    if (compositionEl) {
        compositionEl.innerHTML = '';
        product.composition.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            compositionEl.appendChild(li);
        });
    }
    
    let quantity = 1;
    const qtyValue = document.getElementById('qtyValue');
    const minusBtn = document.getElementById('minusBtn');
    const plusBtn = document.getElementById('plusBtn');
    const buyBtn = document.getElementById('buyBtn');
    const cartBtn = document.getElementById('cartBtn');
    
    if (minusBtn) minusBtn.addEventListener('click', () => { if (quantity > 1) { quantity--; if (qtyValue) qtyValue.textContent = quantity; } });
    if (plusBtn) plusBtn.addEventListener('click', () => { quantity++; if (qtyValue) qtyValue.textContent = quantity; });
    
    if (buyBtn) {
        buyBtn.addEventListener('click', () => {
            if (!isUserLoggedIn()) {
                alert('Пожалуйста, войдите в аккаунт для оформления покупки');
                window.location.href = 'login.html';
                return;
            }
            alert(`Товар "${product.name}" в количестве ${quantity} шт. Оформление покупки...`);
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (!isUserLoggedIn()) {
                alert('Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину');
                window.location.href = 'login.html';
                return;
            }
            
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id == productId);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += quantity;
            } else {
                cart.push({ id: parseInt(productId), name: product.name, price: product.price, quantity: quantity });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`Товар "${product.name}" в количестве ${quantity} шт. добавлен в корзину`);
        });
    }
}

// ========== ОБРАБОТЧИКИ ФОРМ ==========
function initForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', email);
                alert('Вход выполнен успешно!');
                // Возвращаемся на предыдущую страницу или на главную
                const referrer = document.referrer;
                if (referrer && referrer.includes('orders.html')) {
                    window.location.href = 'orders.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('Неверный email или пароль');
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) { alert('Пароли не совпадают!'); return; }
            if (password.length < 6) { alert('Пароль должен содержать минимум 6 символов'); return; }
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === email)) { alert('Пользователь с таким email уже существует'); return; }
            
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', email);
            alert('Регистрация успешна!');
            window.location.href = 'index.html';
        });
    }
}

// ========== ЗАПУСК ВСЕГО ==========
document.addEventListener('DOMContentLoaded', function() {
    updateAuthButtons();
    initForms();
    initProductCard();
    displayCart();
});

// ========== ОТОБРАЖЕНИЕ ЗАКАЗОВ ==========
function displayOrders() {
    const ordersContainer = document.getElementById('ordersContent');
    if (!ordersContainer) return;
    
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <p class="empty-orders-text">Пожалуйста, войдите в аккаунт, чтобы просмотреть заказы</p>
                <button class="login-redirect-btn" onclick="location.href='login.html'">Войти</button>
            </div>
        `;
        return;
    }
    
    // ПОЛУЧАЕМ ВСЕ ЗАКАЗЫ
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('Все заказы:', allOrders); // ПРОВЕРКА В КОНСОЛИ
    
    // ФИЛЬТРУЕМ ЗАКАЗЫ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
    const userOrders = allOrders.filter(order => order.userEmail === currentUser);
    console.log('Заказы пользователя:', userOrders); // ПРОВЕРКА В КОНСОЛИ
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <p class="empty-orders-text">У вас пока нет заказов</p>
                <button class="shop-redirect-btn" onclick="location.href='index.html#bouquets'">Перейти к покупкам</button>
            </div>
        `;
        return;
    }
    
    let html = '<div class="orders-list">';
    
    userOrders.reverse().forEach((order) => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-number">Заказ №${order.id}</div>
                    <div class="order-date">${formattedDate}</div>
                    <div class="order-status ${order.status === 'completed' ? 'status-completed' : 'status-processing'}">${order.status === 'completed' ? 'Выполнен' : 'В обработке'}</div>
                </div>
                <div class="order-items">
                    <h4>Состав заказа:</h4>
                    <ul>
        `;
        
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                html += `<li>${item.name} — ${item.quantity} шт. × ${item.price} руб. = ${item.quantity * item.price} руб.</li>`;
            });
        } else {
            html += `<li>Ошибка: состав заказа не найден</li>`;
        }
        
        html += `
                    </ul>
                </div>
                <div class="order-total">
                    <strong>Итого: ${order.total} руб.</strong>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    ordersContainer.innerHTML = html;
}

// ========== ОФОРМЛЕНИЕ ЗАКАЗА (СОХРАНЕНИЕ В ИСТОРИЮ) ==========
// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
// ========== ОФОРМЛЕНИЕ ЗАКАЗА (СОХРАНЕНИЕ) ==========
function checkout() {
    if (!isUserLoggedIn()) {
        alert('Пожалуйста, войдите в аккаунт для оформления заказа');
        window.location.href = 'login.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.length === 0) {
        alert('Корзина пуста');
        return;
    }
    
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    // ПОЛУЧАЕМ СПИСОК ЗАКАЗОВ
    let allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // СОЗДАЁМ НОВЫЙ ЗАКАЗ
    const newOrder = {
        id: Date.now(),
        userEmail: localStorage.getItem('currentUser'),
        date: new Date().toISOString(),
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        status: 'processing'
    };
    
    // ДОБАВЛЯЕМ ЗАКАЗ
    allOrders.push(newOrder);
    
    // СОХРАНЯЕМ
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    // ОЧИЩАЕМ КОРЗИНУ
    localStorage.removeItem('cart');
    
    alert(`Заказ №${newOrder.id} оформлен!\nСумма: ${total} руб.\nЗаказ отображается в разделе "ЗАКАЗЫ"`);
    
    // ПЕРЕХОДИМ НА СТРАНИЦУ ЗАКАЗОВ
    window.location.href = 'orders.html';
}