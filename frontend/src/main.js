document.addEventListener('DOMContentLoaded', function () {
  const pageName = window.location.pathname.split('/').pop().toLowerCase();
  if ((pageName === 'index.html' || pageName === '') && !sessionStorage.getItem('cerasSplashShown')) {
    sessionStorage.setItem('cerasSplashShown', 'true');
    const splash = document.createElement('div');
    splash.className = 'ceras-splash';
    splash.setAttribute('aria-label', 'Loading CERAS');
    splash.setAttribute('role', 'status');
    splash.innerHTML = `
      <div class="ceras-splash-content">
        <img class="ceras-splash-logo" src="images/ceras-splash.jpg" alt="CERAS">
      </div>
    `;
    document.body.prepend(splash);
    window.setTimeout(() => splash.classList.add('is-hidden'), 3000);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav, .nav-menu');
  const navLinks = document.querySelectorAll('.site-nav a, .nav-menu a');
  const header = document.querySelector('.site-header, .navbar');
  const sections = document.querySelectorAll('main section[id]');
  
  // Mobile Menu Toggle
  function toggleMenu() {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  }

  menuToggle?.addEventListener('click', toggleMenu);

  // Smooth Scroll Navigation
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      event.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      siteNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Scroll-based Header & Active Link Highlighting
  function handleScroll() {
    const offset = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.site-nav a[href="#${id}"], .nav-menu a[href="#${id}"]`);
      if (!navLink) return;
      if (offset >= top && offset < bottom) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    });

    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Intersection Observer for Fade-in Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = `fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .report-card, .people-card, .alert-card, .stat-card').forEach((el) => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Parallax Effect for Images (subtle)
  const parallaxElements = document.querySelectorAll('.split-media img, .hero-image');
  window.addEventListener('scroll', () => {
    parallaxElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const scrolled = (rect.top * 0.5);
      el.style.transform = `translateY(${scrolled}px)`;
    });
  }, { passive: true });

  // Button Ripple Effect
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mouseenter', function (e) {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.opacity = '0.6';
      ripple.style.animation = 'pulse 0.6s ease-out';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Scroll Progress Indicator (optional visual feedback)
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (scrollTop / docHeight) * 100;
  }, { passive: true });

  // Hero slideshow auto-rotation
  const slideshow = document.getElementById('heroSlideshow');
  const slides = slideshow ? slideshow.querySelectorAll('.slide') : [];
  let activeIndex = 0;
  let slideshowTimer;

  function showSlide(index) {
    if (!slides.length) return;
    activeIndex = index % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === activeIndex);
    });
  }

  function nextSlide() {
    showSlide((activeIndex + 1) % slides.length);
  }

  if (slides.length) {
    slideshowTimer = setInterval(nextSlide, 5000);
  }

  function injectSocialIcons() {
    document.querySelectorAll('.social-links a[data-network]').forEach((link) => {
      const network = link.dataset.network;
      const icons = {
        facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V7.5c0-.9.3-1.6 1.7-1.6H17V2.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10.8H8v3.2h2.3v8h3.2z"/></svg>',
        twitter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2h3.4l-7.4 8.5L23 22h-6.7l-5.2-7.3L5.2 22H1.8l7.9-9.1L1 2h6.9l4.7 6.6L18.9 2zm-1.2 18h1.9L7 3.9H5.1L17.7 20z"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.9 8.6A1.8 1.8 0 1 1 6.9 5a1.8 1.8 0 0 1 0 3.6zM5.3 9.8h3.2v10H5.3zm5.2 0h3.1v1.4h.1c.4-.8 1.5-1.7 3.2-1.7 3.4 0 4 2.2 4 5.1V19.8h-3.2v-18.5h3.2v2.4h.1c.5-1 1.6-2 3.4-2 3.7 0 4.4 2.4 4.4 5.5V19.8h-3.2v-18.5h3.2v2.4h.1c.5-1 1.6-2 3.4-2 3.7 0 4.4 2.4 4.4 5.5V19.8H18.5v-8.1c0-1.9-.1-4.4-2.7-4.4s-3.1 2.1-3.1 4.3V19.8h-3.2V9.8z"/></svg>'
      };
      if (icons[network]) {
        link.innerHTML = icons[network];
      }
    });
  }

  injectSocialIcons();

  // Authentication support for login page and nav state
  const authButton = document.querySelector('.btn-login');
  let openMapsLibraryPromise = null;
  let reporterMap = null;
  let reporterLocationMarker = null;
  let currentUser = null;
  const API_BASE_URL = (import.meta.env.VITE_API_URL || localStorage.getItem('ceras_api_url') || 'http://localhost:3000').replace(/\/$/, '');
  const apiUrl = (url) => `${API_BASE_URL}${url}`;
  const authRequest = (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem('ceras_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(apiUrl(url), { ...options, headers }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed');
      return data;
    });
  };

  async function loadCurrentUser() {
    try {
      const data = await authRequest('/api/session');
      currentUser = data.user || null;
    } catch {
      currentUser = JSON.parse(localStorage.getItem('ceras_user') || 'null');
    }
    updateAuthButton();
    renderProfileSummary();
    if (authStatus) authStatus.textContent = currentUser ? `Signed in as ${currentUser.name} (${currentUser.role})` : 'Not signed in';
    setReporterAccessState?.();
    renderReporterReports?.();
    if (currentUser?.role === 'user') {
      initializeReporterLocationCapture();
      renderReporterIncidentMap();
    }
    loadProfileData?.();
    initAdminDashboard?.();
    initAgencyPortal?.();
    renderAgencyDetailPage?.();
  }

  function updateAuthButton() {
    if (!authButton) return;
    authButton.onclick = null;
    if (currentUser) {
      authButton.textContent = 'Logout';
      authButton.href = 'login.html';
      authButton.classList.add('btn-login');
      authButton.onclick = (event) => {
        event.preventDefault();
        authRequest('/api/logout', { method: 'POST' }).finally(() => {
          currentUser = null;
          localStorage.removeItem('ceras_token');
          localStorage.removeItem('ceras_user');
          updateAuthButton();
          window.location.href = 'login.html';
        });
      };
    } else {
      authButton.textContent = 'Login';
      authButton.href = 'login.html';
      authButton.classList.add('btn-login');
    }
  }

  function setAuthStatusMessage(message, success) {
    return function (messageElement) {
      if (!messageElement) return;
      messageElement.textContent = message;
      messageElement.style.color = success ? 'var(--ceras-navy)' : 'var(--ceras-red)';
    };
  }

  const authStatus = document.getElementById('authStatus');
  if (authStatus) {
    authStatus.textContent = currentUser ? `Signed in as ${currentUser.name} (${currentUser.role})` : 'Not signed in';
  }

  function getInitials(name) {
    if (!name) return 'CU';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
  }

  function renderProfileSummary() {
    const summary = document.getElementById('profileSummary');
    if (!summary) return;

    if (!currentUser) {
      summary.classList.add('hidden');
      return;
    }

    const avatar = document.getElementById('userAvatar');
    const name = document.getElementById('profileName');
    const email = document.getElementById('profileEmail');

    if (avatar) avatar.textContent = getInitials(currentUser.name);
    if (name) name.textContent = currentUser.name;
    if (email) email.textContent = currentUser.email;

    summary.classList.remove('hidden');
  }

  loadCurrentUser();

  function activateAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.auth-box').forEach((box) => {
      box.classList.toggle('active', box.id === `${tabName}Box`);
    });
  }

  document.querySelectorAll('[data-tab]').forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      activateAuthTab(tabButton.dataset.tab);
    });
  });

  function showMessage(element, message, success = false) {
    if (!element) return;
    element.textContent = message;
    element.style.color = success ? 'var(--ceras-navy)' : 'var(--ceras-red)';
  }

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const createAccountLink = document.getElementById('createAccountLink');
  const resetModal = document.getElementById('resetModal');
  const resetStep1 = document.getElementById('resetStep1');
  const resetStep2 = document.getElementById('resetStep2');
  const sendResetCodeBtn = document.getElementById('sendResetCode');
  const confirmResetCodeBtn = document.getElementById('confirmResetCode');
  const closeResetModalBtn = document.getElementById('closeResetModal');
  const resetEmailInput = document.getElementById('resetEmail');
  const resetEmailLabel = document.getElementById('resetEmailLabel');
  const resetCodeInput = document.getElementById('resetCode');
  const newPasswordInput = document.getElementById('newPassword');

  let pendingResetCode = null;
  let pendingResetEmail = null;

  function openResetModal() {
    if (!resetModal) return;
    resetModal.classList.remove('hidden');
    if (resetStep1) resetStep1.classList.remove('hidden');
    if (resetStep2) resetStep2.classList.add('hidden');
    if (resetCodeInput) resetCodeInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    if (resetEmailInput) resetEmailInput.value = '';
    const resetMessage = document.getElementById('resetMessage');
    if (resetMessage) {
      resetMessage.textContent = '';
    }
  }

  function closeResetModal() {
    if (!resetModal) return;
    resetModal.classList.add('hidden');
    pendingResetCode = null;
    pendingResetEmail = null;
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'reset-password.html';
    });
  }

  if (createAccountLink) {
    createAccountLink.addEventListener('click', (event) => {
      event.preventDefault();
      activateAuthTab('register');
    });
  }

  const loginFromRegisterLink = document.getElementById('loginFromRegisterLink');
  if (loginFromRegisterLink) {
    loginFromRegisterLink.addEventListener('click', (event) => {
      event.preventDefault();
      activateAuthTab('login');
    });
  }

  if (closeResetModalBtn) {
    closeResetModalBtn.addEventListener('click', closeResetModal);
  }

  if (resetModal) {
    resetModal.addEventListener('click', (event) => {
      if (event.target === resetModal) closeResetModal();
    });
  }

  if (sendResetCodeBtn) {
    sendResetCodeBtn.addEventListener('click', () => {
      const email = (resetEmailInput?.value || '').trim().toLowerCase();
      const resetMessage = document.getElementById('resetMessage');
      pendingResetEmail = email;
      pendingResetCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (resetEmailLabel) {
        resetEmailLabel.textContent = email;
      }
      if (resetStep1) resetStep1.classList.add('hidden');
      if (resetStep2) resetStep2.classList.remove('hidden');
      if (resetMessage) {
        resetMessage.textContent = `Demo reset code: ${pendingResetCode} (for testing in this prototype).`;
        resetMessage.style.color = 'var(--ceras-navy)';
      }
    });
  }

  if (confirmResetCodeBtn) {
    confirmResetCodeBtn.addEventListener('click', () => {
      const enteredCode = (resetCodeInput?.value || '').trim();
      const newPassword = newPasswordInput?.value || '';
      const resetMessage = document.getElementById('resetMessage');

      if (!pendingResetEmail || !pendingResetCode) {
        if (resetMessage) {
          resetMessage.textContent = 'Please request a reset code first.';
          resetMessage.style.color = 'var(--ceras-red)';
        }
        return;
      }

      if (enteredCode !== pendingResetCode) {
        if (resetMessage) {
          resetMessage.textContent = 'The reset code is incorrect.';
          resetMessage.style.color = 'var(--ceras-red)';
        }
        return;
      }

      if (!newPassword || newPassword.length < 14) {
        if (resetMessage) {
          resetMessage.textContent = 'Use a password with at least 14 characters.';
          resetMessage.style.color = 'var(--ceras-red)';
        }
        return;
      }

      if (resetMessage) {
        resetMessage.textContent = 'Password reset is available through the secure account service.';
        resetMessage.style.color = 'var(--ceras-navy)';
      }
      setTimeout(closeResetModal, 1200);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const messageEl = document.getElementById('loginMessage');
      try {
        const data = await authRequest('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        currentUser = data.user;
        localStorage.setItem('ceras_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('ceras_token', data.token);
        updateAuthButton();
        renderProfileSummary();
        const destinations = { admin: 'admin.html', police: 'ghana-police.html', fire: 'fire-service.html', ambulance: 'ambulance.html', nadmo: 'nadmo.html', user: 'incident-reporting.html' };
        window.location.href = destinations[currentUser.role] || 'index.html';
      } catch (error) {
        showMessage(messageEl, error.message || 'Unable to sign in.', false);
        return;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('registerName').value.trim();
      const email = document.getElementById('registerEmail').value.trim().toLowerCase();
      const password = document.getElementById('registerPassword').value;
      const messageEl = document.getElementById('registerMessage');
      if (!name || !email || !password) {
        showMessage(messageEl, 'Please complete all fields.', false);
        return;
      }
      try {
        const data = await authRequest('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
        currentUser = data.user;
        localStorage.setItem('ceras_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('ceras_token', data.token);
        showMessage(messageEl, 'User account created and signed in.', true);
        setTimeout(() => { window.location.href = 'incident-reporting.html'; }, 700);
      } catch (error) {
        showMessage(messageEl, error.message || 'Unable to create account.', false);
      }
    });
  }

  function setReporterAccessState() {
    const reportAuthGate = document.getElementById('reportAuthGate');
    const reportDashboard = document.getElementById('reportDashboard');
    const reportFormCard = document.getElementById('reportFormCard');
    const reportChatPanel = document.getElementById('reportChatPanel');
    const reportInfoCard = document.getElementById('reportInfoCard');
    const isSignedIn = Boolean(currentUser);
    const isReporterUser = currentUser && currentUser.role === 'user';

    if (!currentUser || !isReporterUser) {
      if (reportAuthGate) {
        reportAuthGate.classList.remove('hidden');
        if (currentUser && currentUser.role !== 'user') {
          const agencyLabel = {
            admin: 'response hub',
            police: 'police desk',
            fire: 'fire service desk',
            ambulance: 'ambulance desk',
            nadmo: 'NADMO desk'
          }[currentUser.role] || 'operations dashboard';
          reportAuthGate.innerHTML = `
            <h2>Agency access only</h2>
            <p>This page is reserved for community reporters. Service agents should use the ${agencyLabel} dashboard to resolve emergencies.</p>
            <div class="report-auth-actions">
              <a href="services.html" class="btn btn-primary">Open operations</a>
            </div>
          `;
        }
      }
      if (reportDashboard) reportDashboard.classList.add('hidden');
      if (reportFormCard) reportFormCard.classList.add('hidden');
      if (reportChatPanel) reportChatPanel.classList.add('hidden');
      if (reportInfoCard) reportInfoCard.classList.add('hidden');

      return;
    }

    if (reportAuthGate) reportAuthGate.classList.add('hidden');
    if (reportDashboard) reportDashboard.classList.remove('hidden');
    if (reportFormCard) reportFormCard.classList.remove('hidden');
    if (reportInfoCard) reportInfoCard.classList.remove('hidden');
    if (reportChatPanel) reportChatPanel.classList.add('hidden');

    const userBadge = document.getElementById('reporterSignedInBadge');
    if (userBadge) userBadge.textContent = `Signed in as ${currentUser.name}`;
  }

  function renderReporterReports() {
    const list = document.getElementById('reporterReportsList');
    const toggle = document.querySelector('.report-list-toggle');
    const total = document.getElementById('reportSummaryTotal');
    const status = document.getElementById('reportSummaryStatus');
    const chatPanel = document.getElementById('reportChatPanel');
    if (!list) return;

    const allReports = JSON.parse(localStorage.getItem('cerasIncidentReports') || '[]');
    const userReports = currentUser
      ? allReports.filter((report) => report.email === currentUser.email || report.reporter === currentUser.name)
      : [];

    if (total) total.textContent = String(userReports.length);
    if (status) status.textContent = userReports.length ? 'Queued' : 'Waiting';

    if (!userReports.length) {
      list.innerHTML = '<div class="reporter-empty-state">No incidents submitted yet. Use the form above to report a new case.</div>';
      if (chatPanel) chatPanel.classList.add('hidden');
    } else {
      list.innerHTML = userReports.map((report, index) => `
        <article class="reporter-report-item">
          <div class="reporter-item-header">
            <h4>${report.title}</h4>
            <span class="reporter-status">${report.status || 'Queued'}</span>
          </div>
          <p><strong>Service:</strong> ${report.service || 'Awaiting assignment'}</p>
          <p><strong>Location:</strong> ${report.location}</p>
          <p><strong>Time:</strong> ${report.time}</p>
          <button type="button" class="btn btn-secondary btn-small report-follow-btn" data-report-index="${index}">Follow up on case</button>
        </article>
      `).join('');

      list.querySelectorAll('.report-follow-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const index = Number(button.dataset.reportIndex);
          const report = userReports[index];
          const service = report?.service || 'police';
          const chatSelect = document.getElementById('reportChatService');
          if (chatSelect) chatSelect.value = service;
          if (chatPanel) chatPanel.classList.remove('hidden');
          const chatThread = document.getElementById('reportChatThread');
          if (chatThread) {
            const currentService = serviceSelect?.value || service;
            const chatKey = `cerasReporterChat_${currentService}`;
            const existingMessages = JSON.parse(sessionStorage.getItem(chatKey) || 'null') || [
              { sender: 'Dispatch', text: `You are now connected with the ${currentService.toUpperCase()} team. Please share the latest details.`, time: 'now' }
            ];
            chatThread.innerHTML = existingMessages.map((message) => `
              <div class="report-chat-bubble ${message.sender === 'You' ? 'outgoing' : 'incoming'}">
                <strong>${message.sender}</strong>
                <p>${message.text}</p>
                <span>${message.time}</span>
              </div>
            `).join('');
          }
        });
      });
    }

    if (toggle && !toggle.dataset.bound) {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        list.classList.toggle('is-open', !isExpanded);
        list.setAttribute('aria-hidden', String(isExpanded));
      });
      toggle.dataset.bound = 'true';
    }

    if (!list.classList.contains('is-open')) {
      toggle?.setAttribute('aria-expanded', 'false');
      list.classList.remove('is-open');
      list.setAttribute('aria-hidden', 'true');
    }
  }

  function initializeReporterChat() {
    const chatPanel = document.getElementById('reportChatPanel');
    const chatThread = document.getElementById('reportChatThread');
    const chatForm = document.getElementById('reportChatForm');
    const serviceSelect = document.getElementById('reportChatService');
    if (!chatPanel || !chatThread || !chatForm || !serviceSelect) return;

    chatPanel.classList.add('hidden');

    function renderReportChat() {
      const service = serviceSelect.value;
      const chatKey = `cerasReporterChat_${service}`;
      const messages = JSON.parse(sessionStorage.getItem(chatKey) || 'null') || [
        { sender: 'Dispatch', text: `You are now connected with the ${service.toUpperCase()} team. Please share the latest details.`, time: 'now' }
      ];
      chatThread.innerHTML = messages.map((message) => `
        <div class="report-chat-bubble ${message.sender === 'You' ? 'outgoing' : 'incoming'}">
          <strong>${message.sender}</strong>
          <p>${message.text}</p>
          <span>${message.time}</span>
        </div>
      `).join('');
      chatThread.scrollTop = chatThread.scrollHeight;
    }

    serviceSelect.addEventListener('change', () => {
      if (!chatPanel.classList.contains('hidden')) {
        renderReportChat();
      }
    });

    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('reportChatInput');
      const message = (input.value || '').trim();
      if (!message) return;

      const service = serviceSelect.value;
      const chatKey = `cerasReporterChat_${service}`;
      const existingMessages = JSON.parse(sessionStorage.getItem(chatKey) || 'null') || [
        { sender: 'Dispatch', text: `You are now connected with the ${service.toUpperCase()} team. Please share the latest details.`, time: 'now' }
      ];
      const nextMessages = [...existingMessages, { sender: 'You', text: message, time: 'now' }];
      sessionStorage.setItem(chatKey, JSON.stringify(nextMessages));
      input.value = '';
      renderReportChat();
    });

    renderReportChat();
  }

  function initializeReporterLocationCapture() {
    const useLocationBtn = document.getElementById('useMyLocationBtn');
    const latitudeField = document.getElementById('incidentLatitude');
    const longitudeField = document.getElementById('incidentLongitude');
    const locationStatus = document.getElementById('locationStatus');
    if (!useLocationBtn || !latitudeField || !longitudeField) return;

    useLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        if (locationStatus) {
          locationStatus.textContent = 'Geolocation is not supported in this browser.';
          locationStatus.style.color = 'var(--ceras-red)';
        }
        return;
      }

      if (locationStatus) {
        locationStatus.textContent = 'Finding your exact location...';
        locationStatus.style.color = 'var(--ceras-navy)';
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          selectReporterLocation(latitude, longitude);
          if (locationStatus) locationStatus.textContent = 'Location captured successfully.';
        },
        () => {
          if (locationStatus) {
            locationStatus.textContent = 'Location access was denied. Please enter the address manually.';
            locationStatus.style.color = 'var(--ceras-red)';
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });
  }

  function selectReporterLocation(latitude, longitude) {
    const latitudeField = document.getElementById('incidentLatitude');
    const longitudeField = document.getElementById('incidentLongitude');
    const locationInput = document.getElementById('location');
    const locationStatus = document.getElementById('locationStatus');
    latitudeField.value = latitude;
    longitudeField.value = longitude;
    if (locationInput && !locationInput.value.trim()) {
      locationInput.value = `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`;
    }
    if (locationStatus) {
      locationStatus.textContent = 'Location selected. Add a street or landmark if known.';
      locationStatus.style.color = 'var(--ceras-navy)';
    }
    if (reporterMap && window.L) {
      if (reporterLocationMarker) reporterLocationMarker.setLatLng([latitude, longitude]);
      else reporterLocationMarker = window.L.marker([latitude, longitude], { draggable: true }).addTo(reporterMap);
      reporterLocationMarker.bindPopup('New report location').openPopup();
      reporterMap.setView([latitude, longitude], Math.max(reporterMap.getZoom(), 14));
      reporterLocationMarker.off('dragend');
      reporterLocationMarker.on('dragend', (event) => {
        const coordinates = event.target.getLatLng();
        latitudeField.value = coordinates.lat;
        longitudeField.value = coordinates.lng;
        if (locationStatus) locationStatus.textContent = 'Marker moved to the selected incident location.';
      });
    }
  }

  async function renderReporterIncidentMap() {
    const mapContainer = document.getElementById('reporterIncidentMap');
    const mapStatus = document.getElementById('reporterMapStatus');
    if (!mapContainer || currentUser?.role !== 'user') return;

    let reports = [];
    let usingCachedReports = false;
    try {
      const data = await authRequest('/api/reports');
      reports = Array.isArray(data.reports) ? data.reports : [];
      const allReports = JSON.parse(localStorage.getItem('cerasIncidentReports') || '[]');
      localStorage.setItem('cerasIncidentReports', JSON.stringify([
        ...allReports.filter((report) => report.email !== currentUser.email),
        ...reports
      ]));
      renderReporterReports();
    } catch {
      usingCachedReports = true;
      reports = JSON.parse(localStorage.getItem('cerasIncidentReports') || '[]')
        .filter((report) => report.email === currentUser.email || report.reporter === currentUser.name);
    }

    const points = reports.filter((report) => {
      const latitude = Number(report.latitude);
      const longitude = Number(report.longitude);
      return report.latitude !== '' && report.longitude !== '' &&
        Number.isFinite(latitude) && Number.isFinite(longitude) &&
        latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
    });
    if (mapStatus) {
      const count = `${points.length} incident location${points.length === 1 ? '' : 's'}`;
      mapStatus.textContent = usingCachedReports ? `${count} · API unavailable` : count;
    }

    if (reporterMap) {
      reporterMap.remove();
      reporterMap = null;
      reporterLocationMarker = null;
    }
    mapContainer.innerHTML = '';
    mapContainer.dataset.ready = 'loading';

    try {
      await loadOpenMapsLibrary();
      const { L } = window;
      reporterMap = L.map(mapContainer, { zoomControl: true, scrollWheelZoom: true });
      if (points.length) {
        const bounds = L.latLngBounds(points.map((point) => [Number(point.latitude), Number(point.longitude)]));
        reporterMap.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
      } else {
        reporterMap.setView([7.9465, -1.0232], 6);
      }

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19,
        maxNativeZoom: 19
      }).addTo(reporterMap);

      points.forEach((report) => {
        const marker = L.marker([Number(report.latitude), Number(report.longitude)]).addTo(reporterMap);
        marker.bindPopup(`<strong>${escapeHtml(report.title || 'Incident report')}</strong><br>${escapeHtml(report.location || 'Location not provided')}<br>${escapeHtml(report.status || 'Queued')}`);
      });

      reporterMap.on('click', (event) => {
        selectReporterLocation(event.latlng.lat, event.latlng.lng);
      });

      const latitudeField = document.getElementById('incidentLatitude');
      const longitudeField = document.getElementById('incidentLongitude');
      if (latitudeField?.value && longitudeField?.value) {
        selectReporterLocation(Number(latitudeField.value), Number(longitudeField.value));
      }

      mapContainer.dataset.ready = 'true';
      window.setTimeout(() => reporterMap?.invalidateSize(), 250);
    } catch {
      mapContainer.dataset.ready = 'false';
      mapContainer.innerHTML = '<div class="map-load-error">Map unavailable. Check your internet connection and reload; you can still enter the location manually.</div>';
    }
  }

  function initializeReporterReporting() {
    const form = document.querySelector('.report-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const messageEl = document.getElementById('reportFormMessage');
      if (!currentUser || currentUser.role !== 'user') {
        showMessage(messageEl, 'You must sign in before reporting an incident.', false);
        return;
      }

      const service = document.getElementById('reportService').value;
      const latitude = document.getElementById('incidentLatitude').value;
      const longitude = document.getElementById('incidentLongitude').value;
      const payload = {
        title: document.getElementById('incidentTitle').value.trim(),
        type: document.getElementById('incidentType').value,
        service,
        location: document.getElementById('location').value.trim(),
        latitude: latitude || '',
        longitude: longitude || '',
        description: document.getElementById('description').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        reporter: currentUser.name,
        email: currentUser.email,
        status: 'Queued',
        time: new Date().toLocaleString()
      };

      let savedReport;
      try {
        const data = await authRequest('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!data.report) throw new Error('The API did not return the saved incident report.');
        savedReport = data.report;
      } catch (error) {
        showMessage(messageEl, error.message || 'Unable to submit the report.', false);
        return;
      }
      const reports = JSON.parse(localStorage.getItem('cerasIncidentReports') || '[]');
      reports.unshift(savedReport);
      localStorage.setItem('cerasIncidentReports', JSON.stringify(reports));
      renderReporterReports();
      renderReporterIncidentMap();
      showMessage(messageEl, 'Your incident report has been submitted and sent to CERAS dispatch.', true);
      form.reset();
      const locationStatus = document.getElementById('locationStatus');
      if (locationStatus) {
        locationStatus.textContent = '';
      }
    });
  }

  setReporterAccessState();
  renderReporterReports();
  initializeReporterChat();
  initializeReporterReporting();

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  async function initAdminDashboard() {
    const dashboard = document.getElementById('adminDashboard');
    const accessMessage = document.getElementById('adminAccessMessage');
    if (!dashboard || !accessMessage) return;

    const isAdmin = currentUser?.role === 'admin';
    dashboard.classList.toggle('hidden', !isAdmin);
    accessMessage.classList.toggle('hidden', isAdmin);

    if (!isAdmin) return;

    const adminName = document.getElementById('adminName');
    const adminEmail = document.getElementById('adminEmail');
    if (adminName) adminName.textContent = currentUser.name || 'Administrator';
    if (adminEmail) adminEmail.textContent = currentUser.email || 'admin@ceras.com';

    await renderAdminReports();

    const refreshButton = document.getElementById('adminRefreshReports');
    if (refreshButton && !refreshButton.dataset.bound) {
      refreshButton.dataset.bound = 'true';
      refreshButton.addEventListener('click', renderAdminReports);
    }
  }

  async function renderAdminReports() {
    const reportList = document.getElementById('adminReportList');
    const agencyGrid = document.getElementById('adminAgencyGrid');
    const userList = document.getElementById('adminUserList');
    const priorityList = document.getElementById('adminPriorityList');
    const auditList = document.getElementById('adminAuditList');
    if (!reportList || !agencyGrid) return;

    reportList.innerHTML = '<div class="admin-empty-state">Loading reports...</div>';
    if (userList) userList.innerHTML = '<div class="admin-empty-state">Loading accounts...</div>';
    if (auditList) auditList.innerHTML = '<div class="admin-empty-state">Loading audit trail...</div>';

    let reports = [];
    let users = [];
    let auditLogs = [];
    let sessions = 0;
    let security = null;
    let apiOnline = false;
    let generatedAt = new Date().toISOString();
    try {
      const data = await authRequest('/api/admin/summary');
      reports = Array.isArray(data.reports) ? data.reports : [];
      users = Array.isArray(data.users) ? data.users : [];
      auditLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];
      sessions = Number(data.sessions || 0);
      security = data.security || null;
      generatedAt = data.generatedAt || generatedAt;
      apiOnline = true;
    } catch {
      reports = JSON.parse(localStorage.getItem('cerasIncidentReports') || '[]');
    }

    const totalReports = document.getElementById('adminTotalReports');
    const queuedReports = document.getElementById('adminQueuedReports');
    const platformStatus = document.getElementById('adminPlatformStatus');
    const lastSync = document.getElementById('adminLastSync');
    const commandStatus = document.getElementById('adminCommandStatus');
    const commandSummary = document.getElementById('adminCommandSummary');
    const passwordPolicy = document.getElementById('adminPasswordPolicy');
    const hashPolicy = document.getElementById('adminHashPolicy');
    const sessionCount = document.getElementById('adminSessionCount');
    const queuedCount = reports.filter((report) => (report.status || 'Queued').toLowerCase() === 'queued').length;

    if (totalReports) totalReports.textContent = String(reports.length);
    if (queuedReports) queuedReports.textContent = String(queuedCount);
    if (platformStatus) platformStatus.textContent = apiOnline ? 'Live' : 'Offline';
    if (lastSync) lastSync.textContent = apiOnline ? `Synced ${new Date(generatedAt).toLocaleTimeString()}` : 'Showing local fallback';
    if (commandStatus) commandStatus.textContent = queuedCount ? `${queuedCount} queued report${queuedCount === 1 ? '' : 's'} need review` : 'No queued reports';
    if (commandSummary) commandSummary.textContent = apiOnline
      ? `Connected to the CERAS API with ${users.length || 'no'} account${users.length === 1 ? '' : 's'} loaded.`
      : 'The dashboard is using local browser data because the API summary could not be reached.';
    if (passwordPolicy) passwordPolicy.textContent = security ? `Strong password policy: ${security.passwordMinLength}+ characters` : 'Strong password policy active';
    if (hashPolicy) hashPolicy.textContent = security ? `${security.passwordHash} hashing at ${security.passwordHashIterations} iterations` : 'PBKDF2 password hashing active';
    if (sessionCount) sessionCount.textContent = `${sessions} active API session${sessions === 1 ? '' : 's'}`;

    const serviceLabels = {
      police: 'Police',
      fire: 'Fire',
      ambulance: 'Ambulance',
      nadmo: 'NADMO'
    };
    const servicePages = {
      police: 'ghana-police.html',
      fire: 'fire-service.html',
      ambulance: 'ambulance.html',
      nadmo: 'nadmo.html'
    };

    agencyGrid.innerHTML = Object.entries(serviceLabels).map(([key, label]) => {
      const count = reports.filter((report) => report.service === key).length;
      return `
        <article class="admin-agency-card">
          <span>${label}</span>
          <strong>${count}</strong>
          <p>${count === 1 ? 'report' : 'reports'} routed</p>
          <a href="${servicePages[key]}">Open desk</a>
        </article>
      `;
    }).join('');

    if (userList) {
      if (!users.length) {
        userList.innerHTML = '<div class="admin-empty-state">Account data is available after the API summary loads.</div>';
      } else {
        const roleOrder = ['admin', 'police', 'fire', 'ambulance', 'nadmo', 'user'];
        userList.innerHTML = users
          .slice()
          .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role))
          .map((user) => `
            <article class="admin-user-item">
              <div class="user-avatar">${escapeHtml(getInitials(user.name || user.email))}</div>
              <div>
                <strong>${escapeHtml(user.name || 'Unnamed account')}</strong>
                <span>${escapeHtml(user.email || 'No email')}</span>
              </div>
              <span class="admin-chip">${escapeHtml(user.role || 'user')}</span>
            </article>
          `).join('');
      }
    }

    if (priorityList) {
      const priorityReports = reports.filter((report) => {
        const text = `${report.type || ''} ${report.title || ''} ${report.description || ''}`.toLowerCase();
        return /(fire|medical|flood|crime|accident|urgent|critical|emergency)/.test(text);
      }).slice(0, 4);
      priorityList.innerHTML = priorityReports.length
        ? priorityReports.map((report) => `
          <article class="admin-priority-item">
            <strong>${escapeHtml(report.title || report.type || 'Priority report')}</strong>
            <span>${escapeHtml(serviceLabels[report.service] || report.service || 'Unassigned')}</span>
            <small>${escapeHtml(report.location || 'Location pending')}</small>
          </article>
        `).join('')
        : '<div class="admin-empty-state">No priority items yet.</div>';
    }

    if (auditList) {
      if (!auditLogs.length) {
        auditList.innerHTML = '<div class="admin-empty-state">No account activity recorded yet.</div>';
      } else {
        auditList.innerHTML = auditLogs.slice(0, 8).map((entry) => {
          const name = entry.name || entry.userName || 'Unknown user';
          const email = entry.email || 'unknown@ceras.local';
          const type = (entry.eventType || 'activity').replace(/_/g, ' ');
          const source = entry.source || 'system';
          const createdAt = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Recent activity';
          return `
            <article class="admin-audit-item">
              <div class="admin-report-meta">
                <span class="admin-chip">${escapeHtml(type)}</span>
                <span class="admin-chip">${escapeHtml(source)}</span>
              </div>
              <strong>${escapeHtml(name)}</strong>
              <span>${escapeHtml(email)}</span>
              <small>${escapeHtml(createdAt)}</small>
            </article>
          `;
        }).join('');
      }
    }

    renderAdminIncidentMap(reports, serviceLabels);

    if (!reports.length) {
      reportList.innerHTML = '<div class="admin-empty-state">No reports have been submitted yet. Submit a test report to see the queue fill in.</div>';
      return;
    }

    reportList.innerHTML = reports.slice(0, 8).map((report) => {
      const service = serviceLabels[report.service] || report.service || 'Unassigned';
      const title = report.title || report.type || 'Incident report';
      const location = report.location || 'Location not provided';
      const details = report.description || report.summary || 'No description provided.';
      const submittedAt = report.createdAt || report.time || 'Recently';
      return `
        <article class="admin-report-item">
          <div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(location)}</p>
            <p>${escapeHtml(details)}</p>
            <div class="admin-report-meta">
              <span class="admin-chip alert">${escapeHtml(report.status || 'Queued')}</span>
              <span class="admin-chip">${escapeHtml(service)}</span>
              ${report.reporter ? `<span class="admin-chip">${escapeHtml(report.reporter)}</span>` : ''}
            </div>
          </div>
          <time class="admin-report-time">${escapeHtml(submittedAt)}</time>
        </article>
      `;
    }).join('');
  }

  function renderAdminIncidentMap(reports, serviceLabels) {
    const mapContainer = document.getElementById('adminIncidentMap');
    const mapCount = document.getElementById('adminMapCount');
    if (!mapContainer) return;

    const points = reports
      .filter((report) => {
        const latitude = Number(report.latitude);
        const longitude = Number(report.longitude);
        return Number.isFinite(latitude) && Number.isFinite(longitude) &&
          latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 &&
          report.latitude !== '' && report.longitude !== '';
      })
      .map((report) => ({
        title: report.title || report.type || 'Incident report',
        service: serviceLabels[report.service] || report.service || 'Unassigned',
        location: report.location || 'Location pending',
        lat: Number(report.latitude),
        lng: Number(report.longitude)
      }));

    if (mapContainer._adminMap) {
      mapContainer._adminMap.remove();
      mapContainer._adminMap = null;
    }
    if (mapCount) {
      mapCount.textContent = points.length
        ? `${points.length} mapped incident${points.length === 1 ? '' : 's'}`
        : 'No GPS reports yet';
    }

    mapContainer.innerHTML = '';
    mapContainer.dataset.ready = 'loading';

    loadOpenMapsLibrary().then(() => {
      if (!window.L || !mapContainer) return;

      const { L } = window;
      const map = L.map(mapContainer, { zoomControl: true, scrollWheelZoom: true });
      mapContainer._adminMap = map;
      if (points.length) {
        const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
        map.fitBounds(bounds, { padding: [28, 28] });
      } else {
        map.setView([7.9465, -1.0232], 6);
      }

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19,
        maxNativeZoom: 19
      }).addTo(map);

      points.forEach((point) => {
        L.marker([point.lat, point.lng])
          .addTo(map)
          .bindPopup(`<strong>${escapeHtml(point.title)}</strong><br>${escapeHtml(point.service)}<br>${escapeHtml(point.location)}`);
      });

      mapContainer.dataset.ready = 'true';
      setTimeout(() => map.invalidateSize(), 250);
    }).catch(() => {
      mapContainer.dataset.ready = 'false';
      mapContainer.innerHTML = '<div class="map-load-error">Map library unavailable. Check your internet connection and reload.</div>';
    });
  }

  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    const resetStepEmail = document.getElementById('resetStepEmail');
    const resetStepCode = document.getElementById('resetStepCode');
    const resetStepNewPassword = document.getElementById('resetStepNewPassword');
    const resetSubmitBtn = document.getElementById('resetSubmitBtn');
    const resetEmailInput = document.getElementById('resetEmail');
    const resetCodeInput = document.getElementById('resetCode');
    const newPasswordInput = document.getElementById('newPassword');
    const resetFormMessage = document.getElementById('resetFormMessage');

    let resetFlowStage = 'email';
    let pendingResetEmail = '';
    let pendingResetCode = '';

    function updateResetFlow(stage) {
      resetFlowStage = stage;
      const emailVisible = stage === 'email';
      const codeVisible = stage === 'code';
      const passwordVisible = stage === 'password';

      if (resetStepEmail) resetStepEmail.classList.toggle('hidden', !emailVisible);
      if (resetStepCode) resetStepCode.classList.toggle('hidden', !codeVisible && !passwordVisible);
      if (resetStepNewPassword) resetStepNewPassword.classList.toggle('hidden', !passwordVisible);
      if (resetSubmitBtn) {
        resetSubmitBtn.textContent = stage === 'email' ? 'Send reset code' : stage === 'code' ? 'Verify code' : 'Update password';
      }
    }

    resetPasswordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = (resetEmailInput?.value || '').trim().toLowerCase();
      const code = (resetCodeInput?.value || '').trim();
      const newPassword = newPasswordInput?.value || '';

      if (resetFlowStage === 'email') {
        if (!email) {
          showMessage(resetFormMessage, 'Please enter your email.', false);
          return;
        }

        pendingResetEmail = email;
        pendingResetCode = Math.floor(100000 + Math.random() * 900000).toString();
        updateResetFlow('code');
        showMessage(resetFormMessage, `Verification code sent to ${email}. Demo code: ${pendingResetCode}`, true);
        return;
      }

      if (resetFlowStage === 'code') {
        if (!code) {
          showMessage(resetFormMessage, 'Enter the 6-digit code you received.', false);
          return;
        }

        if (code !== pendingResetCode) {
          showMessage(resetFormMessage, 'The code is incorrect. Please try again.', false);
          return;
        }

        updateResetFlow('password');
        showMessage(resetFormMessage, 'Code verified. Choose a new password.', true);
        return;
      }

      if (resetFlowStage === 'password') {
        if (!newPassword || newPassword.length < 14) {
          showMessage(resetFormMessage, 'Use a password with at least 14 characters.', false);
          return;
        }

        showMessage(resetFormMessage, 'Password reset requires the secure account service.', false);

        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1000);
      }
    });
  }

  function loadProfileData() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    const profileUser = currentUser;
    if (!profileUser) {
      window.location.href = 'login.html';
      return;
    }

    const fullName = document.getElementById('profileFullName');
    const email = document.getElementById('profileEmail');
    const phone = document.getElementById('profilePhone');
    const location = document.getElementById('profileLocation');
    const role = document.getElementById('profileRole');
    const avatar = document.getElementById('profileAvatar');
    const heading = document.getElementById('profileHeaderName');
    const emailLabel = document.getElementById('profileHeaderEmail');

    const initial = getInitials(profileUser.name || profileUser.email || 'CU');
    if (avatar) avatar.textContent = initial;
    if (heading) heading.textContent = profileUser.name || 'User';
    if (emailLabel) emailLabel.textContent = profileUser.email || '';

    if (fullName) fullName.value = profileUser.name || '';
    if (email) email.value = profileUser.email || '';
    if (phone) phone.value = profileUser.phone || '';
    if (location) location.value = profileUser.location || '';
    if (role) role.value = profileUser.role || 'user';

    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const updatedUser = {
        ...profileUser,
        name: document.getElementById('profileFullName').value.trim(),
        email: document.getElementById('profileEmail').value.trim().toLowerCase(),
        phone: document.getElementById('profilePhone').value.trim(),
        location: document.getElementById('profileLocation').value.trim(),
        role: profileUser.role
      };

      authRequest('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedUser) })
        .then(({ user }) => { currentUser = user; })
        .catch((error) => showMessage(document.getElementById('profileMessage'), error.message, false));

      const messageEl = document.getElementById('profileMessage');
      if (messageEl) {
        messageEl.textContent = 'Profile updated successfully.';
        messageEl.style.color = 'var(--ceras-navy)';
      }

      if (heading) heading.textContent = updatedUser.name;
      if (emailLabel) emailLabel.textContent = updatedUser.email;
      if (avatar) avatar.textContent = getInitials(updatedUser.name || updatedUser.email || 'CU');
    });
  }

  loadProfileData();

  function getAgencyMeta(pageKey) {
    const meta = {
      nadmo: {
        label: 'NADMO',
        summaryCards: [
          { label: 'Active incidents', value: '14' },
          { label: 'Shelters open', value: '8' },
          { label: 'Avg. arrival', value: '18 min' }
        ],
        assignments: [
          { unit: 'Relay Unit 4', region: 'Tamale', eta: '12 min', status: 'En route' },
          { unit: 'Shelter Team 2', region: 'Bawku', eta: '20 min', status: 'On site' },
          { unit: 'Road Recovery Crew', region: 'Keta', eta: '9 min', status: 'Preparing' }
        ],
        chat: [
          { sender: 'Reporter', text: 'Floodwater is rising near the market road.', time: '2 min ago' },
          { sender: 'Dispatch', text: 'We have a team already moving to the area.', time: '1 min ago' }
        ]
      },
      police: {
        label: 'Police',
        summaryCards: [
          { label: 'Open cases', value: '27' },
          { label: 'Patrol teams', value: '9' },
          { label: 'Avg. response', value: '11 min' }
        ],
        assignments: [
          { unit: 'Patrol 12', region: 'Accra Central', eta: '7 min', status: 'En route' },
          { unit: 'Rapid Response 3', region: 'Tema', eta: '15 min', status: 'At scene' },
          { unit: 'Crime Unit 5', region: 'Kumasi', eta: '22 min', status: 'Dispatching' }
        ],
        chat: [
          { sender: 'Reporter', text: 'A robbery happened near the bus terminal.', time: '3 min ago' },
          { sender: 'Dispatch', text: 'Please keep clear of the area while officers arrive.', time: 'just now' }
        ]
      },
      ambulance: {
        label: 'Ambulance',
        summaryCards: [
          { label: 'Critical cases', value: '5' },
          { label: 'Units staffed', value: '12' },
          { label: 'Avg. arrival', value: '8 min' }
        ],
        assignments: [
          { unit: 'Medic Unit 2', region: 'Korle Bu', eta: '6 min', status: 'On route' },
          { unit: 'Air Support Ready', region: 'Cape Coast', eta: '14 min', status: 'Standby' },
          { unit: 'Rapid Transit 7', region: 'Ho', eta: '11 min', status: 'Preparing' }
        ],
        chat: [
          { sender: 'Reporter', text: 'We need urgent assistance near the highway bridge.', time: '1 min ago' },
          { sender: 'Dispatch', text: 'Ambulance is leaving the base now. Keep the location visible.', time: 'now' }
        ]
      },
      fire: {
        label: 'Fire Service',
        summaryCards: [
          { label: 'Active alarms', value: '6' },
          { label: 'Crew onsite', value: '11' },
          { label: 'Avg. arrival', value: '9 min' }
        ],
        assignments: [
          { unit: 'Engine 2', region: 'Takoradi', eta: '8 min', status: 'Containment' },
          { unit: 'Rescue Team 3', region: 'Sunyani', eta: '14 min', status: 'Deploying' },
          { unit: 'Hazmat Crew', region: 'Koforidua', eta: '12 min', status: 'Assessing' }
        ],
        chat: [
          { sender: 'Reporter', text: 'There is smoke coming from a warehouse near the market.', time: '2 min ago' },
          { sender: 'Dispatch', text: 'Keep everyone clear and give the exact entrance point if possible.', time: 'now' }
        ]
      }
    };
    return meta[pageKey] || meta.nadmo;
  }

  function getAgencyCaseCatalog() {
    return {
      nadmo: [
        {
          title: 'Flooding in Northern Region',
          location: 'Tamale',
          status: 'Escalated',
          priority: 'High',
          reportedAt: '08:40 AM',
          summary: 'Overflowing riverbanks are threatening homes and roads in low-lying communities.',
          detail: 'Multiple households remain at risk as local teams coordinate rescue routes, emergency shelter readiness, and flood barriers along the river corridor.',
          responseTeam: 'Relief Unit 4 · Shelter Team 2 · Community volunteers',
          latestUpdate: 'Access routes are being cleared and essential supplies are being staged near the market zone.',
          timeline: [
            '08:14 AM — Initial flood alert received from local residents.',
            '08:26 AM — NADMO team dispatched to the affected river corridor.',
            '08:40 AM — Resident welfare team activated emergency shelter checks.',
            '09:05 AM — Evacuation support vehicles are re-routing through safer access roads.'
          ],
          actions: ['Open shelters', 'Clear access routes', 'Coordinate volunteer support']
        },
        {
          title: 'Relief shelter review',
          location: 'Bawku',
          status: 'Monitoring',
          priority: 'Medium',
          reportedAt: '06:15 AM',
          summary: 'Temporary shelter facilities are active and receiving displaced families from flood-hit areas.',
          detail: 'Shelter capacity is stable and daily food supply checks are underway while regional teams assess weather conditions and service access.',
          responseTeam: 'Shelter support crew · Welfare desk · Medical outreach',
          latestUpdate: 'Five additional families arrived overnight and have been placed in designated care spaces.',
          timeline: [
            '05:48 AM — Shelter occupancy audit started.',
            '06:12 AM — Medical team contacted to review continuity of care.',
            '06:30 AM — Volunteers begin bedding and food distribution.',
            '07:10 AM — Weather monitor remains stable but continues to be tracked.'
          ],
          actions: ['Track shelter capacity', 'Check food stocks', 'Continue medical updates']
        },
        {
          title: 'Evacuation route assessment',
          location: 'Keta',
          status: 'Active',
          priority: 'High',
          reportedAt: '07:35 AM',
          summary: 'NADMO teams are checking safe access routes for vehicles and local residents.',
          detail: 'District teams are verifying road integrity and travel conditions for emergency evacuation while keeping residents informed of the safest route.',
          responseTeam: 'Road recovery crew · Logistics desk · Local ward officers',
          latestUpdate: 'A secondary route remains under review due to soft ground conditions after overnight rain.',
          timeline: [
            '07:05 AM — Route check request lodged for coastal communities.',
            '07:18 AM — Local authorities confirmed traffic interruption on the main corridor.',
            '07:35 AM — Recovery team dispatched to test alternate routes.',
            '08:00 AM — Route safety update being shared with local residents.'
          ],
          actions: ['Inspect road conditions', 'Review alternate routes', 'Issue public notice']
        },
        {
          title: 'Community preparedness drill',
          location: 'Wa',
          status: 'Planned',
          priority: 'Medium',
          reportedAt: '09:10 AM',
          summary: 'District officers are preparing equipment and volunteers for storm season readiness.',
          detail: 'Pre-incident planning is underway to ensure volunteer teams remain aligned with a coordinated emergency response plan for the next weather cycle.',
          responseTeam: 'Preparedness officers · Volunteer coordinator · District office',
          latestUpdate: 'Equipment checklist has been finalized and teams are scheduled for a field rehearsal this afternoon.',
          timeline: [
            '08:55 AM — District office approved preparedness rehearsal.',
            '09:10 AM — Volunteers assigned to drill roles.',
            '09:35 AM — Equipment checklist circulated to all team leads.',
            '10:15 AM — Rehearsal time confirmed for the afternoon shift.'
          ],
          actions: ['Prepare equipment', 'Coordinate volunteer schedule', 'Review emergency plan']
        }
      ],
      police: [
        {
          title: 'Armed robbery case',
          location: 'Accra Central',
          status: 'Under investigation',
          priority: 'Critical',
          reportedAt: '11:20 AM',
          summary: 'Two suspects are being tracked after a shop robbery and assault report.',
          detail: 'Officers secured the immediate scene and are reviewing CCTV and witness statements to narrow down the suspect route and identify escape vehicles.',
          responseTeam: 'Patrol Unit 12 · Crime Unit 5 · Forensics team',
          latestUpdate: 'A suspect vehicle was seen near the bus terminal and is now being actively monitored by patrol teams.',
          timeline: [
            '10:51 AM — Robbery report received from local vendor.',
            '11:02 AM — Patrol units secured the perimeter and began witness interviews.',
            '11:20 AM — Crime unit assigned to evidence review and suspect tracing.',
            '11:48 AM — CCTV route analysis underway.'
          ],
          actions: ['Review CCTV footage', 'Track suspect route', 'Interview witnesses']
        },
        {
          title: 'Traffic accident response',
          location: 'Tema',
          status: 'Patrol active',
          priority: 'High',
          reportedAt: '07:55 AM',
          summary: 'Officers are managing road closures and witness statements after a serious collision.',
          detail: 'Traffic officers are coordinating detours and collecting driver statements while emergency services assess any injuries and clear the incident area.',
          responseTeam: 'Traffic police · Emergency liaison · Incident desk',
          latestUpdate: 'One lane is reopened for local transit while investigators continue documenting the scene.',
          timeline: [
            '07:18 AM — Accident reported near the interchange.',
            '07:35 AM — Patrol units closed lanes and redirected traffic.',
            '07:55 AM — Detailed statement collection initiated.',
            '08:22 AM — Scene review continues with a traffic safety assessment.'
          ],
          actions: ['Control traffic flow', 'Collect evidence', 'Assess road reopening']
        },
        {
          title: 'Missing person report',
          location: 'Kumasi',
          status: 'Case open',
          priority: 'High',
          reportedAt: '10:05 AM',
          summary: 'Family members reported a missing teenager; patrol units are checking nearby transit points.',
          detail: 'Local patrol teams are tracing transport hubs and speaking with nearby residents to confirm the last known route of the missing individual.',
          responseTeam: 'Patrol Unit 7 · Family liaison · Community support team',
          latestUpdate: 'A recent sighting has been reported near the central market and is being validated by officers.',
          timeline: [
            '09:42 AM — Missing persons alert received.',
            '09:55 AM — Patrol teams begin checks at stations and bus terminals.',
            '10:05 AM — Case file opened and community outreach initiated.',
            '10:40 AM — Additional witness leads are being reviewed.'
          ],
          actions: ['Track transit routes', 'Speak with witnesses', 'Update family liaison']
        },
        {
          title: 'Public disturbance alert',
          location: 'Cape Coast',
          status: 'Crowd control',
          priority: 'Medium',
          reportedAt: '04:15 PM',
          summary: 'Police are monitoring a protest and coordinating with local authorities to maintain safety.',
          detail: 'Officers are maintaining visible presence and directing crowd flow to prevent escalation while local authorities monitor public access and emergency exits.',
          responseTeam: 'Public order team · Motorized patrol · Local administration liaison',
          latestUpdate: 'Crowd movement is stable and patrol units continue to monitor key intersections around the civic square.',
          timeline: [
            '03:52 PM — Public gathering reported near the civic square.',
            '04:05 PM — Public order team deployed to key access points.',
            '04:15 PM — Coordinated briefing with district liaison completed.',
            '05:00 PM — Patrol route continues with active monitoring.'
          ],
          actions: ['Monitor crowd movement', 'Coordinate with administration', 'Protect access routes']
        }
      ],
      ambulance: [
        {
          title: 'Cardiac emergency response',
          location: 'Korle Bu',
          status: 'Critical',
          priority: 'Critical',
          reportedAt: '09:05 AM',
          summary: 'Emergency response team transported an unstable patient to the nearest emergency care unit.',
          detail: 'Advanced life support was initiated on site and transport was prioritized to the nearest critical care center to avoid delay.',
          responseTeam: 'Medic Unit 2 · Emergency care team · Hospital liaison',
          latestUpdate: 'The patient remained stable during transport and arrived at the emergency unit with monitoring in progress.',
          timeline: [
            '08:51 AM — Cardiac emergency call received.',
            '08:58 AM — Advanced life support team dispatched.',
            '09:05 AM — Patient stabilized and transferred to emergency care.',
            '09:22 AM — Hospital handover completed.'
          ],
          actions: ['Stabilize patient', 'Coordinate hospital transfer', 'Prepare handover report']
        },
        {
          title: 'Maternal emergency transfer',
          location: 'Cape Coast',
          status: 'Stabilizing',
          priority: 'Critical',
          reportedAt: '08:10 AM',
          summary: 'Paramedics responded to a high-risk maternity incident and stabilized the patient en route.',
          detail: 'The ambulance team maintained continuous monitoring and prioritized the fastest route to a high-capacity maternity facility.',
          responseTeam: 'Rapid response crew · Maternal care paramedic · Hospital transfer team',
          latestUpdate: 'Patient remains stable under observation and is heading to a specialist maternity unit.',
          timeline: [
            '07:46 AM — Emergency maternity alert received.',
            '07:58 AM — Crew assembled and left the base.',
            '08:10 AM — Patient stabilized and monitored throughout transport.',
            '08:35 AM — Specialist hospital handover arranged.'
          ],
          actions: ['Administer emergency support', 'Transport to specialist unit', 'Share handover notes']
        },
        {
          title: 'Road traffic trauma incident',
          location: 'Ho',
          status: 'Active',
          priority: 'High',
          reportedAt: '12:35 PM',
          summary: 'Ambulance crew attended a multi-vehicle crash with multiple injured persons.',
          detail: 'Multi-vehicle collision required triage and coordination with local emergency response teams to prioritize the most severely injured victims.',
          responseTeam: 'Rapid Transit 7 · Trauma care team · Scene support crew',
          latestUpdate: 'Two patients have been stabilized and transferred, with additional assessments continuing at the scene.',
          timeline: [
            '12:18 PM — Crash report received from local traffic control.',
            '12:25 PM — Ambulance dispatched with trauma support.',
            '12:35 PM — Triage and stabilization underway.',
            '01:00 PM — Hospital transfer updates continuing.'
          ],
          actions: ['Triage patients', 'Coordinate with police', 'Transfer to facility']
        },
        {
          title: 'Severe asthma case',
          location: 'Takoradi',
          status: 'Transported',
          priority: 'High',
          reportedAt: '06:45 PM',
          summary: 'Rapid response ambulance moved a patient to advanced respiratory care after sudden deterioration.',
          detail: 'Oxygen support and respiratory monitoring were maintained throughout the transfer to ensure smooth coordination with the receiving care team.',
          responseTeam: 'Medic Unit 5 · Respiratory support crew · Receiving hospital team',
          latestUpdate: 'The patient reached respiratory care and was handed over for continued treatment and monitoring.',
          timeline: [
            '06:10 PM — Asthma deterioration reported by family.',
            '06:26 PM — Ambulance crew dispatched with respiratory support.',
            '06:45 PM — Patient moved for advanced care.',
            '07:10 PM — Handover completed at the treatment facility.'
          ],
          actions: ['Manage respiratory support', 'Transport for specialist care', 'Complete patient transfer notes']
        }
      ],
      fire: [
        {
          title: 'Warehouse fire incident',
          location: 'Takoradi',
          status: 'Contained',
          priority: 'High',
          reportedAt: '02:10 PM',
          summary: 'Fire crews controlled the blaze before it reached nearby storage facilities.',
          detail: 'Initial response teams extinguished the main fire and managed the surrounding area to prevent secondary ignition and protect nearby structures.',
          responseTeam: 'Engine 2 · Rescue Team 1 · Fire safety officers',
          latestUpdate: 'Hotspot checks remain active while remaining crews monitor for smoke flare-ups around the warehouse perimeter.',
          timeline: [
            '01:42 PM — Fire alarm received from industrial premises.',
            '01:52 PM — Engine crew arrived and began suppression.',
            '02:10 PM — Fire contained with secondary safety controls in place.',
            '02:45 PM — Monitoring continues around the perimeter.'
          ],
          actions: ['Suppress flames', 'Check perimeter for smoke', 'Compile final fire report']
        },
        {
          title: 'Electricity-related fire',
          location: 'Sunyani',
          status: 'Active',
          priority: 'High',
          reportedAt: '07:40 AM',
          summary: 'Fire teams are containing a power line fire near a residential block.',
          detail: 'Crews are managing a fuelled electrical fault while maintaining safe access and coordinating with utility support teams for a controlled power shutdown.',
          responseTeam: 'Rescue Team 3 · Utility liaison · Safety officers',
          latestUpdate: 'Power has been isolated in the affected section and crews are clearing smoke from the immediate area.',
          timeline: [
            '07:15 AM — Electrical fire reported in a residential corridor.',
            '07:26 AM — Crew dispatched with utility support.',
            '07:40 AM — Power isolated in the affected zone.',
            '08:02 AM — Smoke control and safe area monitoring remain in place.'
          ],
          actions: ['Isolate electrical lines', 'Contain fire spread', 'Monitor residential safety']
        },
        {
          title: 'Gas leak response',
          location: 'Koforidua',
          status: 'Monitoring',
          priority: 'Critical',
          reportedAt: '04:55 PM',
          summary: 'Hazard teams are ventilating the area and checking for additional pressure leaks.',
          detail: 'Fire crews are maintaining safe perimeters and testing gas levels while monitoring the surrounding area for any renewed leak or ignition risk.',
          responseTeam: 'Hazmat Crew · Safety officers · Gas utility team',
          latestUpdate: 'Ventilation remains active and gas monitors continue to show a downward trend in concentration.',
          timeline: [
            '04:26 PM — Gas leak alert received from a commercial block.',
            '04:35 PM — Hazmat team reached the scene and created a safety perimeter.',
            '04:55 PM — Ventilation and leak testing began.',
            '05:20 PM — Gas levels are being monitored for safe reopening.'
          ],
          actions: ['Ventilate building', 'Test gas concentration', 'Establish re-entry safety']
        },
        {
          title: 'Building rescue operation',
          location: 'Tamale',
          status: 'Underway',
          priority: 'Critical',
          reportedAt: '06:05 PM',
          summary: 'Firefighters are coordinating rescue efforts in a partially collapsed commercial structure.',
          detail: 'The response team is navigating a structurally compromised building while prioritizing trapped occupants and maintaining stable rescue access.',
          responseTeam: 'Rescue Team 4 · Search crew · Structural safety team',
          latestUpdate: 'Search teams report a secure path is now established for occupant extraction and debris removal.',
          timeline: [
            '05:43 PM — Building collapse alert reported.',
            '05:56 PM — Firefighters established an access route and search perimeter.',
            '06:05 PM — Rescue operation underway.',
            '06:35 PM — Structural assessment continues with the extraction plan.'
          ],
          actions: ['Search for occupants', 'Stabilize structure', 'Coordinate rescue access']
        }
      ]
    };
  }

  function getAgencyPageKey(pageName) {
    const normalizedName = (pageName || '').toLowerCase();
    if (normalizedName === 'nadmo.html') return 'nadmo';
    if (normalizedName === 'ghana-police.html') return 'police';
    if (normalizedName === 'ambulance.html') return 'ambulance';
    return 'fire';
  }

  function renderAgencyReports() {
    const reportContainer = document.getElementById('agencyReports');
    if (!reportContainer) return;

    const pageKey = getAgencyPageKey(location.pathname.split('/').pop());
    const reports = getAgencyCaseCatalog()[pageKey] || getAgencyCaseCatalog().nadmo;

    reportContainer.innerHTML = reports.map((report, index) => `
      <article class="agency-report-card">
        <div class="report-card-topline">
          <span class="report-badge status-${report.status.toLowerCase().replace(/\s+/g, '-')}">${report.status}</span>
          <span class="report-priority priority-${report.priority.toLowerCase()}">${report.priority}</span>
        </div>
        <h3>${report.title}</h3>
        <p><strong>Location:</strong> ${report.location}</p>
        ${report.latitude && report.longitude ? `<p><strong>Exact GPS:</strong> ${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}</p>` : ''}
        <p><strong>Reported:</strong> ${report.reportedAt}</p>
        <p>${report.summary}</p>
        <button class="btn btn-secondary report-detail-btn" type="button" data-role="${pageKey}" data-case-id="${index}">View full case</button>
      </article>
    `).join('');

    reportContainer.querySelectorAll('.report-detail-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const role = button.dataset.role;
        const caseId = button.dataset.caseId;
        window.location.href = `agency-detail.html?role=${role}&case=${caseId}`;
      });
    });
  }

  function loadOpenMapsLibrary() {
    if (window.L) return Promise.resolve();
    if (openMapsLibraryPromise) return openMapsLibraryPromise;

    openMapsLibraryPromise = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('OpenMap tiles failed to load.'));
      document.body.appendChild(script);
    });

    return openMapsLibraryPromise;
  }

  async function renderAgencyMap(pageKey) {
    const mapContainer = document.getElementById(`agencyMap-${pageKey}`);
    if (!mapContainer || mapContainer.dataset.ready === 'true') return;
    const mapStatus = document.getElementById(`agencyMapStatus-${pageKey}`);
    let reports = [];
    let apiUnavailable = false;
    try {
      const data = await authRequest('/api/reports');
      reports = Array.isArray(data.reports) ? data.reports : [];
    } catch {
      apiUnavailable = true;
    }

    const points = reports.filter((report) => {
      const latitude = Number(report.latitude);
      const longitude = Number(report.longitude);
      return report.latitude !== '' && report.longitude !== '' &&
        Number.isFinite(latitude) && Number.isFinite(longitude) &&
        latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
    });
    if (mapStatus) {
      mapStatus.textContent = apiUnavailable
        ? 'Live reports unavailable'
        : `${points.length} incident location${points.length === 1 ? '' : 's'}`;
    }

    try {
      await loadOpenMapsLibrary();
      if (!window.L || !mapContainer) return;

      const { L } = window;
      const map = L.map(mapContainer, { zoomControl: true, scrollWheelZoom: true });
      if (points.length) {
        const bounds = L.latLngBounds(points.map((point) => [Number(point.latitude), Number(point.longitude)]));
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
      } else {
        map.setView([7.9465, -1.0232], 6);
      }

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 2,
        maxZoom: 19,
        maxNativeZoom: 19
      }).addTo(map);

      points.forEach((report) => {
        const marker = L.marker([Number(report.latitude), Number(report.longitude)]).addTo(map);
        marker.bindPopup(`<strong>${escapeHtml(report.title || 'Incident report')}</strong><br>${escapeHtml(report.location || 'Location not provided')}<br>${escapeHtml(report.status || 'Queued')}`);
      });

      mapContainer.dataset.ready = 'true';
      setTimeout(() => map.invalidateSize(), 250);
    } catch {
      mapContainer.innerHTML = '<div class="map-load-error">Map library unavailable. Check your internet connection and reload.</div>';
    }
  }

  function renderAgencyOperations() {
    const dashboard = document.getElementById('agencyDashboard');
    if (!dashboard) return;

    const pageName = (location.pathname.split('/').pop() || '').toLowerCase();
    const pageKey = getAgencyPageKey(pageName);
    const meta = getAgencyMeta(pageKey);
    const reports = getAgencyCaseCatalog()[pageKey] || getAgencyCaseCatalog().nadmo;
    const activeCase = reports[0];

    const existingWorkspace = dashboard.querySelector('.agency-workspace');
    if (existingWorkspace) existingWorkspace.remove();

    const shouldShowChat = sessionStorage.getItem(`cerasAgencyFollowUp_${pageKey}`) === 'true';
    const cachedMessages = JSON.parse(sessionStorage.getItem(`cerasAgencyChat_${pageKey}`) || 'null') || meta.chat;
    const messageMarkup = cachedMessages.map((item) => `
      <div class="chat-bubble ${item.sender === 'Dispatch' ? 'dispatch' : 'reporter'}">
        <strong>${item.sender}</strong>
        <p>${item.text}</p>
        <span>${item.time}</span>
      </div>
    `).join('');

    dashboard.insertAdjacentHTML('beforeend', `
      <div class="agency-workspace">
        <div class="agency-overview">
          ${meta.summaryCards.map((card) => `
            <div class="agency-stat-card">
              <span>${card.label}</span>
              <strong>${card.value}</strong>
            </div>
          `).join('')}
        </div>

        <div class="agency-operations-layout">
          <section class="agency-card agency-brief-card">
            <div class="agency-card-header">
              <h3>Operational summary</h3>
              <span>${meta.label}</span>
            </div>
            <div class="agency-brief-list">
              <div>
                <strong>Current focus</strong>
                <p>${activeCase.title}</p>
              </div>
              <div>
                <strong>Latest update</strong>
                <p>${activeCase.latestUpdate}</p>
              </div>
              <div>
                <strong>Response team</strong>
                <p>${activeCase.responseTeam}</p>
              </div>
            </div>
          </section>

          <section class="agency-card agency-brief-card">
            <div class="agency-card-header">
              <h3>Case timeline</h3>
              <span>Latest</span>
            </div>
            <ul class="timeline-list">
              ${activeCase.timeline.slice(0, 4).map((step) => `<li>${step}</li>`).join('')}
            </ul>
          </section>
        </div>

        <div class="agency-operations-grid">
          <section class="agency-card agency-dispatch-card">
            <div class="agency-card-header">
              <h3>Dispatch assignments</h3>
              <span>Live</span>
            </div>
            <div class="dispatch-list">
              ${meta.assignments.map((assignment) => `
                <div class="dispatch-item">
                  <div>
                    <strong>${assignment.unit}</strong>
                    <small>${assignment.region}</small>
                  </div>
                  <div class="dispatch-meta">
                    <span class="dispatch-status">${assignment.status}</span>
                    <span>ETA ${assignment.eta}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <section class="agency-card agency-map-card">
            <div class="agency-card-header">
              <h3>Incident map</h3>
              <span id="agencyMapStatus-${pageKey}">Loading incidents...</span>
            </div>
            <div id="agencyMap-${pageKey}" class="agency-map-box" aria-label="Map tracking view"></div>
          </section>

          <section class="agency-card agency-chat-card ${shouldShowChat ? '' : 'hidden'}">
            <div class="agency-card-header">
              <h3>Live chat</h3>
              <span>Reporter</span>
            </div>
            <div class="chat-thread">
              ${messageMarkup}
            </div>
            <form class="agency-chat-form">
              <input type="text" class="chat-input" placeholder="Type a dispatch update..." aria-label="Dispatch update" required>
              <button type="submit" class="btn btn-primary btn-small">Send</button>
            </form>
          </section>
        </div>
      </div>
    `);

    if (!shouldShowChat) {
      const followUpButton = document.createElement('button');
      followUpButton.type = 'button';
      followUpButton.className = 'btn btn-secondary btn-small';
      followUpButton.textContent = 'Follow up on this case';
      followUpButton.addEventListener('click', () => {
        sessionStorage.setItem(`cerasAgencyFollowUp_${pageKey}`, 'true');
        renderAgencyOperations();
      });
      const chatContainer = dashboard.querySelector('.agency-dispatch-card');
      if (chatContainer) {
        chatContainer.appendChild(followUpButton);
      }
    }

    renderAgencyMap(pageKey);

    const chatForm = dashboard.querySelector('.agency-chat-form');
    if (chatForm) {
      chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = chatForm.querySelector('.chat-input');
        const nextMessage = input.value.trim();
        if (!nextMessage) return;

        const existingMessages = JSON.parse(sessionStorage.getItem(`cerasAgencyChat_${pageKey}`) || 'null') || meta.chat;
        const updatedMessages = [...existingMessages, { sender: 'Dispatch', text: nextMessage, time: 'now' }];
        sessionStorage.setItem(`cerasAgencyChat_${pageKey}`, JSON.stringify(updatedMessages));
        const thread = dashboard.querySelector('.chat-thread');
        if (thread) {
          thread.insertAdjacentHTML('beforeend', `
            <div class="chat-bubble dispatch">
              <strong>Dispatch</strong>
              <p>${nextMessage}</p>
              <span>now</span>
            </div>
          `);
        }
        input.value = '';
        thread.scrollTop = thread.scrollHeight;
      });
    }
  }

  function renderAgencyDetailPage() {
    const detailContent = document.getElementById('agencyDetailContent');
    const detailSidebar = document.getElementById('agencyDetailSidebar');
    if (!detailContent || !detailSidebar) return;

    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'police';
    const caseId = Number(params.get('case') || 0);
    const reports = getAgencyCaseCatalog()[role] || getAgencyCaseCatalog().police;
    const report = reports[caseId] || reports[0];
    const meta = getAgencyMeta(role);

    if (!report) {
      detailContent.innerHTML = '<p>Case not found.</p>';
      return;
    }

    const backLink = document.getElementById('detailBackLink');
    const pageMap = {
      nadmo: 'nadmo.html',
      police: 'ghana-police.html',
      ambulance: 'ambulance.html',
      fire: 'fire-service.html'
    };
    if (backLink) {
      backLink.setAttribute('href', pageMap[role] || 'index.html');
    }

    detailContent.innerHTML = `
      <div class="detail-header-row">
        <div>
          <p class="section-tag">${meta.label} response</p>
          <h2>${report.title}</h2>
        </div>
        <div class="detail-status-group">
          <span class="report-badge status-${report.status.toLowerCase().replace(/\s+/g, '-')}">${report.status}</span>
          <span class="report-priority priority-${report.priority.toLowerCase()}">${report.priority}</span>
        </div>
      </div>

      <div class="detail-summary-grid">
        <div>
          <span class="summary-label">Location</span>
          <strong>${report.location}</strong>
        </div>
        <div>
          <span class="summary-label">Exact GPS</span>
          <strong>${report.latitude && report.longitude ? `${Number(report.latitude).toFixed(5)}, ${Number(report.longitude).toFixed(5)}` : 'Not provided'}</strong>
        </div>
        <div>
          <span class="summary-label">Reported</span>
          <strong>${report.reportedAt}</strong>
        </div>
        <div>
          <span class="summary-label">Response unit</span>
          <strong>${report.responseTeam.split(' · ')[0]}</strong>
        </div>
      </div>

      <div class="detail-body-copy">
        <p>${report.detail}</p>
        <p>${report.summary}</p>
      </div>

      <section class="detail-block">
        <h3>Current update</h3>
        <p>${report.latestUpdate}</p>
      </section>

      <section class="detail-block">
        <h3>Response timeline</h3>
        <ul class="timeline-list">
          ${report.timeline.map((step) => `<li>${step}</li>`).join('')}
        </ul>
      </section>
    `;

    detailSidebar.innerHTML = `
      <div class="detail-side-card">
        <h3>Agency summary</h3>
        <div class="agency-stat-card compact-stat">
          <span>${meta.label} overview</span>
          <strong>${meta.summaryCards[0].value}</strong>
        </div>
        <ul class="detail-side-list">
          ${meta.summaryCards.map((card) => `<li><span>${card.label}</span><strong>${card.value}</strong></li>`).join('')}
        </ul>
      </div>
      <div class="detail-side-card">
        <h3>Action plan</h3>
        <ul class="action-plan-list">
          ${report.actions.map((action) => `<li>${action}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function initAgencyPortal() {
    const agencyForm = document.getElementById('agencyLoginForm');
    const agencyLoginPanel = document.getElementById('agencyLoginPanel');
    const agencyDashboard = document.getElementById('agencyDashboard');
    const logoutButton = document.getElementById('agencyLogoutBtn');

    if (!agencyForm || !agencyLoginPanel || !agencyDashboard) return;

    const pageName = (location.pathname.split('/').pop() || '').toLowerCase();
    const pageKey = pageName === 'nadmo.html' ? 'nadmo' : pageName === 'ghana-police.html' ? 'police' : pageName === 'ambulance.html' ? 'ambulance' : 'fire';
    const hasActiveSession = currentUser?.role === pageKey;
    agencyLoginPanel.classList.toggle('hidden', hasActiveSession);
    agencyDashboard.classList.toggle('hidden', !hasActiveSession);
    if (hasActiveSession) {
      renderAgencyReports();
      renderAgencyOperations();
    }

    agencyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const messageEl = document.getElementById('agencyMessage');
      if (messageEl) messageEl.textContent = 'Use the main CERAS sign-in to access your agency dashboard.';
      window.location.href = 'login.html';
    });

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        authRequest('/api/logout', { method: 'POST' }).finally(() => { currentUser = null; });
        agencyLoginPanel.classList.remove('hidden');
        agencyDashboard.classList.add('hidden');
        agencyForm.reset();
      });
    }
  }

  // Alert tracking dashboard logic
  const alertListContainer = document.getElementById('alertList');

  if (alertListContainer) {
    const alertData = [
      {
        id: 1,
        label: 'Flood Warning',
        severity: 'critical',
        location: 'Northern Districts',
        summary: 'High water levels and heavy rainfall create evacuation risk in riverside communities.',
        action: 'Monitor water levels and avoid low-lying roads.',
        updated: '2 minutes ago',
        responders: 'Water Rescue Unit'
      },
      {
        id: 2,
        label: 'Fire Advisory',
        severity: 'warning',
        location: 'Greater Accra',
        summary: 'Dry conditions increase fire risk in urban neighborhoods. Response teams are patrolling hotspots.',
        action: 'Reduce open flames and report smoke immediately.',
        updated: '8 minutes ago',
        responders: 'Fire Service Response Team'
      },
      {
        id: 3,
        label: 'Road Safety',
        severity: 'info',
        location: 'Accra-Kumasi Highway',
        summary: 'Accident response teams are clearing an incident and managing traffic delays.',
        action: 'Use alternative routes and follow officer directions.',
        updated: '11 minutes ago',
        responders: 'Traffic Management Unit'
      }
    ];

    function getSeverityClass(severity) {
      if (severity === 'critical') return 'alert-critical';
      if (severity === 'warning') return 'alert-warning';
      return 'alert-info';
    }

    function renderAlerts() {
      alertListContainer.innerHTML = '';
      alertData.forEach((alert) => {
        const card = document.createElement('div');
        card.className = `alert-card ${getSeverityClass(alert.severity)}`;
        card.innerHTML = `
          <div class="alert-content">
            <img src="images/${alert.severity === 'critical' ? 'floodwarning.jpg' : alert.severity === 'warning' ? 'fire.jpg' : 'road-safety.jpg'}" alt="${alert.label}" class="alert-image">
            <div class="alert-text">
              <p class="alert-label">${alert.label}</p>
              <h3>${alert.location}</h3>
              <p>${alert.summary}</p>
              <p><strong>Action:</strong> ${alert.action}</p>
              <p><strong>Updated:</strong> ${alert.updated}</p>
              <p><strong>Responders:</strong> ${alert.responders}</p>
            </div>
          </div>
        `;
        alertListContainer.appendChild(card);
      });
    }

    renderAlerts();
  }

  const teamProfiles = {
    kelvin: {
      name: 'Obikyere Kelvin',
      role: 'System Architect',
      bio: 'Kelvin designs CERAS infrastructure and ensures the platform stays secure, scalable, and resilient under high-traffic emergencies.',
      email: 'kelvin@ceras.com',
      phone: '+233 20 000 0001',
      image: 'public/images/Person 1.jpg'
    },
    nana: {
      name: 'Nana Ohenewaa',
      role: 'Frontend Developer',
      bio: 'Naya builds clear, responsive interfaces so citizens and responders can navigate alerts quickly and with confidence.',
      email: 'nana@ceras.com',
      phone: '+233 20 000 0002',
      image: 'public/images/Person 4.jpg'
    },
    rudolf: {
      name: 'Nyarko Rudolf',
      role: 'Communications Lead',
      bio: 'Rudolf coordinates messaging across agencies and communities, ensuring updates are trusted, and easy to act on.',
      email: 'rudolf@ceras.com',
      phone: '+233 20 000 0003',
      image: 'public/images/Person 3.jpg'
    },
    chris: {
      name: 'Chris Opare',
      role: 'Operations Analyst',
      bio: 'Chris analyzes response patterns and improves alert workflows to keep CERAS fast, effective, and dependable.',
      email: 'chris@ceras.com',
      phone: '+233 20 000 0004',
      image: 'public/images/Person 2.jpg'
    }
  };

  const teamModal = document.getElementById('teamModal');
  const teamModalClose = document.getElementById('teamModalClose');
  const teamModalImage = document.getElementById('teamModalImage');
  const teamModalName = document.getElementById('teamModalName');
  const teamModalRole = document.getElementById('teamModalRole');
  const teamModalBio = document.getElementById('teamModalBio');
  const teamModalEmail = document.getElementById('teamModalEmail');
  const teamModalPhone = document.getElementById('teamModalPhone');

  function openTeamModal(key) {
    const profile = teamProfiles[key];
    if (!profile || !teamModal) return;
    teamModalImage.src = profile.image;
    teamModalImage.alt = `${profile.name}, ${profile.role}`;
    teamModalName.textContent = profile.name;
    teamModalRole.textContent = profile.role;
    teamModalBio.textContent = profile.bio;
    teamModalEmail.textContent = profile.email;
    teamModalPhone.textContent = profile.phone;
    teamModal.classList.add('open');
    teamModal.setAttribute('aria-hidden', 'false');
  }

  function closeTeamModal() {
    if (!teamModal) return;
    teamModal.classList.remove('open');
    teamModal.setAttribute('aria-hidden', 'true');
  }

  // Open team modal when clicking the card, image, or name
  document.querySelectorAll('.team-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (event) => {
      const member = card.dataset.member;
      openTeamModal(member);
    });
    const img = card.querySelector('img');
    const name = card.querySelector('h3');
    if (img) img.addEventListener('click', (e) => { e.stopPropagation(); openTeamModal(card.dataset.member); });
    if (name) name.addEventListener('click', (e) => { e.stopPropagation(); openTeamModal(card.dataset.member); });
  });

  if (teamModalClose) {
    teamModalClose.addEventListener('click', closeTeamModal);
  }

  if (teamModal) {
    teamModal.addEventListener('click', (event) => {
      if (event.target === teamModal) {
        closeTeamModal();
      }
    });
  }

  // Initialize homepage reporting chart if present
  const reportChartEl = document.getElementById('reportChart');
  if (reportChartEl && window.Chart) {
    try {
      const ctx = reportChartEl.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Hazard', 'Medical', 'Public Alert'],
          datasets: [{
            data: [48, 27, 25],
            backgroundColor: ['#d62828', '#f77f00', '#003049'],
            hoverOffset: 6,
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    } catch (e) {
      console.warn('Chart initialization failed', e);
    }
  }
});
