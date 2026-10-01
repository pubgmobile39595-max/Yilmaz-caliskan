/* =====================================================
   YILMAZ ÇALIŞKAN TURİZM
   ADMIN PANEL JAVASCRIPT
===================================================== */

"use strict";


/* =====================================================
   AYARLAR
===================================================== */

/*
  ⚠️ BU GİRİŞ SİSTEMİ DEMO AMAÇLIDIR.

  GitHub Pages üzerinde JavaScript'e yazılan
  kullanıcı adı/şifre gerçek anlamda gizli değildir.

  Gerçek yayında güvenli backend/auth sistemi
  kurulacaktır.
*/

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "YC2026";


const STORAGE = {
  bookings: "yc_bookings",
  messages: "yc_messages",
  favorites: "yc_favorites"
};


/* =====================================================
   YARDIMCI FONKSİYONLAR
===================================================== */

function getElement(id) {
  return document.getElementById(id);
}


function getStorageArray(key) {
  try {

    const value = localStorage.getItem(key);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {

    console.error("LocalStorage okuma hatası:", error);

    return [];
  }
}


function setStorageArray(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.error(
      "LocalStorage yazma hatası:",
      error
    );

  }

}


function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(dateValue) {

  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return escapeHTML(dateValue);
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


function formatDateTime(dateValue) {

  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return escapeHTML(dateValue);
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


/* =====================================================
   OTEL VERİLERİ
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
   OTELLERİ AL
===================================================== */

function getHotels() {

  /*
    Ana script.js içindeki global veri varsa
    onu kullanmaya çalışıyoruz.
  */

  try {

    if (
      window.YilmazCaliskanTurizm &&
      Array.isArray(
        window.YilmazCaliskanTurizm.hotels
      )
    ) {

      return window.YilmazCaliskanTurizm.hotels;

    }

  } catch (error) {

    console.warn(
      "Ana otel verisi okunamadı.",
      error
    );

  }

  return fallbackHotels;
}


/* =====================================================
   REZERVASYONLAR
===================================================== */

function getBookings() {
  return getStorageArray(
    STORAGE.bookings
  );
}


/* =====================================================
   MESAJLAR
===================================================== */

function getMessages() {
  return getStorageArray(
    STORAGE.messages
  );
}


/* =====================================================
   FAVORİLER
===================================================== */

function getFavorites() {
  return getStorageArray(
    STORAGE.favorites
  );
}


/* =====================================================
   LOGIN
===================================================== */

function setupLogin() {

  const loginForm =
    getElement("loginForm");

  const loginScreen =
    getElement("loginScreen");

  const adminPanel =
    getElement("adminPanel");

  const loginError =
    getElement("loginError");


  if (!loginForm) {
    return;
  }


  loginForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const username =
        getElement(
          "adminUsername"
        )?.value
          ?.trim();


      const password =
        getElement(
          "adminPassword"
        )?.value
          ?.trim();


      if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
      ) {

        sessionStorage.setItem(
          "yc_admin_logged",
          "true"
        );


        loginScreen.hidden = true;

        adminPanel.hidden = false;


        loadDashboard();

        showSection("dashboard");

      } else {

        loginError.hidden = false;

        getElement(
          "adminPassword"
        ).value = "";

      }

    }
  );

}


function checkLogin() {

  const logged =
    sessionStorage.getItem(
      "yc_admin_logged"
    );


  if (logged === "true") {

    getElement(
      "loginScreen"
    ).hidden = true;

    getElement(
      "adminPanel"
    ).hidden = false;

    return true;
  }


  getElement(
    "loginScreen"
  ).hidden = false;

  getElement(
    "adminPanel"
  ).hidden = true;

  return false;
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
    function () {

      sessionStorage.removeItem(
        "yc_admin_logged"
      );

      window.location.reload();

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
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const section =
            button.dataset.section;

          showSection(section);

        }
      );

    }
  );


  const sectionLinks =
    document.querySelectorAll(
      "[data-section-link]"
    );


  sectionLinks.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          showSection(
            button.dataset.sectionLink
          );

        }
      );

    }
  );

}


