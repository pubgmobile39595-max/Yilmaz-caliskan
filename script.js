/* =========================================================
   YILMAZ ÇALIŞKAN TURİZM
   MAIN JAVASCRIPT
   SUPABASE + LOCAL STORAGE
========================================================= */


/* =========================================================
   SUPABASE AYARLARI
========================================================= */

const SUPABASE_URL =
  "https://vbaglsnkmahnwdazqcue.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_jFv8ZP75Ais3eSjx_bsjzg_pAcgoJ0G";


let supabaseClient = null;

if (
  typeof window.supabase !== "undefined" &&
  SUPABASE_PUBLISHABLE_KEY !==
    "BURAYA_PUBLISHABLE_KEYINI_YAPISTIR"
) {

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

}


/* =========================================================
   OTELLER
========================================================= */

const hotels = [

  {
    id: 1,
    name: "Azure Coast Resort",
    city: "antalya",
    location: "Antalya • Lara",
    rating: 9.2,
    reviews: 418,
    price: 4850,
    desc: "Denize yakın, modern odalar ve geniş havuz alanı.",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 2,
    name: "Bodrum Marina Hotel",
    city: "bodrum",
    location: "Bodrum • Merkez",
    rating: 9.0,
    reviews: 263,
    price: 6250,
    desc: "Marina manzarası, merkezi konum ve seçkin restoran.",
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 3,
    name: "Alaçatı Stone House",
    city: "cesme",
    location: "Çeşme • Alaçatı",
    rating: 9.4,
    reviews: 192,
    price: 3950,
    desc: "Taş mimari, sakin avlu ve Alaçatı atmosferi.",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 4,
    name: "Cappadocia Valley Cave",
    city: "kapadokya",
    location: "Kapadokya • Göreme",
    rating: 9.5,
    reviews: 331,
    price: 5400,
    desc: "Vadiler arasında benzersiz mağara oda deneyimi.",
    image: "https://images.unsplash.com/photo-1573053986275-840ffc7cc685?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 5,
    name: "Mediterranean Palace",
    city: "antalya",
    location: "Antalya • Belek",
    rating: 8.9,
    reviews: 510,
    price: 7200,
    desc: "Geniş tesis, özel plaj ve aile dostu olanaklar.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 6,
    name: "Bodrum Blue Suites",
    city: "bodrum",
    location: "Bodrum • Yalıkavak",
    rating: 9.1,
    reviews: 174,
    price: 8150,
    desc: "Sade lüks, Ege manzarası ve özel süitler.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 7,
    name: "Istanbul Bosphorus Stay",
    city: "istanbul",
    location: "İstanbul • Beşiktaş",
    rating: 9.0,
    reviews: 642,
    price: 4600,
    desc: "Boğaz hattında şehir kaçamağı için modern konaklama.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85"
  },

  {
    id: 8,
    name: "Çeşme Seaside Club",
    city: "cesme",
    location: "Çeşme • Ilıca",
    rating: 8.8,
    reviews: 229,
    price: 5750,
    desc: "Plaja yakın konum ve Ege yazı için rahat odalar.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85"
  }

];


/* =========================================================
   AYARLAR
========================================================= */

const WHATSAPP_NUMBER = "";


/* =========================================================
   GLOBAL
========================================================= */

let favorites = JSON.parse(
  localStorage.getItem("yc_favorites") || "[]"
);

let currentHotels = [...hotels];


/* =========================================================
   DOM
========================================================= */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


/* =========================================================
   PARA
========================================================= */

function money(value) {

  return new Intl.NumberFormat(
    "tr-TR",
    {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }
  ).format(value);

}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

  const element = $("#toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {
      element.classList.remove("show");
    }, 2800);

}


/* =========================================================
   FAVORİLER
========================================================= */

function updateFavoriteCount() {

  const element =
    $("#favoriteCount");

  if (!element) return;

  element.textContent =
    favorites.length;

}


