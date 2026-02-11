document.addEventListener('DOMContentLoaded', () => {

    // Load profile
    fetch('api/profile.php')
        .then(res => res.json())
        .then(user => {
            if (user.error) {
                window.location.href = 'login.html';
                return;
            }

            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('mobile').value = user.mobile || '';
            document.getElementById('address').value = user.address || '';
        });

    // Update profile
    document.getElementById('profileForm').addEventListener('submit', e => {
        e.preventDefault();

        fetch('api/update-profile.php', {
            method: 'POST',
            body: JSON.stringify({
                name: name.value,
                mobile: mobile.value,
                address: address.value
            })
        })
        .then(res => res.text())
        .then(res => {
            const msg = document.getElementById('profileMessage');
            msg.textContent = res === 'success'
                ? 'Profile updated successfully'
                : 'Update failed';
            msg.style.color = res === 'success' ? 'green' : 'red';
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        fetch('api/logout.php').then(() => {
            window.location.href = 'index.html';
        });
    });

});
