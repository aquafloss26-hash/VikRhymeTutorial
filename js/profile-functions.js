// Profile Functions
document.addEventListener('DOMContentLoaded', function() {
    // Load profile data from localStorage
    let profile = JSON.parse(localStorage.getItem('profile')) || {
        firstName: 'Guest',
        lastName: 'User',
        email: 'guest@example.com',
        phone: '',
        address: '',
        city: '',
        zipcode: '',
        country: '',
        avatarUrl: 'https://via.placeholder.com/150',
        memberSince: new Date().getFullYear().toString()
    };
    
    // Load stats from localStorage
    let stats = JSON.parse(localStorage.getItem('profileStats')) || {
        totalOrders: 0,
        totalSpent: 0,
        memberSince: new Date().getFullYear().toString()
    };
    
    // Load orders to calculate stats
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length > 0) {
        stats.totalOrders = orders.length;
        stats.totalSpent = orders.reduce((total, order) => total + order.total, 0);
    }
    
    // Display profile data
    displayProfile(profile, stats);
    
    // Form submission
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', function() {
        displayProfile(profile, stats);
    });
    
    function displayProfile(profileData, statsData) {
        // Update form fields
        document.getElementById('first-name').value = profileData.firstName || '';
        document.getElementById('last-name').value = profileData.lastName || '';
        document.getElementById('email').value = profileData.email || '';
        document.getElementById('phone').value = profileData.phone || '';
        document.getElementById('address').value = profileData.address || '';
        document.getElementById('city').value = profileData.city || '';
        document.getElementById('zipcode').value = profileData.zipcode || '';
        document.getElementById('country').value = profileData.country || '';
        document.getElementById('avatar-url').value = profileData.avatarUrl || '';
        
        // Update displayed info
        document.getElementById('profile-name').textContent = 
            `${profileData.firstName || 'Guest'} ${profileData.lastName || 'User'}`;
        document.getElementById('profile-email').textContent = profileData.email || 'guest@example.com';
        document.getElementById('profile-avatar').src = profileData.avatarUrl || 'https://via.placeholder.com/150';
        
        // Update stats
        document.getElementById('total-orders').textContent = statsData.totalOrders || 0;
        document.getElementById('total-spent').textContent = `$${(statsData.totalSpent || 0).toFixed(2)}`;
        document.getElementById('member-since').textContent = statsData.memberSince || new Date().getFullYear().toString();
    }
    
    function saveProfile() {
        const updatedProfile = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipcode: document.getElementById('zipcode').value,
            country: document.getElementById('country').value,
            avatarUrl: document.getElementById('avatar-url').value || 'https://via.placeholder.com/150',
            memberSince: profile.memberSince || new Date().getFullYear().toString()
        };
        
        // Save to localStorage
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        profile = updatedProfile;
        
        // Update display
        displayProfile(profile, stats);
        
        // Show success message
        alert('Profile updated successfully!');
    }
    
    // Auto-save on input change
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form select, #profile-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Enable auto-save if desired
            // saveProfile();
        });
    });
});