// Orders Functions
document.addEventListener('DOMContentLoaded', function() {
    // Try to load orders from localStorage first
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // If no orders in localStorage, load from embedded JSON
    if (orders.length === 0) {
        try {
            const ordersData = document.getElementById('orders-data');
            orders = JSON.parse(ordersData.textContent);
        } catch (e) {
            console.error('Error loading orders:', e);
            orders = [];
        }
    }
    
    displayOrders(orders);
    
    function displayOrders(orders) {
        const ordersContainer = document.getElementById('orders-container');
        const noOrders = document.getElementById('no-orders');
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '';
            noOrders.style.display = 'block';
            return;
        }
        
        noOrders.style.display = 'none';
        
        let html = '';
        orders.forEach(order => {
            const statusClass = `status-${order.status}`;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            
            html += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h4>Order #${order.id}</h4>
                        <p class="text-muted">Placed on ${order.date}</p>
                    </div>
                    <div>
                        <span class="order-status ${statusClass}">${statusText}</span>
                        <h4 class="text-primary">$${order.total.toFixed(2)}</h4>
                    </div>
                </div>
                
                <div class="order-products">
            `;
            
            order.items.forEach(item => {
                html += `
                <div class="order-product">
                    <img src="${item.image}" alt="${item.name}" class="product-img">
                    <div class="flex-grow-1">
                        <h5>${item.name}</h5>
                        <p class="text-muted">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="text-right">
                        <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
                `;
            });
            
            html += `
                </div>
                
                <div class="text-right mt-3">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                        <i class="fa fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-outline-success btn-sm" onclick="reorder('${order.id}')">
                        <i class="fa fa-redo"></i> Reorder
                    </button>
                </div>
            </div>
            `;
        });
        
        ordersContainer.innerHTML = html;
    }
    
    // View order details
    window.viewOrderDetails = function(orderId) {
        alert(`Viewing details for order #${orderId}\nThis would show more detailed information in a real application.`);
    }
    
    // Reorder function
    window.reorder = function(orderId) {
        // Find the order
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            alert('Order not found!');
            return;
        }
        
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Add items to cart
        order.items.forEach(orderItem => {
            const existingItem = cart.find(cartItem => cartItem.id === orderItem.id);
            
            if (existingItem) {
                existingItem.quantity += orderItem.quantity;
            } else {
                cart.push({
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    image: orderItem.image,
                    description: orderItem.description || '',
                    quantity: orderItem.quantity
                });
            }
        });
        
        // Save cart
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        alert(`Added ${order.items.length} item(s) from order #${orderId} to your cart!`);
        
        // Update cart count if on main site
        if (window.parent && window.parent.updateCartCount) {
            window.parent.updateCartCount();
        }
        
        // Redirect to cart
        window.location.href = 'cart.html';
    }
});