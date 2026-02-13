import { html } from "../app.js";
import { getAddress } from "../utils/location.js";
import { locationStorage } from "../utils/storage.js";
import {
  getAllTags,
  filterMatchingTags,
  renderDropdownItems,
  updateSearchUrl,
  getSearchValueFromUrl,
  showDropdown,
  hideDropdown,
} from "./headerUtils.js";

// ===== Location Management =====

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

// ===== Cart Management =====

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

// ===== Event Handler Functions =====

function handleSearchInput(e, autocompleteDropdown, allTags) {
  const searchValue = e.target.value.trim();
  
  // Update URL and trigger search
  updateSearchUrl(searchValue);

  // Show autocomplete suggestions
  if (searchValue.length > 0) {
    const matchingTags = filterMatchingTags(searchValue, allTags);

    if (matchingTags.length > 0) {
      autocompleteDropdown.innerHTML = renderDropdownItems(matchingTags);
      showDropdown(autocompleteDropdown);
    } else {
      hideDropdown(autocompleteDropdown);
    }
  } else {
    hideDropdown(autocompleteDropdown);
  }
}

function handleDropdownClick(e, searchInput, autocompleteDropdown) {
  const tagElement = e.target.closest("[data-tag]");
  if (!tagElement) return;

  const tag = tagElement.dataset.tag;
  searchInput.value = tag;
  hideDropdown(autocompleteDropdown);

  // Update URL and trigger search
  updateSearchUrl(tag);
}

function handleClickOutside(e, searchInput, autocompleteDropdown) {
  if (
    !searchInput.contains(e.target) &&
    !autocompleteDropdown.contains(e.target)
  ) {
    hideDropdown(autocompleteDropdown);
  }
}

function handleSearchFocus(e, autocompleteDropdown, allTags) {
  const searchValue = e.target.value.trim();
  
  if (searchValue.length > 0) {
    const matchingTags = filterMatchingTags(searchValue, allTags);

    if (matchingTags.length > 0) {
      autocompleteDropdown.innerHTML = renderDropdownItems(matchingTags);
      showDropdown(autocompleteDropdown);
    }
  }
}

function handleKeyboardNavigation(e, autocompleteDropdown) {
  const items = autocompleteDropdown.querySelectorAll("[data-tag]");
  if (items.length === 0) return;

  const currentActive = autocompleteDropdown.querySelector(".bg-gray-200");
  let currentIndex = -1;

  if (currentActive) {
    currentIndex = Array.from(items).indexOf(currentActive);
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = Math.min(currentIndex + 1, items.length - 1);
    items.forEach((item) => item.classList.remove("bg-gray-200"));
    items[nextIndex]?.classList.add("bg-gray-200");
    items[nextIndex]?.scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prevIndex = Math.max(currentIndex - 1, 0);
    items.forEach((item) => item.classList.remove("bg-gray-200"));
    items[prevIndex]?.classList.add("bg-gray-200");
    items[prevIndex]?.scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter" && currentActive) {
    e.preventDefault();
    currentActive.click();
  } else if (e.key === "Escape") {
    hideDropdown(autocompleteDropdown);
  }
}

function handleLocationClick() {
  loadLocation(true);
}

// ===== Setup Event Listeners =====

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  const autocompleteDropdown = document.getElementById("autocomplete-dropdown");
  const locationEl = document.getElementById("header-location");
  const allTags = getAllTags();

  // Search input events
  if (searchInput && autocompleteDropdown) {
    searchInput.addEventListener("input", (e) =>
      handleSearchInput(e, autocompleteDropdown, allTags)
    );

    searchInput.addEventListener("focus", (e) =>
      handleSearchFocus(e, autocompleteDropdown, allTags)
    );

    searchInput.addEventListener("keydown", (e) =>
      handleKeyboardNavigation(e, autocompleteDropdown)
    );

    // Dropdown events
    autocompleteDropdown.addEventListener("click", (e) =>
      handleDropdownClick(e, searchInput, autocompleteDropdown)
    );

    // Click outside to close dropdown
    document.addEventListener("click", (e) =>
      handleClickOutside(e, searchInput, autocompleteDropdown)
    );
  }

  // Location click event
  if (locationEl) {
    locationEl.addEventListener("click", handleLocationClick);
  }
}

// ===== Main Render Function =====

export function renderHeader() {
  const searchValue = getSearchValueFromUrl();
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
      <div class="w-full relative">
        <input
          type="text"
          id="search-input"
          placeholder="Search Amazon"
          class="bg-white rounded-md p-2 w-full text-amazon-text placeholder:text-amazon-text-secondary"
          value="${searchValue || ""}"
        />
        <div
          id="autocomplete-dropdown"
          class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto z-50 hidden"
        ></div>
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

  // Initialize location
  loadLocation();

  // Setup all event listeners
  setupEventListeners();
}
