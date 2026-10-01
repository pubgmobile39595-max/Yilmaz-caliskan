/* =====================================================
   YILMAZ ÇALIŞKAN TURİZM
   GERÇEK SUPABASE ADMIN PANELİ
   v2 - REZERVASYON YÖNETİM SİSTEMİ
===================================================== */

"use strict";


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
  "https://vbaglsnkmahnwdazqcue.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_jFv8ZP75Ais3eSjx_bsjzg_pAcgoJ0G";

let supabaseClient = null;


/* =====================================================
   BAŞLAT
===================================================== */

if (
  typeof window.supabase !== "undefined" &&
  SUPABASE_PUBLISHABLE_KEY &&
  SUPABASE_PUBLISHABLE_KEY !==
    "BURAYA_PUBLISHABLE_KEYINI_YAPISTIR"
) {
  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
}


/* =====================================================
   STORAGE
===================================================== */

const STORAGE = {
  messages: "yc_messages",
  favorites: "yc_favorites"
};


/* =====================================================
   OTEL FALLBACK
===================================================== */

const fallbackHotels = [

  {
    id: "ant-001",
    name: "Antalya Premium Resort",
    location: "Antalya",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "bod-001",
    name: "Bodrum Luxury Resort",
    location: "Bodrum",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "ces-001",
    name: "Çeşme Marina Hotel",
    location: "Çeşme",
    price: 3900,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "kap-001",
    name: "Kapadokya Cave Hotel",
    location: "Kapadokya",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: "ist-001",
    name: "İstanbul Bosphorus Hotel",
    location: "İstanbul",
    price: 4800,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80"
  }

];


/* =====================================================
   YARDIMCI FONKSİYONLAR
===================================================== */

function getElement(id) {
  return document.getElementById(id);
}


function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(value) {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHTML(value);
  }

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(date);
}


function formatDateTime(value) {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHTML(value);
  }

  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);
}


function showAlert(message) {
  window.alert(message);
}


function getStorageArray(key) {

  try {

    const value =
      localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed =
      JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "Storage okuma hatası:",
      error
    );

    return [];
  }
}


function loadingState(text) {

  return `
    <div class="empty-state">
      <div class="empty-icon">⏳</div>
      <h3>${escapeHTML(text)}</h3>
    </div>
  `;
}


function emptyState(
  icon,
  title,
  description
) {

  return `
    <div class="empty-state">

      <div class="empty-icon">
        ${escapeHTML(icon)}
      </div>

      <h3>
        ${escapeHTML(title)}
      </h3>

      <p>
        ${escapeHTML(description)}
      </p>

    </div>
  `;
}


/* =====================================================
   OTELLER
===================================================== */

function getHotels() {

  try {

    if (
      window.YilmazCaliskanTurizm &&
      Array.isArray(
        window.YilmazCaliskanTurizm.hotels
      )
    ) {

      return (
        window.YilmazCaliskanTurizm.hotels
      );

    }

  } catch (error) {

    console.warn(
      "Ana oteller okunamadı.",
      error
    );

  }

  return fallbackHotels;
}


/* =====================================================
   SUPABASE KONTROL
===================================================== */

function ensureSupabase() {

  if (!supabaseClient) {

    showAlert(
      "Supabase bağlantısı hazır değil. Publishable key'i kontrol edin."
    );

    return false;
  }

  return true;
}


/* =====================================================
   LOGIN
===================================================== */

async function loginAdmin(
  email,
  password
) {

  if (!ensureSupabase()) {
    return false;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    if (error) {

      console.error(
        "Supabase login hatası:",
        error
      );

      return false;
    }

    return Boolean(
      data &&
      data.session
    );

  } catch (error) {

    console.error(
      "Login exception:",
      error
    );

    return false;
  }
}


/* =====================================================
   SESSION
===================================================== */

async function getCurrentSession() {

  if (!ensureSupabase()) {
    return null;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getSession();

    if (error) {

      console.error(
        "Session hatası:",
        error
      );

      return null;
    }

    return data.session || null;

  } catch (error) {

    console.error(
      "Session exception:",
      error
    );

    return null;
  }
}


/* =====================================================
   LOGIN EKRANI
===================================================== */

function showLoginScreen() {

  const loginScreen =
    getElement("loginScreen");

  const adminPanel =
    getElement("adminPanel");

  if (loginScreen) {
    loginScreen.hidden = false;
  }

  if (adminPanel) {
    adminPanel.hidden = true;
  }
}


function showAdminPanel() {

  const loginScreen =
    getElement("loginScreen");

  const adminPanel =
    getElement("adminPanel");

  if (loginScreen) {
    loginScreen.hidden = true;
  }

  if (adminPanel) {
    adminPanel.hidden = false;
  }
}


/* =====================================================
   LOGIN FORM
===================================================== */

