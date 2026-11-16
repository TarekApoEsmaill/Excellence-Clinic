/* =============================================
   MAIN.JS — عيادة التميز
   وظائف مشتركة بين جميع الصفحات
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════════
    // 1. SIDEBAR MOBILE TOGGLE
    // ══════════════════════════════════════════
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const burger  = document.getElementById('burgerBtn');

    function openSidebar()  { sidebar?.classList.add('open'); overlay?.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('show'); document.body.style.overflow = ''; }

    burger?.addEventListener('click', () => sidebar?.classList.contains('open') ? closeSidebar() : openSidebar());
    overlay?.addEventListener('click', closeSidebar);
    sidebar?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { if (window.innerWidth <= 768) closeSidebar(); }));

    // ══════════════════════════════════════════
    // 2. LOAD SETTINGS INTO UI
    // ══════════════════════════════════════════
    function applySettings() {
        const s = DB.getSettings();
        document.querySelectorAll('.js-clinic-name').forEach(el => { if (s.clinicName) el.textContent = s.clinicName; });
        document.querySelectorAll('.js-doctor-name').forEach(el => { if (s.doctorName)  el.textContent = s.doctorName;  });
    }
    applySettings();

    // ══════════════════════════════════════════
    // 3. NOTIFICATIONS
    // ══════════════════════════════════════════
    Notif.init();

    // ══════════════════════════════════════════
    // 4. LOGOUT — works for ANY element with class "logout" or id "logoutBtn"
    // ══════════════════════════════════════════
    function handleLogout(e) {
        e.preventDefault();
        if (confirm('هل تريد تسجيل الخروج؟')) {
            showToast('جارٍ تسجيل الخروج…', 'info');
            setTimeout(() => { window.location.href = 'index.html'; }, 900);
        }
    }
    document.querySelectorAll('.logout, #logoutBtn').forEach(el => el.addEventListener('click', handleLogout));

    // ══════════════════════════════════════════
    // 5. SIDEBAR "موعد جديد" BUTTON
    //    — if on appointments page → open modal
    //    — otherwise → navigate to appointments.html
    // ══════════════════════════════════════════
    document.querySelectorAll('.sidebar-new-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const isAptPage = window.location.pathname.endsWith('appointments.html');
            if (isAptPage) {
                e.preventDefault();
                // trigger the add button on that page
                document.getElementById('addAptBtn')?.click();
            }
            // else: let the href do its job (href="appointments.html")
        });
    });

    // ══════════════════════════════════════════
    // 6. FLOAT SEARCH BUTTON
    // ══════════════════════════════════════════
    document.getElementById('floatSearch')?.addEventListener('click', () => {
        const inp = document.querySelector('#tableSearch, .search-box input');
        if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });

    // ══════════════════════════════════════════
    // 7. ESC — close modals + notif panel
    // ══════════════════════════════════════════
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        document.querySelectorAll('.modal-backdrop.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
        const np = document.getElementById('notifPanel');
        if (np) { np.classList.remove('open'); Notif.isOpen = false; }
    });

    // ══════════════════════════════════════════
    // 8. GLOBAL SEARCH BAR
    // ══════════════════════════════════════════
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        // live-mirror into table search if it exists on the same page
        globalSearch.addEventListener('input', e => {
            const ts = document.getElementById('tableSearch');
            if (ts) { ts.value = e.target.value; ts.dispatchEvent(new Event('input')); }
        });
        // Enter → redirect with ?q= if not already on a search page
        globalSearch.addEventListener('keydown', e => {
            if (e.key !== 'Enter' || !globalSearch.value.trim()) return;
            const page = window.location.pathname.split('/').pop();
            if (!['patients.html', 'appointments.html'].includes(page)) {
                window.location.href = `patients.html?q=${encodeURIComponent(globalSearch.value.trim())}`;
            }
        });
    }

    // Auto-fill from URL param ?q=
    const urlQ = new URLSearchParams(window.location.search).get('q');
    if (urlQ) {
        const ts = document.getElementById('tableSearch');
        const gs = document.getElementById('globalSearch');
        if (ts) { ts.value = urlQ; ts.dispatchEvent(new Event('input')); }
        if (gs) gs.value = urlQ;
    }

    // ══════════════════════════════════════════
    // 9. SETTINGS ICON BUTTONS — navigate to settings
    // ══════════════════════════════════════════
    document.querySelectorAll('.settings-icon-btn').forEach(btn => {
        btn.addEventListener('click', () => { window.location.href = 'settings.html'; });
    });

});

// ══════════════════════════════════════════════
// GLOBAL HELPERS
// ══════════════════════════════════════════════

function showToast(message, type = 'success') {
    document.querySelectorAll('.kiro-toast').forEach(t => t.remove());
    const colorMap = {
        success: { bg: 'var(--success)',  icon: '✓' },
        error:   { bg: 'var(--danger)',   icon: '✕' },
        info:    { bg: 'var(--primary)',  icon: 'ℹ' },
        warning: { bg: 'var(--warning)',  icon: '⚠' },
    };
    const c = colorMap[type] || colorMap.success;
    const toast = document.createElement('div');
    toast.className = 'kiro-toast';
    toast.innerHTML = `<span>${c.icon}</span>${message}`;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '84px', left: '24px',
        background: c.bg, color: '#fff',
        padding: '10px 18px', borderRadius: 'var(--radius-md)',
        fontSize: '13px', fontWeight: '600', fontFamily: 'var(--font)',
        boxShadow: '0 4px 20px rgba(0,0,0,.18)', zIndex: '9999',
        display: 'flex', alignItems: 'center', gap: '8px',
        direction: 'rtl', animation: 'fadeIn .2s ease both', maxWidth: '340px',
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity .3s, transform .3s';
        toast.style.opacity = '0'; toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 320);
    }, 3000);
}

function refreshNotifBadge() {
    if (typeof Notif !== 'undefined') Notif.updateBadge();
}
