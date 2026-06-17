let productsData = [];
let cart = JSON.parse(localStorage.getItem('coffee_cart')) || [];
let currentSelectedProduct = null;

const productListEl = document.getElementById('product-list');
const template = document.getElementById('product-template');
const categoryTabs = document.querySelectorAll('.nav-item');
const bottomBar = document.getElementById('bottom-bar');
const checkoutBtn = document.getElementById('checkout-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items-container');

// Modal Elements
const overlay = document.getElementById('modal-overlay');
const customModal = document.getElementById('custom-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const confirmAddBtn = document.getElementById('add-to-cart-confirm-btn');

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
});

async function fetchProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        productsData = await res.json();
        renderProducts("全部");
    } catch (err) {
        console.error("Failed to fetch products", err);
    }
}

function renderProducts(category) {
    productListEl.innerHTML = '';
    const filtered = category === "全部" 
        ? productsData 
        : productsData.filter(p => p.category === category);

    filtered.forEach(product => {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.product-name').textContent = product.name;
        clone.querySelector('.product-price').textContent = `NT$ ${product.price}`;
        
        const addBtn = clone.querySelector('.add-btn');
        addBtn.addEventListener('click', () => openCustomModal(product));
        
        productListEl.appendChild(clone);
    });
}

// Category Switching
categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        renderProducts(e.target.dataset.category);
    });
});

// Modal Logic
function openCustomModal(product) {
    currentSelectedProduct = product;
    document.getElementById('modal-product-name').textContent = product.name;
    
    // Reset options
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelector('#ice-options .option-btn[data-val="正常冰"]').classList.add('selected');
    document.querySelector('#sugar-options .option-btn[data-val="正常糖"]').classList.add('selected');

    if (product.category === "點心") {
        document.getElementById('ice-group').style.display = "none";
        document.getElementById('sugar-group').style.display = "none";
    } else {
        document.getElementById('ice-group').style.display = "block";
        document.getElementById('sugar-group').style.display = "block";
    }

    overlay.classList.add('open');
    customModal.classList.add('open');
}

function closeModal() {
    overlay.classList.remove('open');
    customModal.classList.remove('open');
    currentSelectedProduct = null;
}

overlay.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// Option Selection
document.querySelectorAll('.option-grid').forEach(grid => {
    grid.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-btn')) {
            grid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
});

confirmAddBtn.addEventListener('click', () => {
    if (!currentSelectedProduct) return;
    
    let notes = "";
    if (currentSelectedProduct.category !== "點心") {
        const ice = document.querySelector('#ice-options .option-btn.selected').dataset.val;
        const sugar = document.querySelector('#sugar-options .option-btn.selected').dataset.val;
        notes = `${ice}, ${sugar}`;
    }

    cart.push({
        product_id: currentSelectedProduct.id,
        name: currentSelectedProduct.name,
        price: currentSelectedProduct.price,
        quantity: 1,
        custom_notes: notes
    });

    localStorage.setItem('coffee_cart', JSON.stringify(cart));
    updateCartUI();
    closeModal();
});

// Cart UI Logic
function updateCartUI() {
    let totalCount = cart.length;
    let totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.querySelector('.cart-total-count').textContent = `${totalCount} 份`;
    document.querySelector('.cart-total-price').textContent = `NT$ ${totalPrice}`;

    if (totalCount > 0) {
        checkoutBtn.classList.add('active');
        renderCartDrawer();
    } else {
        checkoutBtn.classList.remove('active');
        cartDrawer.classList.remove('open');
    }
}

function renderCartDrawer() {
    cartItemsContainer.innerHTML = '';
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <div>${item.name} x ${item.quantity}</div>
                ${item.custom_notes ? `<div class="cart-item-meta">${item.custom_notes}</div>` : ''}
            </div>
            <div>NT$ ${item.price}</div>
        `;
        cartItemsContainer.appendChild(div);
    });
}

bottomBar.addEventListener('click', (e) => {
    if (e.target.id === 'checkout-btn') return;
    if (cart.length > 0) {
        cartDrawer.classList.toggle('open');
    }
});

// Checkout
checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) return;

    const orderData = {
        items: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            custom_notes: item.custom_notes
        }))
    };

    try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.removeItem('coffee_cart');
            cart = [];
            window.location.href = `order-status.html?id=${data.id}`;
        }
    } catch (err) {
        alert('結帳失敗，請稍後再試');
    }
});