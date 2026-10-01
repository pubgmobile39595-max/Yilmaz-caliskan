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
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1573053986275-840ffc7cc685?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85"
  }
];


/* =========================
   TEMEL DEĞİŞKENLER
========================= */

let favorites = JSON.parse(
  localStorage.getItem("yc_favorites") || "[]"
);

let currentHotels = [...hotels];

const $ = selector => document.querySelector(selector);

const $$ = selector => [
  ...document.querySelectorAll(selector)
];


/* =========================
   PARA FORMATLAMA
========================= */

function money(value) {

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0
  }).format(value);

}


/* =========================
   BİLDİRİM
========================= */

function toast(message) {

  const element = $("#toast");

  if (!element) return;

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {

    element.classList.remove("show");

  }, 2800);

}


/* =========================
   FAVORİLER
========================= */

function updateFavoriteCount() {

  $("#favoriteCount").textContent =
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

    favorites = favorites.filter(
      item => item !== id
    );

    toast("Otel favorilerden çıkarıldı.");

  } else {

    favorites.push(id);

    toast("Otel favorilere eklendi.");

  }

  saveFavorites();

  renderHotels(currentHotels);

}


/* =========================
   OTELLERİ OLUŞTUR
========================= */

function renderHotels(list = hotels) {

  currentHotels = list;

  const grid = $("#hotelGrid");

  const empty = $("#empty");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  empty.hidden = list.length !== 0;


  list.forEach(hotel => {

    const card = document.createElement("article");

    card.className = "hotel-card";

    card.innerHTML = `

      <div
        class="hotel-image"
        style="background-image:url('${hotel.image}')">

        <button
          class="favorite ${isFavorite(hotel.id) ? "active" : ""}"
          data-favorite="${hotel.id}"
          aria-label="Favorilere ekle">

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
              data-detail="${hotel.id}">

              Detay

            </button>


            <button
              class="small-button primary"
              data-book="${hotel.id}">

              Rezervasyon

            </button>

          </div>

        </div>

      </div>

    `;


    grid.appendChild(card);

  });


  /* FAVORİ BUTONLARI */

  $$("[data-favorite]").forEach(button => {

    button.addEventListener("click", () => {

      toggleFavorite(
        Number(button.dataset.favorite)
      );

    });

  });


  /* DETAY BUTONLARI */

  $$("[data-detail]").forEach(button => {

    button.addEventListener("click", () => {

      openHotel(
        Number(button.dataset.detail)
      );

    });

  });


  /* REZERVASYON BUTONLARI */

  $$("[data-book]").forEach(button => {

    button.addEventListener("click", () => {

      openBooking(
        Number(button.dataset.book)
      );

    });

  });

}


/* =========================
   MODAL
========================= */

function openModal(content) {

  $("#modalContent").innerHTML = content;

  $("#modal").classList.add("active");

  document.body.style.overflow = "hidden";

}


function closeModal() {

  $("#modal").classList.remove("active");

  document.body.style.overflow = "";

}


/* =========================
   OTEL DETAY
========================= */

function openHotel(id) {

  const hotel =
    hotels.find(item => item.id === id);

  if (!hotel) return;


  openModal(`

    <div
      style="
        height:220px;
        border-radius:12px;
        background:url('${hotel.image}') center/cover;
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
      id="modalBookingButton">

      Bu oteli rezerve et

    </button>

  `);


  $("#modalBookingButton")
    .addEventListener(
      "click",
      () => openBooking(id)
    );

}


/* =========================
   REZERVASYON
========================= */

