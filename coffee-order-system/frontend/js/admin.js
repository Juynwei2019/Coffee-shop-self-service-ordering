const adminTabs = document.querySelectorAll('#admin-tabs .nav-item');
const adminList = document.getElementById('admin-list');
let currentTab = 'pending';
let knownPendingIds = [];

// 使用內建的短促提示音 Data URI 確保沒有資源加載問題
const alertSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    setInterval(fetchOrders, 10000); // 10秒輪詢
});

adminTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        adminTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentTab = e.target.dataset.status;
        fetchOrders();
    });
});

async function fetchOrders() {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/orders`);
        const allOrders = await res.json();
        
        // 檢查新訂單音效提示
        const currentPendingIds = allOrders.filter(o => o.status === 'pending').map(o => o.id);
        const hasNew = currentPendingIds.some(id => !knownPendingIds.includes(id));
        if (hasNew && knownPendingIds.length > 0) {
            alertSound.play().catch(e => console.log("Audio play prevented by browser"));
        }
        knownPendingIds = currentPendingIds;

        const filteredOrders = allOrders.filter(o => o.status === currentTab);
        renderOrders(filteredOrders);
    } catch (err) {
        console.error("Fetch orders failed", err);
    }
}

function renderOrders(orders) {
    adminList.innerHTML = '';
    if (orders.length === 0) {
        adminList.innerHTML = '<p style="text-align:center; color:var(--text-sub); margin-top: 40px;">目前無訂單</p>';
        return;
    }

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'admin-card';
        
        let itemsHtml = order.items.map(item => `
            <div style="margin-bottom: 8px;">
                <span>${item.product.name} x ${item.quantity}</span>
                ${item.custom_notes ? `<div class="admin-notes">${item.custom_notes}</div>` : ''}
            </div>
        `).join('');

        let btnHtml = '';
        if (currentTab === 'pending') {
            btnHtml = `<button class="admin-action-btn" onclick="updateStatus(${order.id}, 'making')">開始製作</button>`;
        } else if (currentTab === 'making') {
            btnHtml = `<button class="admin-action-btn" onclick="updateStatus(${order.id}, 'ready')">通知取餐</button>`;
        }

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                <strong style="font-size: 20px;">#${order.id}</strong>
                <span style="color: var(--text-sub)">NT$ ${order.total_price}</span>
            </div>
            <div>${itemsHtml}</div>
            ${btnHtml}
        `;
        adminList.appendChild(card);
    });
}

async function updateStatus(orderId, newStatus) {
    try {
        const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchOrders();
    } catch (err) {
        alert("狀態更新失敗");
    }
}