function showSection(sectionName) {

  const sections =
    document.querySelectorAll(
      ".admin-section"
    );


  sections.forEach(
    function (section) {

      section.classList.remove(
        "active"
      );

    }
  );


  const target =
    getElement(
      sectionName + "Section"
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
    function (button) {

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


  if (
    sectionName === "dashboard"
  ) {

    loadDashboard();

  }


  if (
    sectionName === "bookings"
  ) {

    renderBookings();

  }


  if (
    sectionName === "messages"
  ) {

    renderMessages();

  }


  if (
    sectionName === "hotels"
  ) {

    renderHotels();

  }

}


/* =====================================================
   DASHBOARD
===================================================== */

function loadDashboard() {

  const hotels =
    getHotels();

  const bookings =
    getBookings();

  const messages =
    getMessages();

  const favorites =
    getFavorites();


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


  renderDashboardBookings();

}


/* =====================================================
   DASHBOARD SON REZERVASYONLAR
===================================================== */

function renderDashboardBookings() {

  const container =
    getElement(
      "dashboardBookings"
    );


  if (!container) {
    return;
  }


  const bookings =
    getBookings()
      .sort(
        function (a, b) {

          return (
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
          );

        }
      )
      .slice(0, 5);


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

function renderBookings() {

  const container =
    getElement(
      "bookingsTable"
    );


  if (!container) {
    return;
  }


  const bookings =
    getBookings()
      .sort(
        function (a, b) {

          return (
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
          );

        }
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

    <table class="admin-table">

      <thead>

        <tr>

          <th>Rezervasyon</th>

          <th>Müşteri</th>

          <th>Otel</th>

          <th>Tarih</th>

          <th>Kişi</th>

          <th>Durum</th>

          ${compact ? "" : "<th>İşlem</th>"}

        </tr>

      </thead>

      <tbody>
  `;


  bookings.forEach(
    function (booking) {

      const bookingNumber =
        booking.bookingNumber ||
        "-";


      const customer =
        booking.name ||
        "İsimsiz";


      const phone =
        booking.phone ||
        "-";


      const hotel =
        booking.hotel ||
        "-";


      const location =
        booking.location ||
        "";


      const checkin =
        formatDate(
          booking.checkin
        );


      const checkout =
        formatDate(
          booking.checkout
        );


      const guests =
        booking.guests ||
        "0";


      const status =
        booking.status ||
        "Yeni";


      let statusClass =
        "neutral";


      if (
        status.toLowerCase() ===
        "yeni"
      ) {

        statusClass =
          "warning";

      }


      if (
        status.toLowerCase() ===
        "onaylandı"
      ) {

        statusClass =
          "";

      }


      html += `

        <tr>

          <td>

            <span class="table-primary">
              ${escapeHTML(
                bookingNumber
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
                customer
              )}
            </span>

            <span class="table-secondary">
              ${escapeHTML(
                phone
              )}
            </span>

          </td>


          <td>

            <span class="table-primary">
              ${escapeHTML(
                hotel
              )}
            </span>

            <span class="table-secondary">
              ${escapeHTML(
                location
              )}
            </span>

          </td>


          <td>

            <span class="table-primary">
              ${escapeHTML(
                checkin
              )}
            </span>

            <span class="table-secondary">
              → ${escapeHTML(
                checkout
              )}
            </span>

          </td>


          <td>
            ${escapeHTML(
              guests
            )}
          </td>


          <td>

            <span
              class="status-badge ${statusClass}">

              ${escapeHTML(
                status
              )}

            </span>

          </td>

      `;


      if (!compact) {

        html += `

          <td>

            <div
              class="action-buttons">

              <button
                class="action-button"
                data-booking-action="view"
                data-booking-id="${escapeHTML(
                  bookingNumber
                )}">

                Görüntüle

              </button>


              ${
                booking.phone
                  ? `
                    <button
                      class="action-button whatsapp"
                      data-booking-action="whatsapp"
                      data-phone="${escapeHTML(
                        booking.phone
                      )}"
                      data-name="${escapeHTML(
                        booking.name || ""
                      )}">

                      WhatsApp

                    </button>
                  `
                  : ""
              }


              <button
                class="action-button"
                data-booking-action="delete"
                data-booking-id="${escapeHTML(
                  bookingNumber
                )}">

                Sil

              </button>

            </div>

          </td>

        `;

      }


      html += `

        </tr>

      `;

    }
  );


  html += `

      </tbody>

    </table>

  `;


  return html;
}


/* =====================================================
   REZERVASYON İŞLEMLERİ
===================================================== */

function setupBookingActions() {

  const buttons =
    document.querySelectorAll(
      "[data-booking-action]"
    );


  buttons.forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const action =
            button.dataset.bookingAction;


          if (action === "view") {

            viewBooking(
              button.dataset.bookingId
            );

          }


          if (action === "delete") {

            deleteBooking(
              button.dataset.bookingId
            );

          }


          if (action === "whatsapp") {

            openWhatsApp(
              button.dataset.phone,
              button.dataset.name
            );

          }

        }
      );

    }
  );

}


function viewBooking(
  bookingNumber
) {

  const bookings =
    getBookings();


  const booking =
    bookings.find(
      function (item) {

        return (
          String(
            item.bookingNumber
          ) ===
          String(
            bookingNumber
          )
        );

      }
    );


  if (!booking) {

    showAlert(
      "Rezervasyon bulunamadı."
    );

    return;
  }


  const text =

`REZERVASYON DETAYI

Rezervasyon No:
${booking.bookingNumber || "-"}

Müşteri:
${booking.name || "-"}

E-posta:
${booking.email || "-"}

Telefon:
${booking.phone || "-"}

Otel:
${booking.hotel || "-"}

Konum:
${booking.location || "-"}

Giriş:
${formatDate(booking.checkin)}

Çıkış:
${formatDate(booking.checkout)}

Kişi:
${booking.guests || "-"}

Durum:
${booking.status || "Yeni"}

Talep zamanı:
${formatDateTime(booking.createdAt)}
`;


  showAlert(text);

}


function deleteBooking(
  bookingNumber
) {

  const confirmed =
    window.confirm(
      "Bu rezervasyonu silmek istediğinizden emin misiniz?"
    );


  if (!confirmed) {
    return;
  }


  const bookings =
    getBookings();


  const filtered =
    bookings.filter(
      function (item) {

        return String(
          item.bookingNumber
        ) !==
        String(
          bookingNumber
        );

      }
    );


  setStorageArray(
    STORAGE.bookings,
    filtered
  );


  renderBookings();

  loadDashboard();

  showAlert(
    "Rezervasyon silindi."
  );

}


/* =====================================================
   WHATSAPP
===================================================== */

function openWhatsApp(
  phone,
  name
) {

  if (!phone) {

    showAlert(
      "Bu müşterinin telefon numarası bulunamadı."
    );

    return;

  }


  let cleaned =
    String(phone)
      .replace(/\D/g, "");


  if (
    cleaned.startsWith("0")
  ) {

    cleaned =
      "90" +
      cleaned.substring(1);

  }


  if (
    !cleaned.startsWith("90") &&
    cleaned.length === 10
  ) {

    cleaned =
      "90" +
      cleaned;

  }


  const message =
    `Merhaba ${name || ""}, Yılmaz Çalışkan Turizm üzerinden yaptığınız rezervasyon talebiniz hakkında sizinle iletişime geçiyoruz.`;


  const url =
    "https://wa.me/" +
    cleaned +
    "?text=" +
    encodeURIComponent(
      message
    );


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =====================================================
   MESAJLAR
===================================================== */

function renderMessages() {

  const container =
    getElement(
      "messagesTable"
    );


  if (!container) {
    return;
  }


  const messages =
    getMessages()
      .sort(
        function (a, b) {

          return (
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
          );

        }
      );


  if (!messages.length) {

    container.innerHTML =
      emptyState(
        "📩",
        "Henüz mesaj yok",
        "İletişim formundan gelen mesajlar bura
