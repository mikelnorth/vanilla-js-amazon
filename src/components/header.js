import { getAddress } from "../utils/location.js";
import { locationStorage } from "../utils/storage.js";

const html = String.raw;

export function updateCartCount(count) {
  const cartCountEl = document.getElementById("cart-count");
  if (!cartCountEl) return;

  cartCountEl.textContent = count;

  // Adjust font size for double digits
  if (count >= 10) {
    cartCountEl.classList.remove("text-base");
    cartCountEl.classList.add("text-sm");
  } else {
    cartCountEl.classList.remove("text-sm");
    cartCountEl.classList.add("text-base");
  }
}

function loadLocation(forceRefresh = false) {
  const el = document.getElementById("header-location");
  if (!el) return;

  // Check localStorage for cached location
  const cached = locationStorage.get();

  if (cached && !forceRefresh) {
    const { city, zip } = cached;
    el.textContent = `${city} ${zip}`;
    el.classList.remove("cursor-pointer", "hover:text-amazon-search");
    return;
  }

  // Fetch from API
  el.textContent = "Loading...";

  getAddress()
    .then(({ city, zip }) => {
      el.textContent = `${city} ${zip}`;
      el.classList.remove("cursor-pointer", "hover:text-amazon-search");
      // Cache the result
      locationStorage.set({ city, zip });
    })
    .catch(() => {
      el.textContent = "Set location";
      el.classList.add("cursor-pointer", "hover:text-amazon-search");
    });
}

export function renderHeader() {
  const header = document.createElement("header");
  header.className =
    "bg-amazon-header text-white px-6 py-3 flex items-center gap-6";

  header.innerHTML = html`
    <a href="${import.meta.env.BASE_URL}" class="flex items-center">
      <span class="nav-sprite nav-logo"></span>
    </a>
    <div class="flex items-center justify-between w-full gap-6">
      <div class="flex items-center gap-1 text-xs w-52">
        <span class="nav-sprite nav-location"></span>
        <div>
          <div class="text-amazon-text-tertiary">Deliver to</div>
          <div
            id="header-location"
            class="font-bold cursor-pointer hover:text-amazon-search"
          >
            Loading...
          </div>
        </div>
      </div>
      <div class="w-full">
        <input
          type="text"
          placeholder="Search Amazon"
          class="bg-white rounded-md p-2 w-full text-amazon-text placeholder:text-amazon-text-secondary"
        />
      </div>
      <nav class="flex items-center gap-6">
        <a
          href="${import.meta.env.BASE_URL}src/pages/home/"
          class="hover:text-amazon-search"
          >Products</a
        >
        <a
          href="${import.meta.env.BASE_URL}src/pages/checkout/"
          class="hover:text-amazon-search flex items-end "
        >
          <div class="relative w-[38px] h-[26px]">
            <span class="nav-sprite nav-cart"></span>
            <span
              id="cart-count"
              class="text-amazon-cart-orange font-bold absolute top-[-10px] left-[58%] -translate-x-1/2 text-base"
            >
              0
            </span>
          </div>
          <span class="text-xs font-bold leading-none">Cart</span>
        </a>
      </nav>
    </div>
  `;

  document.body.prepend(header);

  // Load location
  loadLocation();

  // Add click handler to re-prompt for location
  const locationEl = document.getElementById("header-location");
  if (locationEl) {
    locationEl.addEventListener("click", () => {
      loadLocation(true); // Force refresh to re-prompt for location
    });
  }
}
