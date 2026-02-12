import { formatPrice } from "../utils/currency.js";
import { renderStars } from "../utils/ui.js";

const html = String.raw;

function renderBadge(badge) {
  if (!badge) return "";
  const colors = {
    "Best Seller": "bg-amazon-deal-red",
    "Amazon's Choice": "bg-amazon-subnav",
    "Limited Time Deal": "bg-amazon-deal-red",
  };
  const bg = colors[badge] || "bg-amazon-subnav";
  return html`<span
    class="${bg} text-white text-xs font-bold px-2 py-1 rounded-sm"
  >
    ${badge}
  </span>`;
}

function renderPrice(product) {
  if (product.discount) {
    return html`
      <div class="flex items-baseline gap-2">
        <span class="text-amazon-deal-red text-sm font-bold">
          -${product.discount.percentage}%
        </span>
        <span class="text-2xl font-bold text-amazon-text">
          ${formatPrice(product.price)}
        </span>
      </div>
      <div class="text-sm text-amazon-text-secondary">
        List:
        <span class="line-through">
          ${formatPrice(product.discount.originalPrice)}
        </span>
      </div>
    `;
  }
  return html`
    <span class="text-2xl font-bold text-amazon-text">
      ${formatPrice(product.price)}
    </span>
  `;
}

export function productCard(product) {
  return html`
    <div
      class="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
      data-product-id="${product.id}"
    >
      ${renderBadge(product.badge)}
      <a href="/src/pages/product/?id=${product.id}" class="block">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="w-full h-48 object-contain"
        />
      </a>
      <a
        href="/src/pages/product/?id=${product.id}"
        class="text-amazon-link hover:text-amazon-dark-orange text-sm leading-tight line-clamp-2"
      >
        ${product.name}
      </a>
      <div class="flex items-center gap-1">
        <span class="text-amazon-star text-sm"
          >${renderStars(product.ratings.average)}</span
        >
        <span class="text-amazon-link-blue text-xs">
          ${product.ratings.count.toLocaleString()}
        </span>
      </div>
      <div>${renderPrice(product)}</div>
      ${product.prime
        ? html`<span class="text-amazon-link text-xs font-bold">Prime</span>`
        : ""}
      ${product.inStock
        ? html`<span class="text-amazon-success text-xs">In Stock</span>`
        : html`<span class="text-amazon-deal-red text-xs">Out of Stock</span>`}
      <button
        class="mt-auto bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text text-sm font-medium py-2 px-4 rounded-full cursor-pointer"
        data-product-id="${product.id}"
      >
        Add to Cart
      </button>
    </div>
  `;
}