function openBooking(id) {

  const hotel =
    hotels.find(item => item.id === id);

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
          required
          placeholder="Adınız Soyadınız">

      </label>


      <label>

        E-posta

        <input
          id="bookEmail"
          type="email"
          required
          placeholder="ornek@mail.com">

      </label>


      <label>

        Telefon

        <input
          id="bookPhone"
          type="tel"
          required
          placeholder="+90">

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

          <option>1</option>

          <option selected>
            2
          </option>

          <option>3</option>

          <option>4</option>

          <option>5</option>

          <option>6+</option>

        </select>

      </label>


      <button
        class="main-button"
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


  const iso =
    date => date.toISOString().slice(0, 10);


  $("#bookIn").value =
    iso(tomorrow);

  $("#bookOut").value =
    iso(after);


  $("#bookingForm")
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const checkin =
          new Date(
            $("#bookIn").value
          );


        const checkout =
          new Date(
            $("#bookOut").value
          );


        if (checkout <= checkin) {

          toast(
            "Çıkış tarihi giriş tarihinden sonra olmalı."
          );

          return;

        }


        const request = {

          hotel: hotel.name,

          name:
            $("#bookName").value,

          email:
            $("#bookEmail").value,

          phone:
            $("#bookPhone").value,

          checkin:
            $("#bookIn").value,

          checkout:
            $("#bookOut").value,

          guests:
            $("#bookGuests").value

        };


        localStorage.setItem(
          "yc_last_booking",
          JSON.stringify(request)
        );


        openModal(`

          <div
            style="
              text-align:center;
              padding:15px;
            ">

            <div
              style="
                font-size:50px;
                color:#0b3d91;
              ">

              ✓

            </div>


            <h2>
              Talebiniz alındı
            </h2>


            <p>
              Rezervasyon talebiniz
              demo olarak kaydedildi.
            </p>


            <button
              class="main-button"
              id="successClose">

              Tamam

            </button>

          </div>

        `);


        $("#successClose")
          .addEventListener(
            "click",
            closeModal
          );


        toast(
          "Rezervasyon talebi kaydedildi."
        );

      }
    );

}


/* =========================
   FİLTRE
========================= */

function applyFilter(city) {

  const list =
    city === "all"
      ? hotels
      : hotels.filter(
          hotel => hotel.city === city
        );


  $$(".filter").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.filter === city
    );

  });


  renderHotels(list);

}


/* =========================
   ANA ARAMA
========================= */

$("#searchForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const city =
        $("#destination").value;


      const checkin =
        new Date(
          $("#checkin").value
        );


      const checkout =
        new Date(
          $("#checkout").value
        );


      if (checkout <= checkin) {

        toast(
          "Çıkış tarihi giriş tarihinden sonra olmalı."
        );

        return;

      }


      applyFilter(city);


      $("#hotels")
        .scrollIntoView({
          behavior: "smooth"
        });


      toast(
        city === "all"
          ? "Tüm oteller gösteriliyor."
          : "Seçtiğiniz destinasyon gösteriliyor."
      );

    }
  );


/* =========================
   FİLTRE BUTONLARI
========================= */

$$(".filter").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      applyFilter(
        button.dataset.filter
      );

    }
  );

});


/* =========================
   DESTİNASYON KARTLARI
========================= */

$$(".destination-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const destination =
          card.dataset.destination;


        $("#destination").value =
          destination;


        applyFilter(destination);


        $("#hotels")
          .scrollIntoView({
            behavior: "smooth"
          });

      }
    );

  });


/* =========================
   TÜMÜNÜ GÖR
========================= */

