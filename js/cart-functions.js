// Cart Functions
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display cart items
    displayCartItems();
    updateCartSummary();
    
    // Display cart items
    function displayCartItems() {
        const cartContainer = document.getElementById('cart-items-container');
        const emptyCart = document.getElementById('empty-cart');
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '';
            emptyCart.style.display = 'block';
            document.getElementById('checkout-btn').disabled = true;
            return;
        }
        
        emptyCart.style.display = 'none';
        
        let html = '';
        cart.forEach((item, index) => {
            html += `
            <div class="cart-item" data-index="${index}">
                <div class="row">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    </div>
                    <div class="col-md-6">
                        <h4>${item.name}</h4>
                        <p class="text-muted">${item.description || 'Premium quality product'}</p>
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-2">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-right">
                        <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">
                            <i class="fa fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
            `;
        });
        
        cartContainer.innerHTML = html;
        document.getElementById('checkout-btn').disabled = false;
    }
    
    // Update quantity
    window.updateQuantity = function(index, change) {
        if (cart[index].quantity + change < 1) {
            removeItem(index);
            return;
        }
        
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartSummary();
        
        // Update cart count in navbar if on main site
        if (window.parent && window.parent.updateCartCount) {
            window.parent.updateCartCount();
        }
    }
    
    // Remove item
    window.removeItem = function(index) {
        if (confirm('Are you sure you want to remove this item?')) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartSummary();
            
            // Update cart count in navbar if on main site
            if (window.parent && window.parent.updateCartCount) {
                window.parent.updateCartCount();
            }
        }
    }
    
    // Update cart summary
    function updateCartSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 10.00 : 0;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Simulate order creation
        const orderId = 'ORD' + Date.now().toString().slice(-6);
        const order = {
            id: orderId,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            total: parseFloat(document.getElementById('total').textContent.replace('$', '')),
            items: [...cart]
        };
        
        // Get existing orders
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.unshift(order); // Add new order at beginning
        
        // Save order
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        cart = [];
        
        // Update UI
        displayCartItems();
        updateCartSummary();
        
        // Show success message
        alert(`Order #${orderId} created successfully! Total: $${order.total.toFixed(2)}`);
        
        // Update cart count in navbar if on main site
        if (window.parent && window.parent.updateCartCount) {
            window.parent.updateCartCount();
        }
        
        // Redirect to orders page
        window.location.href = 'orders.html';
    });
});