// payment.js - Payment Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Load cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0;
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};

    // DOM Elements
    const orderItemsContainer = document.getElementById('order-items-container');
    const orderSummaryContainer = document.getElementById('order-summary-container');
    const backBtn = document.getElementById('back-btn');
    const paymentForm = document.getElementById('payment-form');
    const loader = document.getElementById('loader');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const cancelBtn = document.getElementById('cancel-btn');

    // Initialize page
    if (cart.length === 0) {
        showEmptyState();
    } else {
        loadOrderItems();
        loadOrderSummary();
    }
    
    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // Add event listeners
    if (backBtn) backBtn.addEventListener('click', goBackToCart);
    if (paymentForm) paymentForm.addEventListener('submit', processPayment);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelOrder);

    // Functions
    function loadOrderItems() {
        if (!orderItemsContainer) return;
        
        orderItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-item-image"
                     onerror="this.src='https://images.unsplash.com/photo-1556656793-08538906a9f8?w=80&h=80&fit=crop'">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">
                        $${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
    }

    function loadOrderSummary() {
        if (!orderSummaryContainer) return;
        
        const tax = cartTotal * 0.08;
        const shipping = cartTotal > 100 ? 0 : 9.99;
        const total = cartTotal + tax + shipping;
        
        orderSummaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${cartTotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-row total">
                <span>Total Amount</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }

    function showEmptyState() {
        if (!orderItemsContainer) return;
        
        orderItemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add items to your cart before checkout</p>
                <button class="btn btn-secondary" onclick="window.location.href='cart.html'" style="margin-top: 20px;">
                    <i class="fas fa-arrow-left"></i> Back to Shopping
                </button>
            </div>
        `;
        
        if (orderSummaryContainer) {
            orderSummaryContainer.innerHTML = '';
        }
    }

    function formatCardNumber(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
    }

    function formatExpiryDate(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    function goBackToCart() {
        window.location.href = 'cart.html';
    }

    function cancelOrder() {
        if (confirm('Are you sure you want to cancel this order?')) {
            showLoader();
            
            setTimeout(() => {
                // Clear cart data
                localStorage.removeItem('cart');
                localStorage.removeItem('cartTotal');
                localStorage.removeItem('cartCount');
                localStorage.removeItem('orderSummary');
                
                showNotification('Order cancelled successfully', 'success');
                
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1000);
            }, 1000);
        }
    }
function selectPayment(method, el) {
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('active');
    });

    document.getElementById('gcashForm').classList.add('hidden');
    document.getElementById('cardForm').classList.add('hidden');
    document.getElementById('bankForm').classList.add('hidden');

    el.classList.add('active');
    document.getElementById(method + 'Form').classList.remove('hidden');
}
    function processPayment(e) {
        e.preventDefault();
        
        // Get form values
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const email = document.getElementById('email').value;
        
        // Basic validation
        if (!cardName || !cardNumber || !expiryDate || !cvv || !email) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            showNotification('Please enter a valid 16-digit card number', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        showLoader();
        
        // Simulate payment processing
        setTimeout(() => {
            // Generate order number
            const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
            
            // Save order confirmation
            const orderConfirmation = {
                orderNumber: orderNumber,
                date: new Date().toLocaleString(),
                items: cart,
                summary: JSON.parse(localStorage.getItem('orderSummary') || '{}'),
                customer: {
                    email: email,
                    name: cardName
                }
            };
            
            localStorage.setItem('orderConfirmation', JSON.stringify(orderConfirmation));
            
            // Clear cart
            localStorage.removeItem('cart');
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('cartCount');
            
            hideLoader();
            showNotification('Payment successful! Redirecting to confirmation...', 'success');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = 'confirmation.html?order=' + orderNumber;
            }, 1500);
        }, 2000);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showLoader() {
        if (loader) loader.classList.add('active');
    }

    function hideLoader() {
        if (loader) loader.classList.remove('active');
    }

    function showNotification(message, type = 'success') {
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification show ${type}`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
});