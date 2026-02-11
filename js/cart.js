// cart.js - Shopping Cart Functionality

// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateProductButtons();
        this.updateCartUI();
        this.setupFiltering();
    }

    cacheDOM() {
        // DOM Elements
        this.cartCount = document.querySelector('.cart-count');
        this.totalPriceElement = document.getElementById('total-price');
        this.modalTotalPriceElement = document.getElementById('modal-total-price');
        this.cartItemsContainer = document.getElementById('cart-items-container');
        this.cartModal = document.getElementById('cart-modal');
        this.notification = document.getElementById('notification');
        this.notificationText = document.getElementById('notification-text');
        this.loader = document.getElementById('loader');

        // Buttons
        this.viewCartBtn = document.getElementById('view-cart-btn');
        this.closeModalBtn = document.getElementById('close-modal');
        this.checkoutBtn = document.getElementById('checkoutBtn');
        this.clearCartBtn = document.getElementById('clear-cart-btn');
        this.continueShoppingBtn = document.getElementById('continue-shopping-btn');
        
        // Product items
        this.productItems = document.querySelectorAll('.product-item');
    }

    bindEvents() {
        // Event Listeners
        if (this.viewCartBtn) this.viewCartBtn.addEventListener('click', () => this.openCartModal());
        if (this.closeModalBtn) this.closeModalBtn.addEventListener('click', () => this.closeCartModal());
        if (this.checkoutBtn) this.checkoutBtn.addEventListener('click', () => this.checkout());
        if (this.clearCartBtn) this.clearCartBtn.addEventListener('click', () => this.clearCart());
        if (this.continueShoppingBtn) this.continueShoppingBtn.addEventListener('click', () => this.closeCartModal());
        
        // Close modal when clicking outside
        if (this.cartModal) {
            this.cartModal.addEventListener('click', (e) => {
                if (e.target === this.cartModal) this.closeCartModal();
            });
        }

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-portfolio')) {
                const button = e.target.closest('.add-to-cart-portfolio');
                const productId = parseInt(button.dataset.id);
                this.addToCart(productId);
            }
        });
    }

    setupFiltering() {
        const filterLinks = document.querySelectorAll('.filter-wrapper a');
        const isoBoxes = document.querySelectorAll('.iso-box');
        
        if (filterLinks.length === 0) return;
        
        filterLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter
                filterLinks.forEach(l => l.classList.remove('selected'));
                link.classList.add('selected');
                
                const filterValue = link.getAttribute('data-filter');
                
                // Filter products
                isoBoxes.forEach(box => {
                    if (filterValue === '*' || box.classList.contains(filterValue.substring(1))) {
                        box.style.display = 'block';
                        setTimeout(() => {
                            box.style.opacity = '1';
                            box.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        box.style.opacity = '0';
                        box.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            box.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    addToCart(productId) {
        this.showLoader();
        
        setTimeout(() => {
            const productElement = document.querySelector(`.product-item[data-id="${productId}"]`);
            if (!productElement) return;
            
            const product = {
                id: productId,
                name: productElement.dataset.name,
                price: parseFloat(productElement.dataset.price),
                image: productElement.dataset.image,
                description: productElement.dataset.description
            };
            
            const existingItemIndex = this.cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Increase quantity
                this.cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item
                this.cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            this.saveCart();
            this.updateCartUI();
            this.updateProductButtons();
            this.showNotification(`${product.name} added to cart!`, 'success');
            this.hideLoader();
        }, 300);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.updateProductButtons();
        this.showNotification('Item removed from cart', 'error');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            this.cart[itemIndex].quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
            this.updateProductButtons();
        }
    }

    updateProductButtons() {
        this.productItems.forEach(item => {
            const productId = parseInt(item.dataset.id);
            const button = item.querySelector('.add-to-cart-portfolio');
            const cartItem = this.cart.find(item => item.id === productId);
            
            if (cartItem && button) {
                button.classList.add('added');
                button.innerHTML = `<i class="fas fa-check"></i> ${cartItem.quantity} in Cart`;
            } else if (button) {
                button.classList.remove('added');
                button.innerHTML = `<i class="fa fa-cart-plus"></i> Add to Cart`;
            }
        });
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is already empty', 'warning');
            return;
        }
        
        if (confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.updateProductButtons();
            this.showNotification('Cart cleared successfully', 'success');
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        // Update cart count
        const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
        if (this.cartCount) this.cartCount.textContent = totalItems;
        
        // Update total price
        const totalPrice = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        if (this.totalPriceElement) this.totalPriceElement.textContent = totalPrice.toFixed(2);
        if (this.modalTotalPriceElement) this.modalTotalPriceElement.textContent = totalPrice.toFixed(2);
        
        // Update cart modal if open
        if (this.cartModal && this.cartModal.classList.contains('active')) {
            this.renderCartItems();
        }
    }

    renderCartItems() {
        if (!this.cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                </div>
            `;
            return;
        }
        
        this.cartItemsContainer.innerHTML = '';
        
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                     onerror="this.src='https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop'">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)} each</p>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            
            this.cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to cart controls
        this.addCartEventListeners();
    }

    addCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                const item = this.cart.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                this.removeFromCart(productId);
            });
        });
    }

    openCartModal() {
        this.renderCartItems();
        if (this.cartModal) {
            this.cartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCartModal() {
        if (this.cartModal) {
            this.cartModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // CHECKOUT FUNCTION - REDIRECTS TO PAYMENT.HTML
// Shopping Cart System for payment page
class PaymentCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.loadCartData();
        this.updatePaymentSummary();
    }

    cacheDOM() {
        this.cartItemsContainer = document.getElementById('cart-items');
        this.subtotalElement = document.getElementById('subtotal');
        this.shippingElement = document.getElementById('shipping');
        this.taxElement = document.getElementById('tax');
        this.totalElement = document.getElementById('total');
        this.paymentForm = document.getElementById('payment-form');
        this.payNowBtn = document.getElementById('pay-now-btn');
    }

    bindEvents() {
        if (this.paymentForm) {
            this.paymentForm.addEventListener('submit', (e) => this.processPayment(e));
        }
        
        if (this.payNowBtn) {
            this.payNowBtn.addEventListener('click', (e) => this.processPayment(e));
        }
    }

    loadCartData() {
        if (this.cart.length === 0) {
            // If no cart data, redirect back to main page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        this.renderCartItems();
    }

    renderCartItems() {
        if (!this.cartItemsContainer) return;

        this.cartItemsContainer.innerHTML = '';
        
        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item-payment';
            cartItem.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">x${item.quantity}</span>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            this.cartItemsContainer.appendChild(cartItem);
        });
    }

    updatePaymentSummary() {
        if (this.cart.length === 0) return;

        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        if (this.subtotalElement) this.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (this.shippingElement) this.shippingElement.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        if (this.taxElement) this.taxElement.textContent = `$${tax.toFixed(2)}`;
        if (this.totalElement) this.totalElement.textContent = `$${total.toFixed(2)}`;
    }

    processPayment(e) {
        e.preventDefault();
        
        // Get form data
        const cardNumber = document.getElementById('card-number')?.value;
        const expiryDate = document.getElementById('expiry-date')?.value;
        const cvv = document.getElementById('cvv')?.value;
        const cardholderName = document.getElementById('cardholder-name')?.value;
        
        // Simple validation
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            this.showPaymentMessage('Please fill in all payment details', 'error');
            return;
        }

        if (cardNumber.replace(/\s/g, '').length !== 16) {
            this.showPaymentMessage('Please enter a valid 16-digit card number', 'error');
            return;
        }

        // Show processing animation
        const originalText = this.payNowBtn.innerHTML;
        this.payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        this.payNowBtn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            // In a real application, you would send this to your payment gateway
            console.log('Payment details:', { 
                cardNumber: cardNumber.replace(/\s/g, '').slice(-4), 
                expiryDate, 
                cvv: '***', 
                cardholderName,
                amount: this.totalElement?.textContent 
            });

            // Show success message
            this.showPaymentMessage('Payment successful! Thank you for your order.', 'success');
            
            // Clear cart after successful payment
            localStorage.removeItem('cart');
            localStorage.removeItem('cartTotal');
            localStorage.removeItem('cartCount');
            
            // Reset button
            this.payNowBtn.innerHTML = originalText;
            this.payNowBtn.disabled = false;

            // Redirect to confirmation page after 3 seconds
            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 3000);
            
        }, 2000);
    }

    showPaymentMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.payment-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `payment-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        messageDiv.style.cssText = `
            padding: 15px 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            animation: fadeIn 0.3s ease;
            background: ${type === 'success' ? '#10b98120' : '#ef444420'};
            color: ${type === 'success' ? '#10b981' : '#ef4444'};
            border: 1px solid ${type === 'success' ? '#10b98140' : '#ef444440'};
        `;

        // Insert after the form
        if (this.paymentForm) {
            this.paymentForm.parentNode.insertBefore(messageDiv, this.paymentForm.nextSibling);
        } else {
            document.querySelector('.payment-container')?.appendChild(messageDiv);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize on payment page
if (window.location.pathname.includes('payment.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const paymentCart = new PaymentCart();
    });
}

    showNotification(message, type = 'success') {
        if (this.notification && this.notificationText) {
            this.notificationText.textContent = message;
            this.notification.className = `notification show ${type}`;
            
            setTimeout(() => {
                this.notification.classList.remove('show');
            }, 3000);
        }
    }

    showLoader() {
        if (this.loader) this.loader.classList.add('active');
    }

    hideLoader() {
        if (this.loader) this.loader.classList.remove('active');
    }
}

// Initialize the shopping cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();
    
    // Expose cart instance for debugging
    window.cart = cart;
    
    // Handle image errors
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const productName = this.alt || 'Product';
            // Create a colored placeholder
            const colors = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            const colorIndex = productName.length % colors.length;
            this.style.backgroundColor = colors[colorIndex];
            this.style.padding = '20px';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.color = 'white';
            this.style.fontWeight = 'bold';
            this.innerHTML = productName.split(' ')[0];
        });
    });
});