$("#showAll")
  .addEventListener(
    "click",
    () => {

      applyFilter("all");

      $("#hotels")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );


/* =========================
   FAVORİLER
========================= */

$("#favoritesBtn")
  .addEventListener(
    "click",
    () => {

      const favoriteHotels =
        hotels.filter(
          hotel =>
            favorites.includes(hotel.id)
        );


      renderHotels(
        favoriteHotels
      );


      $("#hotels")
        .scrollIntoView({
          behavior: "smooth"
        });


      toast(
        favoriteHotels.length
          ? `${favoriteHotels.length} favori otel gösteriliyor.`
          : "Henüz favori oteliniz yok."
      );

    }
  );


/* =========================
   TUR DETAYLARI
========================= */

$$(".tour-detail")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const tour =
          button.dataset.tour;


        openModal(`

          <span class="eyebrow blue">
            TUR PROGRAMI
          </span>


          <h2>
            ${tour}
          </h2>


          <p>
            Bu tur hakkında detaylı bilgi,
            tarih ve kişi seçenekleri için
            Yılmaz Çalışkan Turizm ile
            iletişime geçebilirsiniz.
          </p>


          <div class="booking-summary">

            ✓ Program bilgisi

            <br>

            ✓ Konaklama seçeneği

            <br>

            ✓ Ulaşım planlaması

            <br>

            ✓ Destinasyon danışmanlığı

          </div>


          <button
            class="main-button"
            id="tourContact">

            Tur hakkında bilgi al

          </button>

        `);


        $("#tourContact")
          .addEventListener(
            "click",
            () => {

              closeModal();


              $("#contact")
                .scrollIntoView({
                  behavior: "smooth"
                });

            }
          );

      }
    );

  });


/* =========================
   İLETİŞİM FORMU
========================= */

$("#contactForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const contact = {

        name:
          $("#contactName").value,

        email:
          $("#contactEmail").value,

        message:
          $("#contactMessage").value

      };


      localStorage.setItem(
        "yc_contact",
        JSON.stringify(contact)
      );


      event.target.reset();


      toast(
        "Mesajınız demo olarak kaydedildi."
      );

    }
  );


/* =========================
   GİZLİLİK
========================= */

$("#privacy")
  .addEventListener(
    "click",
    () => {

      openModal(`

        <h2>
          Gizlilik Bilgilendirmesi
        </h2>


        <div
          style="
            color:#626d7d;
            font-size:13px;
            line-height:1.8;
          ">

          <p>
            Bu demo sitede form verileri
            herhangi bir sunucuya gönderilmez.
          </p>


          <p>
            Rezervasyon ve iletişim formu
            bilgileri yalnızca bu tarayıcıda
            demo amacıyla tutulur.
          </p>


          <p>
            Gerçek yayına geçmeden önce
            KVKK aydınlatma metni, çerez
            politikası ve gerekli yasal
            metinler hazırlanmalıdır.
          </p>

        </div>

      `);

    }
  );


/* =========================
   MODAL KAPATMA
========================= */

$("#modalClose")
  .addEventListener(
    "click",
    closeModal
  );


$(".modal-bg")
  .addEventListener(
    "click",
    closeModal
  );


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeModal();
    }

  }
);


/* =========================
   MOBİL MENÜ
========================= */

$("#menuBtn")
  .addEventListener(
    "click",
    () => {

      $("#navMenu")
        .classList.toggle("active");

    }
  );


$$("#navMenu a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        $("#navMenu")
          .classList.remove("active");

      }
    );

  });


/* =========================
   TARİHLER
========================= */

const today =
  new Date();


const tomorrow =
  new Date(today);

tomorrow.setDate(
  today.getDate() + 1
);


const afterTomorrow =
  new Date(today);

afterTomorrow.setDate(
  today.getDate() + 3
);


const iso =
  date => date.toISOString().slice(0, 10);


$("#checkin").value =
  iso(tomorrow);


$("#checkout").value =
  iso(afterTomorrow);


$("#checkin").min =
  iso(today);


$("#checkout").min =
  iso(tomorrow);


$("#checkin")
  .addEventListener(
    "change",
    () => {

      $("#checkout").min =
        $("#checkin").value;


      if (
        $("#checkout").value &&
        $("#checkout").value <=
        $("#checkin").value
      ) {

        $("#checkout").value = "";

      }

    }
  );


/* =========================
   YIL
========================= */

$("#year").textContent =
  new Date().getFullYear();


/* =========================
   BAŞLANGIÇ
========================= */

updateFavoriteCount();

renderHotels();