function isFavorite(id) {

  return favorites.includes(id);

}


function saveFavorites() {

  localStorage.setItem(
    "yc_favorites",
    JSON.stringify(favorites)
  );

  updateFavoriteCount();

}


function toggleFavorite(id) {

  if (isFavorite(id)) {

    favorites =
      favorites.filter(
        item => item !== id
      );

    toast(
      "Otel favorilerden çıkarıldı."
    );

  } else {

    favorites.push(id);

    toast(
      "Otel favorilere eklendi."
    );

  }

  saveFavorites();

  renderHotels(currentHotels);

}


/* =========================================================
   OTEL LİSTESİ
========================================================= */

function renderHotels(list = hotels) {

  currentHotels = [...list];

  const grid =
    $("#hotelGrid");

  const empty =
    $("#empty");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  empty.hidden =
    list.length !== 0;


  list.forEach(hotel => {

    const card =
      document.createElement("article");

    card.className =
      "hotel-card";


    card.innerHTML = `

      <div
        class="hotel-image"
        style="
          background-image:url('${hotel.image}')
        ">

        <button
          class="favorite ${isFavorite(hotel.id) ? "active" : ""}"
          data-favorite="${hotel.id}"
          aria-label="Favorilere ekle"
          type="button">

          ${isFavorite(hotel.id) ? "♥" : "♡"}

        </button>

        <span class="rating">

          ★ ${hotel.rating}

          <small>
            (${hotel.reviews})
          </small>

        </span>

      </div>

      <div class="hotel-content">

        <span class="hotel-location">
          ${hotel.location}
        </span>

        <h3>
          ${hotel.name}
        </h3>

        <p>
          ${hotel.desc}
        </p>

        <div class="hotel-bottom">

          <div class="price">

            <strong>
              ${money(hotel.price)}
            </strong>

            <small>
              / gece
            </small>

          </div>

          <div class="hotel-actions">

            <button
              class="small-button"
              data-detail="${hotel.id}"
              type="button">

              Detay

            </button>

            <button
              class="small-button primary"
              data-book="${hotel.id}"
              type="button">

              Rezervasyon

            </button>

          </div>

        </div>

      </div>

    `;

    grid.appendChild(card);

  });


  $$("[data-favorite]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          toggleFavorite(
            Number(
              button.dataset.favorite
            )
          );

        }
      );

    });


  $$("[data-detail]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openHotel(
            Number(
              button.dataset.detail
            )
          );

        }
      );

    });


  $$("[data-book]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openBooking(
            Number(
              button.dataset.book
            )
          );

        }
      );

    });

}


/* =========================================================
   MODAL
========================================================= */

