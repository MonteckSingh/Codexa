/**
 * CODEXA INTERACTIVE CALENDAR & MULTI-SCHEDULE SYSTEM
 * Full Multi-Calendar Management (CRUD) + Event Scheduler (CRUD)
 * Storage: LocalStorage with Auto-Persistence & Seed Data
 */

// ==========================================================================
// CONSTANTS & PALETTES
// ==========================================================================
const PRESET_COLORS = [
  '#3b82f6', // Electric Blue
  '#10b981', // Emerald Green
  '#8b5cf6', // Neon Violet
  '#f59e0b', // Amber Flame
  '#f43f5e', // Sunset Rose
  '#06b6d4', // Cyan Glow
  '#ec4899', // Hot Pink
  '#6366f1', // Indigo Deep
  '#14b8a6', // Teal Mint
  '#f97316', // Bright Orange
  '#64748b', // Slate Steel
  '#e11d48'  // Crimson Ruby
];

const PRESET_ICONS = [
  '📅', '📱', '🔍', '💻', '🚀', '⚡', '🎯', '👥',
  '💼', '🎨', '📊', '🛠️', '📣', '🔔', '🏆', '⭐'
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ==========================================================================
// SEED DATA (Used if localStorage is empty)
// ==========================================================================
function getInitialData() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  
  const formatDate = (offsetDays, hourStr = "10:00") => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + offsetDays);
    const yStr = dt.getFullYear();
    const mStr = String(dt.getMonth() + 1).padStart(2, '0');
    const dStr = String(dt.getDate()).padStart(2, '0');
    return { date: `${yStr}-${mStr}-${dStr}`, time: hourStr };
  };

  const seedCalendars = [
    {
      id: 'cal-social',
      name: 'Social Media Sprints',
      color: '#ec4899',
      icon: '📱',
      description: 'Viral Reels, YouTube Shorts, Carousels & DM Campaigns',
      visible: true
    },
    {
      id: 'cal-seo',
      name: 'SEO & Search Ops',
      color: '#06b6d4',
      icon: '🔍',
      description: 'Google Maps, High-Intent Keyword Audits & Authority Links',
      visible: true
    },
    {
      id: 'cal-dev',
      name: 'Custom Dev & Apps',
      color: '#3b82f6',
      icon: '💻',
      description: 'Next.js Platforms, iOS/Android Releases & API Integrations',
      visible: true
    },
    {
      id: 'cal-client',
      name: 'Client Reviews & SOWs',
      color: '#10b981',
      icon: '💼',
      description: 'Discovery Calls, Sprint Deliveries & SOW Signoffs',
      visible: true
    },
    {
      id: 'cal-exec',
      name: 'Milestones & Launches',
      color: '#f59e0b',
      icon: '🚀',
      description: 'Major Product Go-Lives, Strategy Sessions & KPI Check-ins',
      visible: true
    }
  ];

  const seedEvents = [
    {
      id: 'evt-1',
      calendarId: 'cal-social',
      title: 'Q3 Viral Shorts Batch Production',
      startDate: formatDate(0, '09:30').date,
      startTime: '09:30',
      endDate: formatDate(0, '11:00').date,
      endTime: '11:00',
      allDay: false,
      priority: 'High',
      category: 'Content',
      location: 'Studio A / Remote',
      description: 'Record & script 8 high-velocity Reels focusing on organic SaaS growth strategies.',
      attendees: 'Alex (Lead), Maria (Editor)'
    },
    {
      id: 'evt-2',
      calendarId: 'cal-seo',
      title: 'Google Core Algorithm Audit & Backlink Review',
      startDate: formatDate(1, '14:00').date,
      startTime: '14:00',
      endDate: formatDate(1, '15:30').date,
      endTime: '15:30',
      allDay: false,
      priority: 'Urgent',
      category: 'Audit',
      location: 'Google Meet',
      description: 'Audit top 15 target commercial keywords and refresh technical schema markup.',
      attendees: 'Dave (SEO Architect)'
    },
    {
      id: 'evt-3',
      calendarId: 'cal-dev',
      title: 'Next.js 15 App Router Architecture Review',
      startDate: formatDate(2, '11:00').date,
      startTime: '11:00',
      endDate: formatDate(2, '12:30').date,
      endTime: '12:30',
      allDay: false,
      priority: 'Medium',
      category: 'Engineering',
      location: 'Discord Tech Hub',
      description: 'Verify server action latency, edge middleware, and hydration performance benchmarks.',
      attendees: 'Sarah (Frontend), Jordan (DevOps)'
    },
    {
      id: 'evt-4',
      calendarId: 'cal-client',
      title: 'Executive Growth Sprint Presentation',
      startDate: formatDate(3, '16:00').date,
      startTime: '16:00',
      endDate: formatDate(3, '17:00').date,
      endTime: '17:00',
      allDay: false,
      priority: 'High',
      category: 'Meeting',
      location: 'Zoom Room #402',
      description: 'Walkthrough client conversion metrics, 3.4x lead velocity gain, and next sprint SOW.',
      attendees: 'Executive Board, CODEXA Partners'
    },
    {
      id: 'evt-5',
      calendarId: 'cal-exec',
      title: 'CODEXA V3 Portal Global Go-Live',
      startDate: formatDate(5, '08:00').date,
      startTime: '08:00',
      endDate: formatDate(5, '18:00').date,
      endTime: '18:00',
      allDay: true,
      priority: 'Urgent',
      category: 'Milestone',
      location: 'Global Deploy',
      description: 'Switch production DNS and activate live CRM webhook pipelines.',
      attendees: 'All Squads'
    }
  ];

  return { seedCalendars, seedEvents };
}

// ==========================================================================
// APPLICATION STATE
// ==========================================================================
class CalendarApp {
  constructor() {
    this.calendars = [];
    this.events = [];
    this.currentDate = new Date();
    this.miniCalDate = new Date();
    this.activeView = 'month'; // 'month' | 'week' | 'day' | 'agenda' | 'year'
    this.searchQuery = '';
    this.activeTagFilter = null;
    this.deletedEventUndoStack = [];

    // Edit/Modal Tracking
    this.editingCalendarId = null;
    this.editingEventId = null;
    this.selectedDateForNewEvent = null;

    this.init();
  }

  init() {
    this.loadState();
    this.cacheDomElements();
    this.bindEvents();
    this.render();
  }

  // ==========================================================================
  // STORAGE & PERSISTENCE
  // ==========================================================================
  loadState() {
    try {
      const storedCals = localStorage.getItem('codexa_calendars_v1');
      const storedEvts = localStorage.getItem('codexa_events_v1');

      if (storedCals && storedEvts) {
        this.calendars = JSON.parse(storedCals);
        this.events = JSON.parse(storedEvts);
      } else {
        const { seedCalendars, seedEvents } = getInitialData();
        this.calendars = seedCalendars;
        this.events = seedEvents;
        this.saveState();
      }
    } catch (e) {
      console.error('Error loading calendar state from localStorage', e);
      const { seedCalendars, seedEvents } = getInitialData();
      this.calendars = seedCalendars;
      this.events = seedEvents;
    }
  }

