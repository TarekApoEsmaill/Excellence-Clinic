/* =============================================
   DATA.JS — مخزن البيانات المركزي
   يستخدم localStorage للحفاظ على البيانات بين الصفحات
   ============================================= */

const DB = {

    // ─── Keys ─────────────────────────────────
    KEYS: {
        PATIENTS:      'clinic_patients',
        APPOINTMENTS:  'clinic_appointments',
        NOTIFICATIONS: 'clinic_notifications',
        SETTINGS:      'clinic_settings',
    },

    // ─── Helpers ──────────────────────────────
    _get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    },
    _set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    _getObj(key, defaults = {}) {
        try { return JSON.parse(localStorage.getItem(key)) || defaults; }
        catch { return defaults; }
    },

    // ─── Seed default data if empty ───────────
    seed() {
        if (this._get(this.KEYS.PATIENTS).length === 0) {
            this._set(this.KEYS.PATIENTS, [
                { id: 'PT-0021', firstName: 'نورة',       lastName: 'السالم',    age: 34, phone: '0501234561', email: 'noura@mail.com',   specialty: 'طب أطفال',       doctor: 'د. ريم العبي',       lastVisit: '2026-11-14', status: 'active',   notes: '' },
                { id: 'PT-0022', firstName: 'فهد',        lastName: 'الحربي',    age: 52, phone: '0501234562', email: 'fahad@mail.com',   specialty: 'القلب والأوعية', doctor: 'د. عمر فاروق',       lastVisit: '2026-11-13', status: 'active',   notes: '' },
                { id: 'PT-0023', firstName: 'ليلى',       lastName: 'العتيبي',   age: 29, phone: '0501234563', email: 'layla@mail.com',   specialty: 'الجراحة العامة', doctor: 'د. ياسر المنصور',    lastVisit: '2026-11-05', status: 'inactive', notes: '' },
                { id: 'PT-0024', firstName: 'محمد',       lastName: 'الشمري',    age: 41, phone: '0501234564', email: 'mohamed@mail.com', specialty: 'طب الأسرة',      doctor: 'د. سارة جلال',       lastVisit: '2026-11-16', status: 'pending',  notes: '' },
                { id: 'PT-0025', firstName: 'هدى',        lastName: 'القحطاني',  age: 38, phone: '0501234565', email: 'huda@mail.com',    specialty: 'طب العيون',      doctor: 'د. خالد الرويلي',    lastVisit: '2026-11-15', status: 'active',   notes: '' },
                { id: 'PT-0026', firstName: 'عبدالرحمن', lastName: 'الغامدي',   age: 8,  phone: '0501234566', email: '',                 specialty: 'طب أطفال',       doctor: 'د. ريم العبي',       lastVisit: '2026-11-16', status: 'active',   notes: '' },
            ]);
        }

        if (this._get(this.KEYS.APPOINTMENTS).length === 0) {
            // نحسب التواريخ الديناميكية بناءً على اليوم الحالي
            function daysAgo(n) {
                const d = new Date(); d.setDate(d.getDate() - n);
                return d.toISOString().slice(0,10);
            }
            this._set(this.KEYS.APPOINTMENTS, [
                // اليوم
                { id: 'APT-001', patientId: 'PT-0021', patientName: 'نورة السالم',        doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(0), time: '08:00', duration: 30, type: 'كشف',    status: 'confirmed', notes: '' },
                { id: 'APT-002', patientId: 'PT-0022', patientName: 'فهد الحربي',         doctor: 'د. عمر فاروق',    specialty: 'القلب والأوعية', date: daysAgo(0), time: '09:30', duration: 45, type: 'متابعة', status: 'confirmed', notes: '' },
                { id: 'APT-003', patientId: 'PT-0024', patientName: 'محمد الشمري',        doctor: 'د. سارة جلال',    specialty: 'طب الأسرة',      date: daysAgo(0), time: '10:30', duration: 20, type: 'كشف',    status: 'pending',   notes: '' },
                { id: 'APT-004', patientId: 'PT-0025', patientName: 'هدى القحطاني',       doctor: 'د. خالد الرويلي', specialty: 'طب العيون',      date: daysAgo(0), time: '11:00', duration: 30, type: 'متابعة', status: 'confirmed', notes: '' },
                { id: 'APT-005', patientId: 'PT-0023', patientName: 'ليلى العتيبي',       doctor: 'د. ياسر المنصور', specialty: 'الجراحة العامة', date: daysAgo(0), time: '13:00', duration: 60, type: 'إجراء',  status: 'cancelled', notes: '' },
                { id: 'APT-006', patientId: 'PT-0026', patientName: 'عبدالرحمن الغامدي',  doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(0), time: '14:00', duration: 30, type: 'كشف',    status: 'confirmed', notes: '' },
                // أمس
                { id: 'APT-007', patientId: 'PT-0021', patientName: 'نورة السالم',        doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(1), time: '10:00', duration: 30, type: 'متابعة', status: 'confirmed', notes: '' },
                { id: 'APT-008', patientId: 'PT-0024', patientName: 'محمد الشمري',        doctor: 'د. سارة جلال',    specialty: 'طب الأسرة',      date: daysAgo(1), time: '14:00', duration: 25, type: 'استشارة',status: 'confirmed', notes: '' },
                { id: 'APT-009', patientId: 'PT-0022', patientName: 'فهد الحربي',         doctor: 'د. عمر فاروق',    specialty: 'القلب والأوعية', date: daysAgo(1), time: '11:00', duration: 40, type: 'متابعة', status: 'completed', notes: '' },
                // قبل يومين
                { id: 'APT-010', patientId: 'PT-0025', patientName: 'هدى القحطاني',       doctor: 'د. خالد الرويلي', specialty: 'طب العيون',      date: daysAgo(2), time: '09:00', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-011', patientId: 'PT-0026', patientName: 'عبدالرحمن الغامدي',  doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(2), time: '10:30', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-012', patientId: 'PT-0023', patientName: 'ليلى العتيبي',       doctor: 'د. ياسر المنصور', specialty: 'الجراحة العامة', date: daysAgo(2), time: '12:00', duration: 60, type: 'إجراء',  status: 'completed', notes: '' },
                { id: 'APT-013', patientId: 'PT-0024', patientName: 'محمد الشمري',        doctor: 'د. سارة جلال',    specialty: 'طب الأسرة',      date: daysAgo(2), time: '15:00', duration: 20, type: 'متابعة', status: 'completed', notes: '' },
                // قبل 3 أيام
                { id: 'APT-014', patientId: 'PT-0021', patientName: 'نورة السالم',        doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(3), time: '08:30', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-015', patientId: 'PT-0022', patientName: 'فهد الحربي',         doctor: 'د. عمر فاروق',    specialty: 'القلب والأوعية', date: daysAgo(3), time: '10:00', duration: 45, type: 'متابعة', status: 'completed', notes: '' },
                // قبل 4 أيام
                { id: 'APT-016', patientId: 'PT-0025', patientName: 'هدى القحطاني',       doctor: 'د. خالد الرويلي', specialty: 'طب العيون',      date: daysAgo(4), time: '09:00', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-017', patientId: 'PT-0026', patientName: 'عبدالرحمن الغامدي',  doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(4), time: '11:00', duration: 30, type: 'متابعة', status: 'completed', notes: '' },
                { id: 'APT-018', patientId: 'PT-0023', patientName: 'ليلى العتيبي',       doctor: 'د. ياسر المنصور', specialty: 'الجراحة العامة', date: daysAgo(4), time: '13:00', duration: 60, type: 'إجراء',  status: 'completed', notes: '' },
                // قبل 5 أيام
                { id: 'APT-019', patientId: 'PT-0024', patientName: 'محمد الشمري',        doctor: 'د. سارة جلال',    specialty: 'طب الأسرة',      date: daysAgo(5), time: '10:00', duration: 20, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-020', patientId: 'PT-0021', patientName: 'نورة السالم',        doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(5), time: '14:00', duration: 30, type: 'متابعة', status: 'completed', notes: '' },
                { id: 'APT-021', patientId: 'PT-0022', patientName: 'فهد الحربي',         doctor: 'د. عمر فاروق',    specialty: 'القلب والأوعية', date: daysAgo(5), time: '15:30', duration: 40, type: 'متابعة', status: 'completed', notes: '' },
                // قبل 6 أيام
                { id: 'APT-022', patientId: 'PT-0025', patientName: 'هدى القحطاني',       doctor: 'د. خالد الرويلي', specialty: 'طب العيون',      date: daysAgo(6), time: '09:30', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                { id: 'APT-023', patientId: 'PT-0026', patientName: 'عبدالرحمن الغامدي',  doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(6), time: '11:00', duration: 30, type: 'كشف',    status: 'completed', notes: '' },
                // قادمة
                { id: 'APT-024', patientId: 'PT-0021', patientName: 'نورة السالم',        doctor: 'د. ريم العبي',    specialty: 'طب أطفال',       date: daysAgo(-1),time: '10:00', duration: 30, type: 'متابعة', status: 'confirmed', notes: '' },
                { id: 'APT-025', patientId: 'PT-0024', patientName: 'محمد الشمري',        doctor: 'د. سارة جلال',    specialty: 'طب الأسرة',      date: daysAgo(-2),time: '14:00', duration: 25, type: 'استشارة',status: 'confirmed', notes: '' },
            ]);
        }

        if (this._get(this.KEYS.NOTIFICATIONS).length === 0) {
            this._set(this.KEYS.NOTIFICATIONS, [
                { id: 'N001', title: 'د. سارة جلال انضمت للنظام',       body: 'باقة التميز',           type: 'success', time: '2026-11-16T11:45:00', read: false },
                { id: 'N002', title: 'تنبيه: محاولة دخول فاشلة',        body: 'خادم جدة #4',           type: 'danger',  time: '2026-11-16T11:15:00', read: false },
                { id: 'N003', title: 'د. خالد الرويلي انضم للنظام',     body: 'الباقة الأساسية',       type: 'success', time: '2026-11-16T07:00:00', read: false },
                { id: 'N004', title: 'تحديث نظام الحجز التلقائي',        body: 'الإصدار 4.2.1',         type: 'info',    time: '2026-11-16T10:00:00', read: true  },
                { id: 'N005', title: 'دفعة اشتراك جديدة بمبلغ $2,400', body: 'د. منى الشهري',         type: 'warning', time: '2026-11-16T09:00:00', read: true  },
            ]);
        }

        const defSettings = {
            clinicName: 'عيادة التميز',
            doctorName: 'د. أحمد محمد',
            email: 'admin@clinic.com',
            phone: '0112345678',
            address: 'الرياض، حي النخيل',
            language: 'ar',
            theme: 'light',
            notifSound: true,
            emailNotif: true,
            autoLogout: 30,
        };
        if (!localStorage.getItem(this.KEYS.SETTINGS)) {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(defSettings));
        }
    },

    // ─── PATIENTS CRUD ─────────────────────────
    getPatients()      { return this._get(this.KEYS.PATIENTS); },
    savePatients(list) { this._set(this.KEYS.PATIENTS, list); },

    addPatient(data) {
        const list = this.getPatients();
        const newId = 'PT-' + String(list.length + 100).padStart(4, '0');
        const patient = { id: newId, ...data, lastVisit: new Date().toISOString().slice(0,10), status: 'active' };
        list.unshift(patient);
        this.savePatients(list);
        this.addNotification({
            title: `مريض جديد: ${data.firstName} ${data.lastName}`,
            body: data.specialty,
            type: 'success',
        });
        return patient;
    },

    deletePatient(id) {
        const list = this.getPatients().filter(p => p.id !== id);
        this.savePatients(list);
    },

    updatePatient(id, data) {
        const list = this.getPatients().map(p => p.id === id ? { ...p, ...data } : p);
        this.savePatients(list);
    },

    // ─── APPOINTMENTS CRUD ─────────────────────
    getAppointments()      { return this._get(this.KEYS.APPOINTMENTS); },
    saveAppointments(list) { this._set(this.KEYS.APPOINTMENTS, list); },

    addAppointment(data) {
        const list = this.getAppointments();
        const newId = 'APT-' + String(list.length + 100).padStart(3, '0');
        const apt = { id: newId, ...data, status: 'confirmed' };
        list.unshift(apt);
        this.saveAppointments(list);
        this.addNotification({
            title: `موعد جديد: ${data.patientName}`,
            body: `${data.date} — ${data.time} مع ${data.doctor}`,
            type: 'info',
        });
        return apt;
    },

    deleteAppointment(id) {
        const list = this.getAppointments().filter(a => a.id !== id);
        this.saveAppointments(list);
    },

    updateAppointment(id, data) {
        const list = this.getAppointments().map(a => a.id === id ? { ...a, ...data } : a);
        this.saveAppointments(list);
    },

    // ─── NOTIFICATIONS ─────────────────────────
    getNotifications()      { return this._get(this.KEYS.NOTIFICATIONS); },
    saveNotifications(list) { this._set(this.KEYS.NOTIFICATIONS, list); },

    addNotification(data) {
        const list = this.getNotifications();
        const n = {
            id:    'N' + Date.now(),
            title: data.title,
            body:  data.body  || '',
            type:  data.type  || 'info',
            time:  new Date().toISOString(),
            read:  false,
        };
        list.unshift(n);
        this.saveNotifications(list);
        return n;
    },

    markAllRead() {
        const list = this.getNotifications().map(n => ({ ...n, read: true }));
        this.saveNotifications(list);
    },

    unreadCount() {
        return this.getNotifications().filter(n => !n.read).length;
    },

    // ─── SETTINGS ──────────────────────────────
    getSettings()      { return this._getObj(this.KEYS.SETTINGS, {}); },
    saveSettings(data) { localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(data)); },

    // ─── UTILS ─────────────────────────────────
    formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    },

    statusLabel(s) {
        const map = { active: 'نشط', inactive: 'غير نشط', pending: 'قيد المراجعة', confirmed: 'مؤكد', cancelled: 'ملغى', completed: 'مكتمل' };
        return map[s] || s;
    },

    statusClass(s) {
        const map = { active: 'badge-active', inactive: 'badge-inactive', pending: 'badge-pending', confirmed: 'badge-active', cancelled: 'badge-inactive', completed: 'badge-info' };
        return map[s] || 'badge-info';
    },

    initials(name) {
        return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');
    },

    doctorsList: [
        'د. ريم العبي',
        'د. عمر فاروق',
        'د. ياسر المنصور',
        'د. سارة جلال',
        'د. خالد الرويلي',
    ],

    specialties: [
        'طب أطفال',
        'القلب والأوعية',
        'الجراحة العامة',
        'طب الأسرة',
        'طب العيون',
        'الأمراض الباطنية',
        'العظام',
        'الجلدية',
    ],
};

// Seed on load — إذا كانت بيانات المواعيد القديمة (بتواريخ ثابتة) حذفها وأعد البناء
(function() {
    const apts = DB.getAppointments();
    // إذا كانت كل المواعيد في نوفمبر 2026 (تواريخ ثابتة قديمة) أعد الـ seed
    const hasOldData = apts.length > 0 && apts.every(a => a.date && a.date.startsWith('2026-'));
    if (hasOldData) {
        localStorage.removeItem(DB.KEYS.APPOINTMENTS);
    }
    DB.seed();
})();
