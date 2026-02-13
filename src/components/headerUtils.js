import { products } from "../data/products.js";

// ===== Tag Management =====

export function getAllTags() {
  const tagSet = new Set();
  products.forEach((product) => {
    if (product.tags) {
      product.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}

export function filterMatchingTags(searchValue, allTags, limit = 8) {
  return allTags
    .filter((tag) => tag.toLowerCase().includes(searchValue.toLowerCase()))
    .slice(0, limit);
}

// ===== Dropdown Rendering =====

export function renderDropdownItems(tags) {
  return tags
    .map(
      (tag) => `
      <div class="px-4 py-2 hover:bg-amazon-search cursor-pointer text-amazon-text border-b border-gray-200 last:border-b-0" data-tag="${tag}">
        ${tag}
      </div>
    `
    )
    .join("");
}

// ===== URL Management =====

export function updateSearchUrl(searchValue) {
  const url = new URL(window.location);
  if (searchValue) {
    url.searchParams.set("search", searchValue);
  } else {
    url.searchParams.delete("search");
  }
  window.history.pushState({}, "", url);
  window.dispatchEvent(new CustomEvent("searchUpdate"));
}

export function getSearchValueFromUrl() {
  return new URLSearchParams(window.location.search).get("search");
}

// ===== Dropdown Visibility =====

export function showDropdown(dropdown) {
  dropdown.classList.remove("hidden");
}

export function hideDropdown(dropdown) {
  dropdown.classList.add("hidden");
}

export function toggleDropdown(dropdown, show) {
  if (show) {
    showDropdown(dropdown);
  } else {
    hideDropdown(dropdown);
  }
}
