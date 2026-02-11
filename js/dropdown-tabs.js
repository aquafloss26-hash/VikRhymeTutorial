// dropdown-tabs.js - Custom functionality for dropdown tabs and product links

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown tabs functionality
    initDropdownTabs();
    
    // Initialize clickable product titles
    initProductTitleLinks();
    
    // Initialize mobile dropdown toggle
    initMobileDropdown();
});

// Function to initialize dropdown tabs
function initDropdownTabs() {
    // Handle dropdown tab clicks
    $('.nav-tabs .dropdown-menu a').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        
        // Close mobile dropdown if open
        $(this).closest('.dropdown-menu').parent().removeClass('open');
        
        // Show the main tab first
        var mainTab = $(this).closest('.dropdown-menu').parent().find('> a');
        mainTab.tab('show');
        
        // Then show the sub-tab after a slight delay
        setTimeout(function() {
            $(target).tab('show');
        }, 100);
    });
    
    // Handle sub-tab navigation
    $('.tab-submenu a').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $(target).tab('show');
        
        // Update active state
        $(this).closest('.nav-pills').find('li').removeClass('active');
        $(this).closest('li').addClass('active');
    });
    
    // When main tab changes, reset sub-tabs to first menu
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var targetPane = $(e.target).attr('href');
        
        // Reset sub-tabs in the active pane
        $(targetPane + ' .tab-submenu .nav-pills li').removeClass('active');
        $(targetPane + ' .tab-submenu .nav-pills li:first-child').addClass('active');
        
        // Show first sub-tab content
        $(targetPane + ' .tab-content-inner .tab-pane').removeClass('active');
        $(targetPane + ' .tab-content-inner .tab-pane:first-child').addClass('active');
    });
}

// Function to initialize clickable product titles
function initProductTitleLinks() {
    // Add event listeners for popular product title links
    document.querySelectorAll('.product-title-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product data from data attributes
            const product = {
                id: parseInt(this.dataset.id),
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image,
                description: this.dataset.description,
                quantity: 1
            };
            
            // Get existing cart or create new one
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showNotification(`${product.name} added to cart!`);
            
            // Redirect to cart page after a short delay
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 1000);
        });
    });
}

// Function to initialize mobile dropdown toggle
function initMobileDropdown() {
    // Toggle dropdown on mobile
    $('.nav-tabs > li > a').on('click', function(e) {
        if ($(window).width() <= 768) {
            var $parent = $(this).parent();
            var hasDropdown = $parent.find('.dropdown-menu').length > 0;
            
            if (hasDropdown) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                $('.nav-tabs > li').not($parent).removeClass('open');
                
                // Toggle this dropdown
                $parent.toggleClass('open');
            }
        }
    });
    
    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav-tabs > li').length) {
            $('.nav-tabs > li').removeClass('open');
        }
    });
}

// Function to show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.querySelector('.cart-link');
    
    if (cartBadge) {
        if (cartCount > 0) {
            cartBadge.innerHTML = `ADD TO CART <span class="badge" style="background: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px;">${cartCount}</span>`;
        } else {
            cartBadge.innerHTML = 'ADD TO CART';
        }
    }
}
// Function to initialize navigation dropdowns
function initNavigationDropdowns() {
    // Handle filter links in PRODUCTS dropdown
    $('.filter-link').on('click', function(e) {
        e.preventDefault();
        const filter = $(this).data('filter');
        
        // Close dropdown
        $(this).closest('.dropdown').removeClass('open');
        
        // Navigate to portfolio section
        $('html, body').animate({
            scrollTop: $('#portfolio').offset().top - 70
        }, 500);
        
        // Apply filter after a delay
        setTimeout(() => {
            if (filter) {
                // Trigger filter click
                $(`[data-filter="${filter}"]`).click();
            }
        }, 600);
    });
    
    // Handle product title links in POPULAR dropdown
    $('.navbar-nav .product-title-link').on('click', function(e) {
        e.preventDefault();
        
        // Get product data from data attributes
        const product = {
            id: parseInt(this.dataset.id),
            name: this.dataset.name,
            price: parseFloat(this.dataset.price),
            image: this.dataset.image,
            description: this.dataset.description,
            quantity: 1
        };
        
        // Get existing cart or create new one
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product is already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
        
        // Close dropdown
        $(this).closest('.dropdown').removeClass('open');
        
        // Redirect to cart page after a short delay
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    });
    
    // Handle submenu hover on desktop
    if ($(window).width() > 768) {
        $('.dropdown-submenu-toggle').hover(function() {
            $(this).next('.dropdown-submenu').show();
        }, function() {
            $(this).next('.dropdown-submenu').hide();
        });
    }
    
    // Handle submenu click on mobile
    if ($(window).width() <= 768) {
        $('.dropdown-submenu-toggle').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).next('.dropdown-submenu').toggle();
        });
    }
}

// Update the init function to include navigation dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown tabs functionality
    initDropdownTabs();
    
    // Initialize clickable product titles
    initProductTitleLinks();
    
    // Initialize mobile dropdown toggle
    initMobileDropdown();
    
    // Initialize navigation dropdowns
    initNavigationDropdowns();
});