function setupLogin() {

  const form =
    getElement("loginForm");

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      const email =
        getElement(
          "adminUsername"
        )?.value?.trim();

      const password =
        getElement(
          "adminPassword"
        )?.value;

      const errorBox =
        getElement("loginError");

      const button =
        form.querySelector(
          "button[type='submit']"
        );

      if (!email || !password) {

        if (errorBox) {

          errorBox.textContent =
            "E-posta ve şifre zorunludur.";

          errorBox.hidden = false;
        }

        return;
      }

      if (button) {

        button.disabled = true;

        button.textContent =
          "Giriş yapılıyor...";
      }

      if (errorBox) {
        errorBox.hidden = true;
      }

      const success =
        await loginAdmin(
          email,
          password
        );

      if (success) {

        showAdminPanel();

        const emailDisplay =
          getElement(
            "adminEmailDisplay"
          );

        if (emailDisplay) {
          emailDisplay.textContent =
            email;
        }

        await loadDashboard();

        showSection("dashboard");

      } else {

        if (errorBox) {

          errorBox.textContent =
            "E-posta veya şifre hatalı.";

          errorBox.hidden = false;
        }

        const passwordInput =
          getElement(
            "adminPassword"
          );

        if (passwordInput) {

          passwordInput.value = "";

          passwordInput.focus();
        }
      }

      if (button) {

        button.disabled = false;

        button.textContent =
          "Panele Giriş Yap";
      }

    }
  );
}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

  const button =
    getElement("logoutButton");

  if (!button) {
    return;
  }

  button.addEventListener(
    "click",
    async function() {

      if (!supabaseClient) {
        return;
      }

      try {

        await supabaseClient.auth.signOut();

      } catch (error) {

        console.error(
          "Logout hatası:",
          error
        );
      }

      showLoginScreen();

    }
  );
}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );

  navItems.forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          showSection(
            button.dataset.section
          );

        }
      );

    }
  );


  const sectionLinks =
    document.querySelectorAll(
      "[data-section-link]"
    );

  sectionLinks.forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          showSection(
            button.dataset.sectionLink
          );

        }
      );

    }
  );
}


/* =====================================================
   SECTION
===================================================== */

async function showSection(
  sectionName
) {

  const sections =
    document.querySelectorAll(
      ".admin-section"
    );

  sections.forEach(
    function(section) {

      section.classList.remove(
        "active"
      );

    }
  );


  const target =
    getElement(
      sectionName +
      "Section"
    );

  if (target) {

    target.classList.add(
      "active"
    );
  }


  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );

  navItems.forEach(
    function(button) {

      button.classList.toggle(
        "active",
        button.dataset.section ===
          sectionName
      );

    }
  );


  const titles = {

    dashboard:
      "Dashboard",

    bookings:
      "Rezervasyonlar",

    messages:
      "Mesajlar",

    hotels:
      "Oteller",

    settings:
      "Ayarlar"

  };


  const title =
    getElement("pageTitle");

  if (title) {

    title.textContent =
      titles[sectionName] ||
      "Yönetim Paneli";
  }


  if (sectionName === "dashboard") {
    await loadDashboard();
  }


  if (sectionName === "bookings") {
    await renderBookings();
  }


  if (sectionName === "messages") {
    renderMessages();
  }


  if (sectionName === "hotels") {
    renderHotels();
  }
}


/* =====================================================
   SUPABASE REZERVASYONLARI
===================================================== */

async function getBookings() {

  if (!ensureSupabase()) {
    return [];
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("bookings")
        .select("*")
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {

      console.error(
        "Rezervasyon okuma hatası:",
        error
      );

      showAlert(
        "Rezervasyonlar alınamadı:\n" +
        error.message
      );

      return [];
    }

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      "Rezervasyon exception:",
      error
    );

    return [];
  }
}


/* =====================================================
   REZERVASYON NORMALİZE
===================================================== */

function normalizeBooking(
  booking
) {

  return {

    id:
      booking.id,

    bookingNumber:
      booking.booking_number ||
      "-",

    name:
      booking.customer_name ||
      "-",

    email:
      booking.email ||
      "-",

    phone:
      booking.phone ||
      "-",

    hotel:
      booking.hotel_name ||
      "-",

    location:
      booking.location ||
      "-",

    checkin:
      booking.checkin,

    checkout:
      booking.checkout,

    guests:
      booking.guests ||
      0,

    status:
      booking.status ||
      "Yeni",

    createdAt:
      booking.created_at

  };
}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(status) {

  const normalized =
    String(
      status ||
      "Yeni"
    ).toLowerCase();

  if (
    normalized === "onaylandı" ||
    normalized === "onaylandi"
  ) {

    return "success";
  }

  if (
    normalized === "iptal"
  ) {

    return "danger";
  }

  if (
    normalized === "inceleniyor" ||
    normalized === "inceleniyor"
  ) {

    return "warning";
  }

  if (
    normalized === "yeni"
  ) {

    return "warning";
  }

  return "neutral";
}