  saveState() {
    try {
      localStorage.setItem('codexa_calendars_v1', JSON.stringify(this.calendars));
      localStorage.setItem('codexa_events_v1', JSON.stringify(this.events));
    } catch (e) {
      console.error('Error saving calendar state', e);
    }
  }

  // ==========================================================================
  // DOM ELEMENT CACHING
  // ==========================================================================
  cacheDomElements() {
    this.dom = {
      // Header
      currentPeriodLabel: document.getElementById('currentPeriodLabel'),
      prevBtn: document.getElementById('prevPeriodBtn'),
      nextBtn: document.getElementById('nextPeriodBtn'),
      todayBtn: document.getElementById('todayBtn'),
      viewBtns: document.querySelectorAll('.view-btn'),
      searchInput: document.getElementById('eventSearchInput'),
      newEventBtn: document.getElementById('btnOpenNewEventModal'),
      mobileMenuToggle: document.getElementById('mobileMenuToggle'),
      sidebar: document.getElementById('calSidebar'),
      
      // Sidebar
      miniCalMonthLabel: document.getElementById('miniCalMonthLabel'),
      miniCalPrevBtn: document.getElementById('miniCalPrevBtn'),
      miniCalNextBtn: document.getElementById('miniCalNextBtn'),
      miniCalGrid: document.getElementById('miniCalGrid'),
      calendarsList: document.getElementById('calendarsList'),
      btnAddCalendar: document.getElementById('btnAddCalendar'),
      tagsFilterList: document.getElementById('tagsFilterList'),
      totalEventsCountBadge: document.getElementById('totalEventsCountBadge'),
      btnResetData: document.getElementById('btnResetData'),
      btnExportData: document.getElementById('btnExportData'),
      btnImportData: document.getElementById('btnImportData'),
      fileImportInput: document.getElementById('fileImportInput'),

      // Viewport
      viewContainer: document.getElementById('calViewContainer'),
      filterStatusBar: document.getElementById('filterStatusBar'),
      filterChipsContainer: document.getElementById('filterChipsContainer'),

      // Modals
      calendarModal: document.getElementById('calendarModal'),
      calendarModalTitle: document.getElementById('calendarModalTitle'),
      calendarForm: document.getElementById('calendarForm'),
      calNameInput: document.getElementById('calNameInput'),
      calColorInput: document.getElementById('calColorInput'),
      calIconInput: document.getElementById('calIconInput'),
      calDescInput: document.getElementById('calDescInput'),
      colorSwatchesGrid: document.getElementById('colorSwatchesGrid'),
      iconPickerGrid: document.getElementById('iconPickerGrid'),
      
      eventModal: document.getElementById('eventModal'),
      eventModalTitle: document.getElementById('eventModalTitle'),
      eventForm: document.getElementById('eventForm'),
      evtTitleInput: document.getElementById('evtTitleInput'),
      evtCalSelect: document.getElementById('evtCalSelect'),
      evtStartDateInput: document.getElementById('evtStartDateInput'),
      evtStartTimeInput: document.getElementById('evtStartTimeInput'),
      evtEndDateInput: document.getElementById('evtEndDateInput'),
      evtEndTimeInput: document.getElementById('evtEndTimeInput'),
      evtAllDayCheckbox: document.getElementById('evtAllDayCheckbox'),
      evtPrioritySelect: document.getElementById('evtPrioritySelect'),
      evtCategoryInput: document.getElementById('evtCategoryInput'),
      evtLocationInput: document.getElementById('evtLocationInput'),
      evtDescInput: document.getElementById('evtDescInput'),
      evtAttendeesInput: document.getElementById('evtAttendeesInput'),

      eventDetailsModal: document.getElementById('eventDetailsModal'),
      eventDetailsBody: document.getElementById('eventDetailsBody'),
      btnEditFromDetails: document.getElementById('btnEditFromDetails'),
      btnDeleteFromDetails: document.getElementById('btnDeleteFromDetails'),

      deleteCalModal: document.getElementById('deleteCalModal'),
      deleteCalNameSpan: document.getElementById('deleteCalNameSpan'),
      deleteCalReassignSelect: document.getElementById('deleteCalReassignSelect'),
      btnConfirmDeleteCal: document.getElementById('btnConfirmDeleteCal'),

      toastContainer: document.getElementById('toastContainer')
    };
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  bindEvents() {
    // Navigation
    this.dom.prevBtn?.addEventListener('click', () => this.navigatePeriod(-1));
    this.dom.nextBtn?.addEventListener('click', () => this.navigatePeriod(1));
    this.dom.todayBtn?.addEventListener('click', () => this.goToToday());

    // View Switcher
    this.dom.viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Search
    this.dom.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderViewport();
      this.renderFilterStatus();
    });

    // Mobile menu toggle
    this.dom.mobileMenuToggle?.addEventListener('click', () => {
      this.dom.sidebar?.classList.toggle('open');
    });

    // Mini Calendar Navigation
    this.dom.miniCalPrevBtn?.addEventListener('click', () => {
      this.miniCalDate.setMonth(this.miniCalDate.getMonth() - 1);
      this.renderMiniCalendar();
    });
    this.dom.miniCalNextBtn?.addEventListener('click', () => {
      this.miniCalDate.setMonth(this.miniCalDate.getMonth() + 1);
      this.renderMiniCalendar();
    });

    // Calendar Modal Triggers
    this.dom.btnAddCalendar?.addEventListener('click', () => this.openCalendarModal());
    this.dom.calendarForm?.addEventListener('submit', (e) => this.handleCalendarFormSubmit(e));

    // Event Modal Triggers
    this.dom.newEventBtn?.addEventListener('click', () => this.openEventModal());
    this.dom.eventForm?.addEventListener('submit', (e) => this.handleEventFormSubmit(e));
    this.dom.evtAllDayCheckbox?.addEventListener('change', (e) => {
      const isAllDay = e.target.checked;
      this.dom.evtStartTimeInput.disabled = isAllDay;
      this.dom.evtEndTimeInput.disabled = isAllDay;
    });

