/* =============================================
   NOTIFICATIONS.JS — لوحة الإشعارات
   ============================================= */

const Notif = {
    panelId: 'notifPanel',
    isOpen: false,

    timeAgo(isoStr) {
        const diff = Date.now() - new Date(isoStr).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1)  return 'الآن';
        if (m < 60) return `منذ ${m} دقيقة`;
        const h = Math.floor(m / 60);
        if (h < 24) return `منذ ${h} ساعة`;
        return `منذ ${Math.floor(h / 24)} يوم`;
    },

    icon(type) {
        const map = {
            success: `<svg viewBox="0 0 24 24" style="width:15px;height:15px;color:var(--success)"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19L21 7l-1.4-1.4z"/></svg>`,
            danger:  `<svg viewBox="0 0 24 24" style="width:15px;height:15px;color:var(--danger)"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>`,
            info:    `<svg viewBox="0 0 24 24" style="width:15px;height:15px;color:var(--primary)"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>`,
            warning: `<svg viewBox="0 0 24 24" style="width:15px;height:15px;color:var(--warning)"><path fill="currentColor" d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z"/></svg>`,
        };
        return map[type] || map.info;
    },

    buildPanel() {
        const panel = document.getElementById(this.panelId);
        if (!panel) return;
        const list   = DB.getNotifications();
        const unread = list.filter(n => !n.read).length;

        panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border-light);">
                <h4 style="font-size:14px;font-weight:700;">
                    الإشعارات
                    ${unread > 0 ? `<span style="background:var(--danger);color:#fff;font-size:10px;padding:1px 7px;border-radius:50px;margin-right:5px;">${unread}</span>` : ''}
                </h4>
                <button id="_notifMarkAll" style="font-size:11px;color:var(--primary);background:none;border:none;cursor:pointer;font-family:var(--font);">تعليم الكل كمقروء</button>
            </div>
            <div style="max-height:340px;overflow-y:auto;">
                ${list.length === 0
                    ? `<div style="padding:28px;text-align:center;color:var(--text-muted);font-size:13px;">لا توجد إشعارات</div>`
                    : list.map(n => `
                        <div data-nid="${n.id}" style="display:flex;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border-light);cursor:pointer;background:${n.read ? 'transparent' : 'var(--primary-light)'};">
                            <div style="width:30px;height:30px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${this.icon(n.type)}</div>
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:13px;font-weight:600;color:var(--text-primary);line-height:1.3;">${n.title}</div>
                                ${n.body ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${n.body}</div>` : ''}
                                <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">${this.timeAgo(n.time)}</div>
                            </div>
                            ${!n.read ? `<div style="width:8px;height:8px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:6px;"></div>` : ''}
                        </div>`).join('')
                }
            </div>
            <div style="padding:10px 16px;border-top:1px solid var(--border-light);display:flex;justify-content:center;">
                <button id="_notifClearAll" style="font-size:12px;color:var(--danger);background:none;border:none;cursor:pointer;font-family:var(--font);">حذف جميع الإشعارات</button>
            </div>`;

        document.getElementById('_notifMarkAll')?.addEventListener('click', e => {
            e.stopPropagation();
            DB.markAllRead();
            this.buildPanel();
            this.updateBadge();
        });

        document.getElementById('_notifClearAll')?.addEventListener('click', e => {
            e.stopPropagation();
            DB.saveNotifications([]);
            this.buildPanel();
            this.updateBadge();
        });

        panel.querySelectorAll('[data-nid]').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.nid;
                DB.saveNotifications(DB.getNotifications().map(n => n.id === id ? { ...n, read: true } : n));
                this.buildPanel();
                this.updateBadge();
            });
        });
    },

    updateBadge() {
        const count = DB.unreadCount();
        document.querySelectorAll('.js-notif-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
        // مواعيد اليوم الفعلي
        const today = new Date().toISOString().slice(0, 10);
        const n = DB.getAppointments().filter(a => a.date === today && a.status !== 'cancelled').length;
        document.querySelectorAll('.js-apt-count').forEach(el => {
            el.textContent = n;
            el.style.display = n > 0 ? 'inline-flex' : 'none';
        });
    },

    init() {
        const btn   = document.getElementById('notifBtn');
        const panel = document.getElementById(this.panelId);
        if (!btn || !panel) return;

        btn.addEventListener('click', e => {
            e.stopPropagation();
            this.isOpen = !this.isOpen;
            if (this.isOpen) { this.buildPanel(); panel.classList.add('open'); }
            else             { panel.classList.remove('open'); }
        });

        document.addEventListener('click', e => {
            if (this.isOpen && !panel.contains(e.target) && e.target !== btn) {
                panel.classList.remove('open');
                this.isOpen = false;
            }
        });

        this.updateBadge();
    },
};
