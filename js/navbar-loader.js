(async function () {
    // 1. Inject CSS
    if (!document.querySelector('link[href="css/admin-nav.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/admin-nav.css';
        document.head.appendChild(link);
    }

    // 2. Fetch and Inject HTML
    const container = document.getElementById('navbar-container');
    if (!container) {
        console.error('Navbar container not found! Please add <div id="navbar-container"></div> to the body.');
        return;
    }

    try {
        const response = await fetch('adminbase.html');
        if (!response.ok) throw new Error('Failed to load navbar');
        const html = await response.text();
        container.innerHTML = html;

        // 3. Highlight Active Link
        highlightActiveLink();

    } catch (error) {
        console.error('Error loading navbar:', error);
        container.innerHTML = '<p style="color:red; padding:20px;">Error loading navigation.</p>';
    }

    function highlightActiveLink() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');

        // Reset all active classes
        document.querySelectorAll('.nav-btn.section').forEach(btn => btn.classList.remove('active'));

        if (page === 'billing.html' || page === 'print_bill.html') {
            document.getElementById('billing-link')?.classList.add('active');
        } else if (page === 'order.html') {
            document.getElementById('order-link')?.classList.add('active');
        } else if (page === 'history.html') {
            document.getElementById('history-link')?.classList.add('active');
        } else if (page === 'admin.html' || page === '') {
            // Default to admin/dashboard
            if (section === 'menu') {
                document.getElementById('menu-link')?.classList.add('active');
            } else {
                document.getElementById('dashboard-link')?.classList.add('active');
            }
        }
    }
})();