function openModal(content) {

  const modal =
    $("#modal");

  const modalContent =
    $("#modalContent");

  if (!modal || !modalContent)
    return;

  modalContent.innerHTML =
    content;

  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  const modal =
    $("#modal");

  if (!modal) return;

  modal.classList.remove(
    "active"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   OTEL DETAY
========================================================= */

function openHotel(id) {

  const hotel =
    hotels.find(
      item => item.id === id
    );

  if (!hotel) return;


  openModal(`

    <div
      style="
        height:220px;
        border-radius:14px;
        background:url('${hotel.image}')
        center/cover;
        margin-bottom:20px;
      ">
    </div>

    <span class="eyebrow blue">
      ${hotel.location}
    </span>

    <h2>
      ${hotel.name}
    </h2>

    <p>
      ${hotel.desc}
    </p>

    <div class="booking-summary">

      <b>
        ★ ${hotel.rating}
      </b>

      · ${hotel.reviews} değerlendirme

      <br><br>

      <strong>
        ${money(hotel.price)}
      </strong>

      / gece

    </div>

    <button
      class="main-button"
      id="modalBookingButton"
      type="button">

      Bu oteli rezerve et

    </button>

  `);


  const bookingButton =
    $("#modalBookingButton");

  if (bookingButton) {

    bookingButton.addEventListener(
      "click",
      () => openBooking(id)
    );

  }

}


/* =========================================================
   TARİH
========================================================= */

function isoDate(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


/* =========================================================
   REZERVASYON NUMARASI
========================================================= */

function generateBookingNumber() {

  const time =
    Date.now()
      .toString()
      .slice(-7);

  const random =
    Math.floor(
      100 +
      Math.random() * 900
    );

  return `YC-${time}-${random}`;

}


/* =========================================================
   WHATSAPP
========================================================= */

function openWhatsApp(message) {

  if (!WHATSAPP_NUMBER) {

    toast(
      "WhatsApp numarası henüz eklenmedi."
    );

    return;

  }

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =========================================================
   SUPABASE REZERVASYON KAYDI
========================================================= */

async function saveBookingToSupabase(request) {

  if (!supabaseClient) {

    console.warn(
      "Supabase bağlantısı hazır değil."
    );

    return {
      success: false,
      error: "Supabase bağlantısı bulunamadı."
    };

  }


  try {

    const { data, error } =
      await supabaseClient
        .from("bookings")
        .insert({

          booking_number:
            request.bookingNumber,

          customer_name:
            request.name,

          email:
            request.email,

          phone:
            request.phone,

          hotel_name:
            request.hotel,

          location:
            request.location,

          checkin:
            request.checkin,

          checkout:
            request.checkout,

          guests:
            request.guests,

          status:
            request.status

        })
        .select()
        .single();


    if (error) {

      console.error(
        "Supabase rezervasyon hatası:",
        error
      );

      return {
        success: false,
        error: error.message
      };

    }


    console.log(
      "Rezervasyon Supabase'e kaydedildi:",
      data
    );


    return {
      success: true,
      data
    };


  } catch (error) {

    console.error(
      "Supabase bağlantı hatası:",
      error
    );

    return {
      success: false,
      error: error.message
    };

  }

}


/* =========================================================
   REZERVASYON
========================================================= */

function openBooking(id) {

  const hotel =
    hotels.find(
      item => item.id === id
    );

  if (!hotel) return;


  openModal(`

    <h2>
      Rezervasyon talebi
    </h2>

    <p>
      ${hotel.name}
    </p>

    <div class="booking-summary">

      <b>
        ${hotel.location}
      </b>

      <br><br>

      ${money(hotel.price)} / gece

    </div>

    <form
      class="booking-form"
      id="bookingForm">

      <label>
        Ad Soyad

        <input
          id="bookName"
          type="text"
          required
          autocomplete="name"
          placeholder="Adınız Soyadınız">

      </label>

      <label>
        E-posta

        <input
          id="bookEmail"
          type="email"
          required
          autocomplete="email"
          placeholder="ornek@mail.com">

      </label>

      <label>
        Telefon

        <input
          id="bookPhone"
          type="tel"
          required
          autocomplete="tel"
          placeholder="+90 5xx xxx xx xx">

      </label>

      <label>
        Giriş

        <input
          id="bookIn"
          type="date"
          required>

      </label>

      <label>
        Çıkış

        <input
          id="bookOut"
          type="date"
          required>

      </label>

      <label>
        Misafir

        <select id="bookGuests">

          <option value="1">
            1 kişi
          </option>

          <option value="2" selected>
            2 kişi
          </option>

          <option value="3">
            3 kişi
          </option>

          <option value="4">
            4 kişi
          </option>

          <option value="5">
            5 kişi
          </option>

          <option value="6+">
            6+ kişi
          </option>

        </select>

      </label>

      <button
        class="main-button"
        id="bookingSubmit"
        type="submit">

        Rezervasyon talebi gönder

      </button>

    </form>

  `);


  const today =
    new Date();


  const tomorrow =
    new Date(today);

  tomorrow.setDate(
    today.getDate() + 1
  );


  const after =
    new Date(today);

  after.setDate(
    today.getDate() + 3
  );


  const bookIn =
    $("#bookIn");

  const bookOut =
    $("#bookOut");


  if (bookIn) {

    bookIn.value =
      isoDate(tomorrow);

    bookIn.min =
      isoDate(today);

  }


  if (bookOut) {

    bookOut.value =
      isoDate(after);

    bookOut.min =
      isoDate(tomorrow);

  }


  if (bookIn && bookOut) {

    bookIn.addEventListener(
      "change",
      () => {

        bookOut.min =
          bookIn.value;

      }
    );

  }


  const bookingForm =
    $("#bookingForm");


  if (!bookingForm) return;


  bookingForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const checkinValue =
        $("#bookIn").value;

      const checkoutValue =
        $("#bookOut").value;


      if (
        !checkinValue ||
        !checkoutValue
      ) {

        toast(
          "Lütfen tarihleri seçin."
        );

        return;

      }


      const checkin =
        new Date(
          checkinValue +
          "T00:00:00"
        );


      const checkout =
        new Date(
          checkoutValue +
          "T00:00:00"
        );


      if (checkout <= checkin) {

        toast(
          "Çıkış tarihi giriş tarihinden sonra olmalı."
        );

        return;

      }


      const name =
        $("#bookName")
          .value
          .trim();

      const email =
        $("#bookEmail")
          .value
          .trim();

      const phone =
        $("#bookPhone")
          .value
          .trim();

      const guests =
        $("#bookGuests")
          .value;


      if (!name || !email || !phone) {

        toast(
          "Lütfen tüm bilgileri doldurun."
        );

        return;

      }


      const bookingNumber =
        generateBookingNumber();


      const request = {

        bookingNumber,

        hotelId:
          hotel.id,

        hotel:
          hotel.name,

        location:
          hotel.location,

        name,

        email,

        phone,

        checkin:
          checkinValue,

        checkout:
          checkoutValue,

        guests,

        createdAt:
          new Date().toISOString(),

        status:
          "Yeni talep"

      };


      /* =====================================================
         LOCAL STORAGE
      ===================================================== */

      localStorage.setItem(
        "yc_last_booking",
        JSON.stringify(request)
      );


      const bookings =
        JSON.parse(
          localStorage.getItem(
            "yc_bookings"
          ) || "[]"
        );


      bookings.push(request);


      localStorage.setItem(
        "yc_bookings",
        JSON.stringify(bookings)
      );


      /* =====================================================
         BUTON DURUMU
      ===================================================== */

      const submitButton =
        $("#bookingSubmit");


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Rezervasyon gönderiliyor...";

      }


      /* =====================================================
         SUPABASE
      ===================================================== */

      const result =
        await saveBookingToSupabase(
          request
        );


      if (submitButton) {

        submitButton.disabled =
          false;

      }


      /* =====================================================
         WHATSAPP
      ===================================================== */

      const whatsappMessage =

`Merhaba Yılmaz Çalışkan Turizm,

Rezervasyon talebi oluşturmak istiyorum.

Rezervasyon No:
${bookingNumber}

Otel:
${hotel.name}

Konum:
${hotel.location}

Ad Soyad:
${request.name}

Telefon:
${request.phone}

E-posta:
${request.email}

Giriş:
${request.checkin}

Çıkış:
${request.checkout}

Misafir:
${request.guests}

Teşekkürler.`;


      /* =====================================================
         BAŞARI EKRANI
      ===================================================== */

      openModal(`

        <div
          style="
            text-align:center;
            padding:10px;
          ">

          <div
            style="
              width:70px;
              height:70px;
              margin:0 auto 18px;
              display:grid;
              place-items:center;
              border-radius:50%;
              background:#eaf1ff;
              color:#0b3d91;
              font-size:38px;
              font-weight:900;
            ">

        