/* =====================================================
   STATUS SELECT
===================================================== */

function createStatusSelect(
  booking
) {

  const current =
    booking.status ||
    "Yeni";

  const options = [
    "Yeni",
    "İnceleniyor",
    "Onaylandı",
    "İptal"
  ];

  let html = `

    <select
      class="booking-status-select"
      data-status-id="${escapeHTML(
        booking.id
      )}"
    >

  `;

  options.forEach(
    function(option) {

      html += `

        <option
          value="${escapeHTML(option)}"
          ${
            option === current
              ? "selected"
              : ""
          }
        >
          ${escapeHTML(option)}
        </option>

      `;

    }
  );

  html += `
    </select>
  `;

  return html;
}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

  const hotels =
    getHotels();

  const bookings =
    await getBookings();

  const messages =
    getStorageArray(
      STORAGE.messages
    );

  const favorites =
    getStorageArray(
      STORAGE.favorites
    );


  const statHotels =
    getElement("statHotels");

  const statBookings =
    getElement("statBookings");

  const statMessages =
    getElement("statMessages");

  const statFavorites =
    getElement("statFavorites");


  if (statHotels) {
    statHotels.textContent =
      hotels.length;
  }

  if (statBookings) {
    statBookings.textContent =
      bookings.length;
  }

  if (statMessages) {
    statMessages.textContent =
      messages.length;
  }

  if (statFavorites) {
    statFavorites.textContent =
      favorites.length;
  }


  renderDashboardBookings(
    bookings
  );
}


/* =====================================================
   DASHBOARD SON REZERVASYONLAR
===================================================== */

function renderDashboardBookings(
  rawBookings
) {

  const container =
    getElement(
      "dashboardBookings"
    );

  if (!container) {
    return;
  }

  const bookings =
    rawBookings
      .slice(0, 5)
      .map(normalizeBooking);


  if (!bookings.length) {

    container.innerHTML =
      emptyState(
        "📅",
        "Henüz rezervasyon yok",
        "Yeni rezervasyon talepleri burada görünecek."
      );

    return;
  }


  container.innerHTML =
    createBookingsTable(
      bookings,
      true
    );
}


/* =====================================================
   TÜM REZERVASYONLAR
===================================================== */

async function renderBookings() {

  const container =
    getElement(
      "bookingsTable"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    loadingState(
      "Rezervasyonlar yükleniyor..."
    );


  const rawBookings =
    await getBookings();

  const bookings =
    rawBookings.map(
      normalizeBooking
    );


  if (!bookings.length) {

    container.innerHTML =
      emptyState(
        "📅",
        "Henüz rezervasyon yok",
        "Site üzerinden gelen talepler burada görünecek."
      );

    return;
  }


  container.innerHTML =
    createBookingsTable(
      bookings,
      false
    );


  setupBookingActions();
}


/* =====================================================
   REZERVASYON TABLOSU
===================================================== */

function createBookingsTable(
  bookings,
  compact
) {

  let html = `

    <div class="booking-table-wrapper">

      <table class="admin-table">

        <thead>

          <tr>

            <th>Rezervasyon</th>

            <th>Müşteri</th>

            <th>Otel</th>

            <th>Tarih</th>

            <th>Kişi</th>

            <th>Durum</th>

            ${
              compact
                ? ""
                : "<th>İşlem</th>"
            }

          </tr>

        </thead>

        <tbody>

  `;


  bookings.forEach(
    function(booking) {

      const status =
        booking.status ||
        "Yeni";

      const statusClass =
        getStatusClass(status);


      html += `

        <tr>

          <td>

            <span class="table-primary">

              ${escapeHTML(
                booking.bookingNumber
              )}

            </span>

            <span class="table-secondary">

              ${formatDateTime(
                booking.createdAt
              )}

            </span>

          </td>


          <td>

            <span class="table-primary">

              ${escapeHTML(
                booking.name
              )}

            </span>

            <span class="table-secondary">

              ${escapeHTML(
                booking.phone
              )}

            </span>

          </td>


          <td>

            <span class="table-primary">

              ${escapeHTML(
                booking.hotel
              )}

            </span>

            <span class="table-secondary">

              ${escapeHTML(
                booking.location
              )}

            </span>

          </td>


          <td>

            <span class="table-primary">

              ${formatDate(
                booking.checkin
              )}

            </span>

            <span class="table-secondary">

              →

              ${formatDate(
                booking.checkout
              )}

            </span>

          </td>


          <td>

            ${escapeHTML(
              booking.guests
            )}

          </td>


          <td>

            ${
              compact
                ? `
                  <span
                    class="status-badge ${statusClass}">
                    ${escapeHTML(status)}
                  </span>
                `
                : createStatusSelect(
                    booking
                  )
            }

          </td>

      `;


      if (!compact) {