    // Modal Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Close modal on click outside dialog
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    });

    // Reset Data
    this.dom.btnResetData?.addEventListener('click', () => {
      if (confirm('Reset all calendars and events back to default CODEXA sample data?')) {
        localStorage.removeItem('codexa_calendars_v1');
        localStorage.removeItem('codexa_events_v1');
        this.loadState();
        this.render();
        this.showToast('Restored default CODEXA calendars & schedules', 'success');
      }
    });

    // Export ICS & JSON
    this.dom.btnExportData?.addEventListener('click', () => this.exportICS());

    // Import JSON
    this.dom.btnImportData?.addEventListener('click', () => this.dom.fileImportInput?.click());
    this.dom.fileImportInput?.addEventListener('change', (e) => this.handleFileImport(e));

    // Global Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
          this.closeAllModals();
        }
        return;
      }

      if (e.key === 'Escape') this.closeAllModals();
      else if (e.key === 't' || e.key === 'T') this.goToToday();
      else if (e.key === 'm' || e.key === 'M') this.switchView('month');
      else if (e.key === 'w' || e.key === 'W') this.switchView('week');
      else if (e.key === 'd' || e.key === 'D') this.switchView('day');
      else if (e.key === 'a' || e.key === 'A') this.switchView('agenda');
      else if (e.key === 'y' || e.key === 'Y') this.switchView('year');
      else if (e.key === 'n' || e.key === 'N' || e.key === 'c' || e.key === 'C') this.openEventModal();
      else if (e.key === '/') {
        e.preventDefault();
        this.dom.searchInput?.focus();
      }
    });

    // Render Color and Icon grids in Calendar Modal
    this.renderColorSwatches();
    this.renderIconPicker();
  }

  // ==========================================================================
  // NAVIGATION & VIEW SWITCHING
  // ==========================================================================
  navigatePeriod(direction) {
    switch (this.activeView) {
      case 'month':
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        break;
      case 'week':
        this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        break;
      case 'day':
        this.currentDate.setDate(this.currentDate.getDate() + direction);
        break;
      case 'agenda':
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        break;
      case 'year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() + direction);
        break;
    }
    this.miniCalDate = new Date(this.currentDate);
    this.render();
  }

  goToToday() {
    this.currentDate = new Date();
    this.miniCalDate = new Date();
    this.render();
    this.showToast('Jumped to Today', 'info');
  }

  switchView(viewName) {
    this.activeView = viewName;
    this.dom.viewBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    this.render();
  }

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
  }

  // ==========================================================================
  // MAIN RENDER ENGINE
  // ==========================================================================
  render() {
    this.renderHeaderLabel();
    this.renderMiniCalendar();
    this.renderSidebarCalendars();
    this.renderTagsFilter();
    this.renderViewport();
    this.renderFilterStatus();
  }

  renderHeaderLabel() {
    const y = this.currentDate.getFullYear();
    const m = MONTH_NAMES[this.currentDate.getMonth()];
    const d = this.currentDate.getDate();

    if (this.activeView === 'month' || this.activeView === 'agenda') {
      this.dom.currentPeriodLabel.textContent = `${m} ${y}`;
    } else if (this.activeView === 'year') {
      this.dom.currentPeriodLabel.textContent = `${y}`;
    } else if (this.activeView === 'day') {
      this.dom.currentPeriodLabel.textContent = `${m} ${d}, ${y}`;
    } else if (this.activeView === 'week') {
      // Find start and end of week (Sunday to Saturday)
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const mStart = MONTH_NAMES[startOfWeek.getMonth()].slice(0, 3);
      const mEnd = MONTH_NAMES[endOfWeek.getMonth()].slice(0, 3);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        this.dom.currentPeriodLabel.textContent = `${mStart} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${y}`;
      } else {
        this.dom.currentPeriodLabel.textContent = `${mStart} ${startOfWeek.getDate()} – ${mEnd} ${endOfWeek.getDate()}, ${y}`;
      }
    }
  }

  // ==========================================================================
  // SIDEBAR: MULTI-CALENDAR MANAGEMENT (CRUD)
  // ==========================================================================
  renderSidebarCalendars() {
    if (!this.dom.calendarsList) return;
    this.dom.calendarsList.innerHTML = '';

    let totalEvents = 0;

    this.calendars.forEach(cal => {
      const eventCount = this.events.filter(e => e.calendarId === cal.id).length;
      totalEvents += eventCount;

      const item = document.createElement('div');
      item.className = 'calendar-item';
      item.style.setProperty('--cal-color', cal.color);

      item.innerHTML = `
        <div class="calendar-info-group" title="${this.escapeHtml(cal.description || cal.name)}">
          <input type="checkbox" class="cal-checkbox" data-id="${cal.id}" ${cal.visible ? 'checked' : ''}>
          <span class="calendar-badge-icon">${cal.icon || '📅'}</span>
          <span class="calendar-label-text" style="color: ${cal.visible ? '#fff' : 'var(--text-muted)'}">${this.escapeHtml(cal.name)}</span>
        </div>
        <div class="calendar-actions-hover">
          <span class="calendar-count-badge">${eventCount}</span>
          <button class="cal-action-btn btn-edit" title="Customize / Edit Calendar" data-id="${cal.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="cal-action-btn btn-del" title="Delete Calendar" data-id="${cal.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `;

      // Checkbox Toggle Visibility
      const checkbox = item.querySelector('.cal-checkbox');
      checkbox.addEventListener('change', (e) => {
        cal.visible = e.target.checked;
        this.saveState();
        this.renderViewport();
        this.renderSidebarCalendars();
      });

      // Edit Button
      const editBtn = item.querySelector('.btn-edit');
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openCalendarModal(cal.id);
      });

      // Delete Button
      const delBtn = item.querySelector('.btn-del');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openDeleteCalendarModal(cal.id);
      });

      this.dom.calendarsList.appendChild(item);
    });

    if (this.dom.totalEventsCountBadge) {
      this.dom.totalEventsCountBadge.textContent = `${totalEvents} Events`;
    }
  }

  // Multi-Calendar Form: Create / Edit
  openCalendarModal(calendarId = null) {
    this.editingCalendarId = calendarId;
    const isEdit = !!calendarId;

    this.dom.calendarModalTitle.textContent = isEdit ? 'Customize Calendar' : 'Create New Calendar';
    
    if (isEdit) {
      const cal = this.calendars.find(c => c.id === calendarId);
      if (!cal) return;
      this.dom.calNameInput.value = cal.name;
      this.dom.calColorInput.value = cal.color;
      this.dom.calIconInput.value = cal.icon || '📅';
      this.dom.calDescInput.value = cal.description || '';
    } else {
      this.dom.calNameInput.value = '';
      this.dom.calColorInput.value = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
      this.dom.calIconInput.value = '📅';
      this.dom.calDescInput.value = '';
    }

    this.updateActiveColorSwatch(this.dom.calColorInput.value);
    this.updateActiveIconOption(this.dom.calIconInput.value);

    this.dom.calendarModal?.classList.add('active');
    setTimeout(() => this.dom.calNameInput.focus(), 100);
  }

  handleCalendarFormSubmit(e) {
    e.preventDefault();
    const name = this.dom.calNameInput.value.trim();
    if (!name) return;

    const color = this.dom.calColorInput.value;
    const icon = this.dom.calIconInput.value || '📅';
    const description = this.dom.calDescInput.value.trim();

    if (this.editingCalendarId) {
      // UPDATE CALENDAR
      const cal = this.calendars.find(c => c.id === this.editingCalendarId);
      if (cal) {
        cal.name = name;
        cal.color = color;
        cal.icon = icon;
        cal.description = description;
        this.showToast(`Updated calendar: "${name}"`, 'success');
      }
    } else {
      // CREATE NEW CALENDAR
      const newCal = {
        id: 'cal-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        name,
        color,
        icon,
        description,
        visible: true
      };
      this.calendars.push(newCal);
      this.showToast(`Created new calendar: "${name}"`, 'success');
    }

    this.saveState();
    this.dom.calendarModal?.classList.remove('active');
    this.render();
  }

  openDeleteCalendarModal(calendarId) {
    if (this.calendars.length <= 1) {
      alert('You must keep at least one calendar.');
      return;
    }

    const cal = this.calendars.find(c => c.id === calendarId);
    if (!cal) return;

    this.deletingCalendarId = calendarId;
    this.dom.deleteCalNameSpan.textContent = cal.name;

    // Populate reassign dropdown
    this.dom.deleteCalReassignSelect.innerHTML = '<option value="">-- Delete all events in this calendar --</option>';
    this.calendars.filter(c => c.id !== calendarId).forEach(other => {
      const opt = document.createElement('option');
      opt.value = other.id;
      opt.textContent = `Reassign events to "${other.name}"`;
      this.dom.deleteCalReassignSelect.appendChild(opt);
    });

    this.dom.btnConfirmDeleteCal.onclick = () => this.handleConfirmDeleteCalendar();
    this.dom.deleteCalModal?.classList.add('active');
  }

  handleConfirmDeleteCalendar() {
    const calId = this.deletingCalendarId;
    const reassignId = this.dom.deleteCalReassignSelect.value;
    const calName = this.dom.deleteCalNameSpan.textContent;

    if (reassignId) {
      this.events.forEach(evt => {
        if (evt.calendarId === calId) evt.calendarId = reassignId;
      });
    } else {
      this.events = this.events.filter(evt => evt.calendarId !== calId);
    }

    this.calendars = this.calendars.filter(c => c.id !== calId);
    this.saveState();
    this.dom.deleteCalModal?.classList.remove('active');
    this.render();
    this.showToast(`Deleted calendar: "${calName}"`, 'warning');
  }

  // Render Swatches in Calendar Modal
  renderColorSwatches() {
    if (!this.dom.colorSwatchesGrid) return;
    this.dom.colorSwatchesGrid.innerHTML = '';
    PRESET_COLORS.forEach(col => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'color-swatch-btn';
      btn.style.backgroundColor = col;
      btn.dataset.color = col;
      btn.addEventListener('click', () => {
        this.dom.calColorInput.value = col;
        this.updateActiveColorSwatch(col);
      });
      this.dom.colorSwatchesGrid.appendChild(btn);
    });
  }

  updateActiveColorSwatch(selectedColor) {
    const swatches = this.dom.colorSwatchesGrid?.querySelectorAll('.color-swatch-btn');
    swatches?.forEach(s => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === selectedColor.toLowerCase());
    });
  }

  renderIconPicker() {
    if (!this.dom.iconPickerGrid) return;
    this.dom.iconPickerGrid.innerHTML = '';
    PRESET_ICONS.forEach(ic => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-option-btn';
      btn.textContent = ic;
      btn.dataset.icon = ic;
      btn.addEventListener('click', () => {
        this.dom.calIconInput.value = ic;
        this.updateActiveIconOption(ic);
      });
      this.dom.iconPickerGrid.appendChild(btn);
    });
  }

  updateActiveIconOption(selectedIcon) {
    const icons = this.dom.iconPickerGrid?.querySelectorAll('.icon-option-btn');
    icons?.forEach(i => {
      i.classList.toggle('active', i.dataset.icon === selectedIcon);
    });
  }

  // Tags filter in sidebar
  renderTagsFilter() {
    if (!this.dom.tagsFilterList) return;
    const categories = new Set();
    this.events.forEach(e => {
      if (e.category) categories.add(e.category);
    });

    this.dom.tagsFilterList.innerHTML = '';
    
    // "All" tag
    const allChip = document.createElement('span');
    allChip.className = `tag-chip ${!this.activeTagFilter ? 'active' : ''}`;
    allChip.textContent = 'All Tags';
    allChip.addEventListener('click', () => {
      this.activeTagFilter = null;
      this.render();
    });
    this.dom.tagsFilterList.appendChild(allChip);

    categories.forEach(cat => {
      const chip = document.createElement('span');
      chip.className = `tag-chip ${this.activeTagFilter === cat ? 'active' : ''}`;
      chip.textContent = `#${cat}`;
      chip.addEventListener('click', () => {
        this.activeTagFilter = this.activeTagFilter === cat ? null : cat;
        this.render();
      });
      this.dom.tagsFilterList.appendChild(chip);
    });
  }

  // ==========================================================================
  // MINI CALENDAR IN SIDEBAR
  // ==========================================================================
  renderMiniCalendar() {
    if (!this.dom.miniCalGrid) return;
    
    const year = this.miniCalDate.getFullYear();
    const month = this.miniCalDate.getMonth();
    
    this.dom.miniCalMonthLabel.textContent = `${MONTH_NAMES[month].slice(0, 3)} ${year}`;
    this.dom.miniCalGrid.innerHTML = '';

    // Weekday headers
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
      const header = document.createElement('div');
      header.className = 'mini-cal-day-header';
      header.textContent = day;
      this.dom.miniCalGrid.appendChild(header);
    });

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const curSelectedStr = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(this.currentDate.getDate()).padStart(2, '0')}`;

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'mini-cal-cell other-month';
      cell.textContent = prevMonthDays - i;
      this.dom.miniCalGrid.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const cell = document.createElement('div');
      cell.className = 'mini-cal-cell';
      cell.textContent = d;

      if (dateStr === todayStr) cell.classList.add('today');
      if (dateStr === curSelectedStr) cell.classList.add('selected');

      const hasEvents = this.events.some(e => e.startDate === dateStr);
      if (hasEvents) cell.classList.add('has-events');

      cell.addEventListener('click', () => {
        this.currentDate = new Date(year, month, d);
        this.render();
      });

      this.dom.miniCalGrid.appendChild(cell);
    }

    // Next month filler
    const totalCells = firstDayIndex + daysInMonth;
    const remaining = 35 - totalCells > 0 ? 35 - totalCells : (42 - totalCells > 0 ? 42 - totalCells : 0);
    for (let n = 1; n <= remaining; n++) {
      const cell = document.createElement('div');
      cell.className = 'mini-cal-cell other-month';
      cell.textContent = n;
      this.dom.miniCalGrid.appendChild(cell);
    }
  }

  // ==========================================================================
  // EVENT CRUD (CREATE, READ, UPDATE, DELETE)
  // ==========================================================================
  getFilteredEvents() {
    const visibleCalIds = new Set(this.calendars.filter(c => c.visible).map(c => c.id));

    return this.events.filter(evt => {
      // 1. Calendar visibility filter
      if (!visibleCalIds.has(evt.calendarId)) return false;

      // 2. Tag / Category filter
      if (this.activeTagFilter && evt.category !== this.activeTagFilter) return false;

      // 3. Search query filter
      if (this.searchQuery) {
        const cal = this.calendars.find(c => c.id === evt.calendarId);
        const matchText = `${evt.title} ${evt.description || ''} ${evt.location || ''} ${evt.category || ''} ${evt.attendees || ''} ${cal ? cal.name : ''}`.toLowerCase();
        if (!matchText.includes(this.searchQuery)) return false;
      }

      return true;
    });
  }

  openEventModal(eventId = null, defaultDateStr = null, defaultTimeStr = null) {
    this.editingEventId = eventId;
    const isEdit = !!eventId;

    this.dom.eventModalTitle.textContent = isEdit ? 'Edit Event / Sprint' : 'Create New Event';

    // Populate Calendar Dropdown
    this.dom.evtCalSelect.innerHTML = '';
    this.calendars.forEach(cal => {
      const opt = document.createElement('option');
      opt.value = cal.id;
      opt.textContent = `${cal.icon || '📅'} ${cal.name}`;
      this.dom.evtCalSelect.appendChild(opt);
    });

    if (isEdit) {
      const evt = this.events.find(e => e.id === eventId);
      if (!evt) return;

      this.dom.evtTitleInput.value = evt.title;
      this.dom.evtCalSelect.value = evt.calendarId;
      this.dom.evtStartDateInput.value = evt.startDate;
      this.dom.evtStartTimeInput.value = evt.startTime || '09:00';
      this.dom.evtEndDateInput.value = evt.endDate || evt.startDate;
      this.dom.evtEndTimeInput.value = evt.endTime || '10:00';
      this.dom.evtAllDayCheckbox.checked = !!evt.allDay;
      this.dom.evtPrioritySelect.value = evt.priority || 'Medium';
      this.dom.evtCategoryInput.value = evt.category || '';
      this.dom.evtLocationInput.value = evt.location || '';
      this.dom.evtDescInput.value = evt.description || '';
      this.dom.evtAttendeesInput.value = evt.attendees || '';
    } else {
      const defaultDate = defaultDateStr || `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(this.currentDate.getDate()).padStart(2, '0')}`;
      const defaultTime = defaultTimeStr || '10:00';

      this.dom.evtTitleInput.value = '';
      if (this.calendars.length > 0) this.dom.evtCalSelect.value = this.calendars[0].id;
      this.dom.evtStartDateInput.value = defaultDate;
      this.dom.evtStartTimeInput.value = defaultTime;
      this.dom.evtEndDateInput.value = defaultDate;
      this.dom.evtEndTimeInput.value = this.addOneHour(defaultTime);
      this.dom.evtAllDayCheckbox.checked = false;
      this.dom.evtPrioritySelect.value = 'High';
      this.dom.evtCategoryInput.value = 'Sprint';
      this.dom.evtLocationInput.value = 'Google Meet';
      this.dom.evtDescInput.value = '';
      this.dom.evtAttendeesInput.value = '';
    }

    const isAllDay = this.dom.evtAllDayCheckbox.checked;
    this.dom.evtStartTimeInput.disabled = isAllDay;
    this.dom.evtEndTimeInput.disabled = isAllDay;

    this.dom.eventModal?.classList.add('active');
    setTimeout(() => this.dom.evtTitleInput.focus(), 100);
  }

  handleEventFormSubmit(e) {
    e.preventDefault();
    const title = this.dom.evtTitleInput.value.trim();
    if (!title) return;

    const calendarId = this.dom.evtCalSelect.value;
    const startDate = this.dom.evtStartDateInput.value;
    const startTime = this.dom.evtStartTimeInput.value;
    const endDate = this.dom.evtEndDateInput.value || startDate;
    const endTime = this.dom.evtEndTimeInput.value || startTime;
    const allDay = this.dom.evtAllDayCheckbox.checked;
    const priority = this.dom.evtPrioritySelect.value;
    const category = this.dom.evtCategoryInput.value.trim();
    const location = this.dom.evtLocationInput.value.trim();
    const description = this.dom.evtDescInput.value.trim();
    const attendees = this.dom.evtAttendeesInput.value.trim();

    if (this.editingEventId) {
      // UPDATE EVENT
      const evt = this.events.find(e => e.id === this.editingEventId);
      if (evt) {
        evt.title = title;
        evt.calendarId = calendarId;
        evt.startDate = startDate;
        evt.startTime = startTime;
        evt.endDate = endDate;
        evt.endTime = endTime;
        evt.allDay = allDay;
        evt.priority = priority;
        evt.category = category;
        evt.location = location;
        evt.description = description;
        evt.attendees = attendees;
        this.showToast(`Updated event: "${title}"`, 'success');
      }
    } else {
      // CREATE NEW EVENT
      const newEvt = {
        id: 'evt-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        title,
        calendarId,
        startDate,
        startTime,
        endDate,
        endTime,
        allDay,
        priority,
        category,
        location,
        description,
        attendees
      };
      this.events.push(newEvt);
      this.showToast(`Created event: "${title}"`, 'success');
    }

    this.saveState();
    this.dom.eventModal?.classList.remove('active');
    this.render();
  }

  openEventDetails(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (!evt) return;

    const cal = this.calendars.find(c => c.id === evt.calendarId) || { name: 'General', color: '#3b82f6', icon: '📅' };

    const formattedDate = this.formatPrettyDate(evt.startDate);
    const timeDisplay = evt.allDay ? 'All Day' : `${evt.startTime} – ${evt.endTime || 'End'}`;

    this.dom.eventDetailsBody.innerHTML = `
      <div class="event-details-content">
        <div class="event-details-cal-banner" style="--event-color: ${cal.color}; --event-bg: ${cal.color}22;">
          <span>${cal.icon || '📅'}</span>
          <span>${this.escapeHtml(cal.name)}</span>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff;">${this.escapeHtml(evt.title)}</h3>

        <div class="event-details-time">
          <span>📅 ${formattedDate}</span>
          <span>•</span>
          <span>⏰ ${timeDisplay}</span>
        </div>

        <div class="event-details-meta-row">
          ${evt.priority ? `<span class="event-meta-tag">⚡ Priority: <b>${evt.priority}</b></span>` : ''}
          ${evt.category ? `<span class="event-meta-tag">🏷️ #${this.escapeHtml(evt.category)}</span>` : ''}
          ${evt.location ? `<span class="event-meta-tag">📍 ${this.escapeHtml(evt.location)}</span>` : ''}
        </div>

        ${evt.description ? `
          <div>
            <span class="form-label" style="display:block; margin-bottom:4px;">Description &amp; Agenda:</span>
            <div class="event-details-desc">${this.escapeHtml(evt.description)}</div>
          </div>
        ` : ''}

        ${evt.attendees ? `
          <div style="font-size:0.8rem; color:var(--text-secondary);">
            👥 <b>Attendees:</b> ${this.escapeHtml(evt.attendees)}
          </div>
        ` : ''}
      </div>
    `;

    // Bind Edit button
    this.dom.btnEditFromDetails.onclick = () => {
      this.dom.eventDetailsModal?.classList.remove('active');
      this.openEventModal(eventId);
    };

    // Bind Delete button
    this.dom.btnDeleteFromDetails.onclick = () => {
      this.dom.eventDetailsModal?.classList.remove('active');
      this.deleteEventWithUndo(eventId);
    };

    this.dom.eventDetailsModal?.classList.add('active');
  }

  deleteEventWithUndo(eventId) {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx === -1) return;

    const deletedEvt = this.events[idx];
    this.events.splice(idx, 1);
    this.saveState();
    this.render();

    // Show toast with Undo button
    this.showToast(`Deleted "${deletedEvt.title}"`, 'info', () => {
      this.events.push(deletedEvt);
      this.saveState();
      this.render();
      this.showToast(`Restored "${deletedEvt.title}"`, 'success');
    });
  }

  // ==========================================================================
  // VIEWPORT RENDERERS (MONTH, WEEK, DAY, AGENDA, YEAR)
  // ==========================================================================
  renderViewport() {
    if (!this.dom.viewContainer) return;
    this.dom.viewContainer.innerHTML = '';

    switch (this.activeView) {
      case 'month':
        this.renderMonthView();
        break;
      case 'week':
        this.renderWeekView();
        break;
      case 'day':
        this.renderDayView();
        break;
      case 'agenda':
        this.renderAgendaView();
        break;
      case 'year':
        this.renderYearView();
        break;
    }
  }

  // 1. MONTH VIEW
  renderMonthView() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const filteredEvents = this.getFilteredEvents();

    const monthWrapper = document.createElement('div');
    monthWrapper.className = 'month-view-grid';

    // Weekday Headers
    const headersRow = document.createElement('div');
    headersRow.className = 'month-weekdays-header';
    WEEKDAY_NAMES_SHORT.forEach((day, index) => {
      const col = document.createElement('div');
      col.className = `weekday-col-header ${index === 0 || index === 6 ? 'weekend' : ''}`;
      col.textContent = day;
      headersRow.appendChild(col);
    });
    monthWrapper.appendChild(headersRow);

    // Days Grid
    const matrix = document.createElement('div');
    matrix.className = 'month-days-matrix';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = prevMonthDays - i;
      const prevMonthDate = new Date(year, month - 1, dNum);
      const dateStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
      const cell = this.createMonthDayCell(dateStr, dNum, true, false, filteredEvents);
      matrix.appendChild(cell);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const cell = this.createMonthDayCell(dateStr, d, false, isToday, filteredEvents);
      matrix.appendChild(cell);
    }

    // Next month days filler to complete grid
    const totalCells = firstDayIndex + daysInMonth;
    const remaining = totalCells <= 35 ? 35 - totalCells : (42 - totalCells);
    for (let n = 1; n <= remaining; n++) {
      const nextMonthDate = new Date(year, month + 1, n);
      const dateStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      const cell = this.createMonthDayCell(dateStr, n, true, false, filteredEvents);
      matrix.appendChild(cell);
    }

    monthWrapper.appendChild(matrix);
    this.dom.viewContainer.appendChild(monthWrapper);
  }

  createMonthDayCell(dateStr, dayNumber, isOtherMonth, isToday, filteredEvents) {
    const cell = document.createElement('div');
    cell.className = `month-day-cell ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`;

    cell.innerHTML = `
      <div class="month-day-header">
        <span class="day-number-badge">${dayNumber}</span>
        <button class="cell-add-quick-btn" title="Add event on ${dateStr}">+</button>
      </div>
      <div class="day-events-stack"></div>
    `;

    // Click on '+' button to add event on this date
    const addBtn = cell.querySelector('.cell-add-quick-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openEventModal(null, dateStr, '09:00');
    });

    // Clicking anywhere on empty area of cell opens event creator
    cell.addEventListener('click', (e) => {
      if (e.target.closest('.event-chip') || e.target.closest('.more-events-link')) return;
      this.openEventModal(null, dateStr, '09:00');
    });

    // Render events on this day
    const eventsOnDay = filteredEvents.filter(e => e.startDate === dateStr);
    const stack = cell.querySelector('.day-events-stack');

    const maxVisible = 3;
    const visibleEvents = eventsOnDay.slice(0, maxVisible);
    const overflowCount = eventsOnDay.length - maxVisible;

    visibleEvents.forEach(evt => {
      const cal = this.calendars.find(c => c.id === evt.calendarId) || { color: '#3b82f6' };
      const chip = document.createElement('div');
      chip.className = 'event-chip';
      chip.style.setProperty('--event-color', cal.color);
      chip.style.setProperty('--event-bg', `${cal.color}28`);

      chip.innerHTML = `
        ${!evt.allDay && evt.startTime ? `<span class="chip-time">${evt.startTime}</span>` : ''}
        <span class="chip-title">${this.escapeHtml(evt.title)}</span>
      `;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEventDetails(evt.id);
      });

      stack.appendChild(chip);
    });

    if (overflowCount > 0) {
      const moreLink = document.createElement('span');
      moreLink.className = 'more-events-link';
      moreLink.textContent = `+${overflowCount} more`;
      moreLink.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentDate = new Date(dateStr + 'T00:00:00');
        this.switchView('day');
      });
      stack.appendChild(moreLink);
    }

    return cell;
  }

  // 2. WEEK VIEW
  renderWeekView() {
    const container = document.createElement('div');
    container.className = 'week-view-container';

    // Compute 7 days of the current week (Sun to Sat)
    const weekDays = [];
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const filteredEvents = this.getFilteredEvents();

    // Header Row
    const header = document.createElement('div');
    header.className = 'timetable-header week-cols';
    header.innerHTML = `<div class="time-gutter-header">GMT</div>`;

    weekDays.forEach(day => {
      const dateStr = day.toISOString().split('T')[0];
      const isToday = dateStr === todayStr;
      const col = document.createElement('div');
      col.className = `timetable-day-header-col ${isToday ? 'today' : ''}`;
      col.innerHTML = `
        <div class="day-title-name">${WEEKDAY_NAMES_SHORT[day.getDay()]}</div>
        <div class="day-title-num">${day.getDate()}</div>
      `;
      header.appendChild(col);
    });
    container.appendChild(header);

    // Body Timetable
    const body = document.createElement('div');
    body.className = 'timetable-body week-cols';

    // Time Ruler (00:00 to 23:00)
    const ruler = document.createElement('div');
    ruler.className = 'time-ruler-col';
    for (let h = 7; h <= 21; h++) {
      const slot = document.createElement('div');
      slot.className = 'time-slot-label';
      slot.textContent = `${String(h).padStart(2, '0')}:00`;
      ruler.appendChild(slot);
    }
    body.appendChild(ruler);

    // 7 Day Columns
    weekDays.forEach(day => {
      const dateStr = day.toISOString().split('T')[0];
      const dayCol = document.createElement('div');
      dayCol.className = 'timetable-day-grid-col';

      // 15 hour slots (07:00 to 21:00)
      for (let h = 7; h <= 21; h++) {
        const hourStr = `${String(h).padStart(2, '0')}:00`;
        const slot = document.createElement('div');
        slot.className = 'hour-slot-row';
        slot.title = `Add event at ${hourStr}`;
        slot.addEventListener('click', () => {
          this.openEventModal(null, dateStr, hourStr);
        });
        dayCol.appendChild(slot);
      }

      // Render events on this day
      const dayEvents = filteredEvents.filter(e => e.startDate === dateStr);
      dayEvents.forEach(evt => {
        const block = this.createTimetableEventBlock(evt);
        if (block) dayCol.appendChild(block);
      });

      body.appendChild(dayCol);
    });

    container.appendChild(body);
    this.dom.viewContainer.appendChild(container);
  }

  // 3. DAY VIEW
  renderDayView() {
    const container = document.createElement('div');
    container.className = 'day-view-container';

    const day = this.currentDate;
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    const filteredEvents = this.getFilteredEvents().filter(e => e.startDate === dateStr);

    // Header
    const header = document.createElement('div');
    header.className = 'timetable-header day-col';
    header.innerHTML = `
      <div class="time-gutter-header">Time</div>
      <div class="timetable-day-header-col ${isToday ? 'today' : ''}" style="text-align: left; padding-left: 20px;">
        <div class="day-title-name">${WEEKDAY_NAMES_FULL[day.getDay()]}</div>
        <div class="day-title-num" style="display:inline-block;">${day.getDate()}</div>
      </div>
    `;
    container.appendChild(header);

    // Body
    const body = document.createElement('div');
    body.className = 'timetable-body day-col';

    const ruler = document.createElement('div');
    ruler.className = 'time-ruler-col';
    for (let h = 7; h <= 21; h++) {
      const slot = document.createElement('div');
      slot.className = 'time-slot-label';
      slot.textContent = `${String(h).padStart(2, '0')}:00`;
      ruler.appendChild(slot);
    }
    body.appendChild(ruler);

    const dayCol = document.createElement('div');
    dayCol.className = 'timetable-day-grid-col';

    for (let h = 7; h <= 21; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const slot = document.createElement('div');
      slot.className = 'hour-slot-row';
      slot.title = `Add event at ${hourStr}`;
      slot.addEventListener('click', () => {
        this.openEventModal(null, dateStr, hourStr);
      });
      dayCol.appendChild(slot);
    }

    filteredEvents.forEach(evt => {
      const block = this.createTimetableEventBlock(evt);
      if (block) dayCol.appendChild(block);
    });

    body.appendChild(dayCol);
    container.appendChild(body);
    this.dom.viewContainer.appendChild(container);
  }

  createTimetableEventBlock(evt) {
    const cal = this.calendars.find(c => c.id === evt.calendarId) || { color: '#3b82f6' };
    
    // Calculate top and height relative to 07:00 base
    let startHour = 9;
    let startMin = 0;
    let endHour = 10;
    let endMin = 0;

    if (!evt.allDay && evt.startTime) {
      const parts = evt.startTime.split(':');
      startHour = parseInt(parts[0], 10);
      startMin = parseInt(parts[1] || '0', 10);
    }

    if (!evt.allDay && evt.endTime) {
      const parts = evt.endTime.split(':');
      endHour = parseInt(parts[0], 10);
      endMin = parseInt(parts[1] || '0', 10);
    } else {
      endHour = startHour + 1;
    }

    const startMinutesFrom7am = ((startHour - 7) * 60) + startMin;
    const durationMinutes = Math.max(30, ((endHour - startHour) * 60) + (endMin - startMin));

    const topPx = (startMinutesFrom7am / 60) * 60; // 60px per hour
    const heightPx = Math.max(36, (durationMinutes / 60) * 60);

    const block = document.createElement('div');
    block.className = 'timetable-event-block';
    block.style.top = `${topPx}px`;
    block.style.height = `${heightPx}px`;
    block.style.setProperty('--event-color', cal.color);
    block.style.setProperty('--event-bg', `${cal.color}33`);

    block.innerHTML = `
      <div class="tb-title">${this.escapeHtml(evt.title)}</div>
      <div class="tb-meta">${evt.allDay ? 'All Day' : `${evt.startTime} - ${evt.endTime}`} • ${this.escapeHtml(evt.location || cal.name)}</div>
    `;

    block.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openEventDetails(evt.id);
    });

    return block;
  }

  // 4. AGENDA / LIST VIEW
  renderAgendaView() {
    const container = document.createElement('div');
    container.className = 'agenda-view-container';

    const filteredEvents = this.getFilteredEvents();

    if (filteredEvents.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">📅</div>
          <h3 style="color: #fff; margin-bottom: 6px;">No Events Found</h3>
          <p style="font-size: 0.85rem;">Try adjusting search terms, activating more calendars, or add a new sprint event.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="window.calendarApp.openEventModal()">+ Create Event</button>
        </div>
      `;
      this.dom.viewContainer.appendChild(container);
      return;
    }

    // Sort events chronologically
    const sorted = [...filteredEvents].sort((a, b) => {
      const aVal = `${a.startDate} ${a.startTime || '00:00'}`;
      const bVal = `${b.startDate} ${b.startTime || '00:00'}`;
      return aVal.localeCompare(bVal);
    });

    // Group by Date
    const grouped = {};
    sorted.forEach(evt => {
      if (!grouped[evt.startDate]) grouped[evt.startDate] = [];
      grouped[evt.startDate].push(evt);
    });

    const todayStr = new Date().toISOString().split('T')[0];

    Object.keys(grouped).forEach(dateStr => {
      const groupBlock = document.createElement('div');
      groupBlock.className = 'agenda-group-block';

      const isToday = dateStr === todayStr;
      const prettyDate = this.formatPrettyDate(dateStr);

      groupBlock.innerHTML = `
        <div class="agenda-date-header">
          <span>${prettyDate}</span>
          ${isToday ? '<span class="agenda-badge">TODAY</span>' : ''}
        </div>
        <div class="agenda-events-list"></div>
      `;

      const listEl = groupBlock.querySelector('.agenda-events-list');

      grouped[dateStr].forEach(evt => {
        const cal = this.calendars.find(c => c.id === evt.calendarId) || { name: 'General', color: '#3b82f6', icon: '📅' };
        const card = document.createElement('div');
        card.className = 'agenda-card-item';
        card.style.setProperty('--event-color', cal.color);
        card.style.setProperty('--event-bg', `${cal.color}22`);

        card.innerHTML = `
          <div class="agenda-time-pill">
            ${evt.allDay ? 'All Day' : `${evt.startTime} – ${evt.endTime || 'End'}`}
          </div>
          <div class="agenda-main-info">
            <div class="agenda-title-row">
              <span class="agenda-title">${this.escapeHtml(evt.title)}</span>
              <span class="agenda-cal-tag">${cal.icon || '📅'} ${this.escapeHtml(cal.name)}</span>
            </div>
            ${evt.description ? `<div class="agenda-desc">${this.escapeHtml(evt.description)}</div>` : ''}
          </div>
          <div class="agenda-actions-group">
            <button class="btn btn-secondary btn-sm" title="Edit">Edit</button>
          </div>
        `;

        card.addEventListener('click', () => this.openEventDetails(evt.id));

        const editBtn = card.querySelector('button');
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openEventModal(evt.id);
        });

        listEl.appendChild(card);
      });

      container.appendChild(groupBlock);
    });

    this.dom.viewContainer.appendChild(container);
  }

  // 5. YEAR VIEW (12 Mini Month Matrix)
  renderYearView() {
    const container = document.createElement('div');
    container.className = 'year-view-container';

    const year = this.currentDate.getFullYear();
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const filteredEvents = this.getFilteredEvents();

    for (let m = 0; m < 12; m++) {
      const monthCard = document.createElement('div');
      monthCard.className = 'year-month-card';

      monthCard.innerHTML = `
        <div class="year-month-title">${MONTH_NAMES[m]}</div>
        <div class="year-mini-grid"></div>
      `;

      const grid = monthCard.querySelector('.year-mini-grid');

      // Headers
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'year-day-header';
        h.textContent = d;
        grid.appendChild(h);
      });

      const firstDay = new Date(year, m, 1).getDay();
      const daysInM = new Date(year, m + 1, 0).getDate();

      // Blank prefix
      for (let b = 0; b < firstDay; b++) {
        const blank = document.createElement('div');
        blank.className = 'year-day-dot';
        grid.appendChild(blank);
      }

      // Days
      for (let d = 1; d <= daysInM; d++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dot = document.createElement('div');
        dot.className = 'year-day-dot';
        dot.textContent = d;

        if (dateStr === todayStr) dot.classList.add('today');
        if (filteredEvents.some(e => e.startDate === dateStr)) dot.classList.add('has-events');

        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          this.currentDate = new Date(year, m, d);
          this.switchView('month');
        });

        grid.appendChild(dot);
      }

      monthCard.addEventListener('click', () => {
        this.currentDate = new Date(year, m, 1);
        this.switchView('month');
      });

      container.appendChild(monthCard);
    }

    this.dom.viewContainer.appendChild(container);
  }

  // Filter Bar Summary
  renderFilterStatus() {
    if (!this.dom.filterStatusBar || !this.dom.filterChipsContainer) return;

    const visibleCals = this.calendars.filter(c => c.visible);
    const hiddenCount = this.calendars.length - visibleCals.length;

    this.dom.filterChipsContainer.innerHTML = '';

    if (hiddenCount > 0) {
      const pill = document.createElement('span');
      pill.className = 'filter-pill';
      pill.innerHTML = `Hidden Calendars: <b>${hiddenCount}</b> <span class="remove-filter" title="Show all">✕</span>`;
      pill.querySelector('.remove-filter').onclick = () => {
        this.calendars.forEach(c => c.visible = true);
        this.saveState();
        this.render();
      };
      this.dom.filterChipsContainer.appendChild(pill);
    }

    if (this.activeTagFilter) {
      const pill = document.createElement('span');
      pill.className = 'filter-pill';
      pill.innerHTML = `Tag: <b>#${this.activeTagFilter}</b> <span class="remove-filter" title="Clear tag filter">✕</span>`;
      pill.querySelector('.remove-filter').onclick = () => {
        this.activeTagFilter = null;
        this.render();
      };
      this.dom.filterChipsContainer.appendChild(pill);
    }

    if (this.searchQuery) {
      const pill = document.createElement('span');
      pill.className = 'filter-pill';
      pill.innerHTML = `Search: <b>"${this.searchQuery}"</b> <span class="remove-filter" title="Clear search">✕</span>`;
      pill.querySelector('.remove-filter').onclick = () => {
        this.dom.searchInput.value = '';
        this.searchQuery = '';
        this.render();
      };
      this.dom.filterChipsContainer.appendChild(pill);
    }
  }

  // ==========================================================================
  // EXPORT / IMPORT (ICS & JSON)
  // ==========================================================================
  exportICS() {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CODEXA//Calendar Scheduler V1.0//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    this.events.forEach(evt => {
      const cal = this.calendars.find(c => c.id === evt.calendarId) || { name: 'General' };
      const startDt = (evt.startDate || '').replace(/-/g, '') + (evt.allDay ? '' : 'T' + (evt.startTime || '09:00').replace(/:/g, '') + '00');
      const endDt = (evt.endDate || evt.startDate || '').replace(/-/g, '') + (evt.allDay ? '' : 'T' + (evt.endTime || '10:00').replace(/:/g, '') + '00');

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${evt.id}@codexa.io`);
      icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      icsContent.push(`DTSTART:${startDt}`);
      icsContent.push(`DTEND:${endDt}`);
      icsContent.push(`SUMMARY:${this.cleanIcsText(evt.title)} [${cal.name}]`);
      if (evt.description) icsContent.push(`DESCRIPTION:${this.cleanIcsText(evt.description)}`);
      if (evt.location) icsContent.push(`LOCATION:${this.cleanIcsText(evt.location)}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `codexa-calendar-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast('Downloaded .ICS Calendar file for Google / Apple / Outlook', 'success');
  }

  handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported.calendars) && Array.isArray(imported.events)) {
          this.calendars = imported.calendars;
          this.events = imported.events;
          this.saveState();
          this.render();
          this.showToast('Successfully imported calendars & events backup', 'success');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Could not parse JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  cleanIcsText(str) {
    return (str || '').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  showToast(message, type = 'info', undoCallback = null) {
    if (!this.dom.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '✕';

    toast.innerHTML = `
      <span>${icon}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    if (undoCallback) {
      const undoBtn = document.createElement('button');
      undoBtn.className = 'toast-undo-btn';
      undoBtn.textContent = 'Undo';
      undoBtn.addEventListener('click', () => {
        undoCallback();
        toast.remove();
      });
      toast.appendChild(undoBtn);
    }

    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatPrettyDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    const y = parts[0];
    const m = MONTH_NAMES[parseInt(parts[1], 10) - 1];
    const d = parseInt(parts[2], 10);
    return `${m} ${d}, ${y}`;
  }

  addOneHour(timeStr) {
    if (!timeStr) return '11:00';
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10) + 1;
    if (h >= 24) h = 0;
    return `${String(h).padStart(2, '0')}:${parts[1] || '00'}`;
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.calendarApp = new CalendarApp();
});
