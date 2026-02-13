import { initApp, html } from "../../app.js";
import { products } from "../../data/products.js";
import cart from "../../state/cart.js";
import { formatPrice, splitPrice } from "../../utils/currency.js";
import { renderStars } from "../../utils/ui.js";

function renderReviews(reviews) {
  return reviews
    .map(
      (review) => html`
        <div class="py-4 border-b border-gray-300">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex items-center gap-1">
              <span class="text-amazon-star text-sm">
                ${renderStars(review.rating)}
              </span>
            </div>
            <span class="font-bold text-amazon-text">${review.title}</span>
          </div>
          <div class="text-xs text-amazon-text-secondary mb-2">
            By ${review.author} on ${new Date(review.date).toLocaleDateString()}
            ${review.verified
              ? html`<span class="text-amazon-link ml-2"
                  >Verified Purchase</span
                >`
              : ""}
          </div>
          <p class="text-amazon-text text-sm">${review.comment}</p>
          <div class="mt-2 text-xs text-amazon-text-secondary">
            ${review.helpful} people found this helpful
          </div>
        </div>
      `,
    )
    .join("");
}

function renderProduct(product) {
  const app = document.getElementById("app");
  app.className = "bg-white";

  app.innerHTML = html`
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Breadcrumb -->
      <div class="text-xs mb-4">
        <a
          href="${import.meta.env.BASE_URL}src/pages/home/"
          class="text-amazon-link hover:text-amazon-dark-orange"
          >Home</a
        >
        <span class="mx-2">&gt;</span>
        <a
          href="${import.meta.env
            .BASE_URL}src/pages/home/?category=${encodeURIComponent(
            product.category,
          )}"
          class="text-amazon-link hover:text-amazon-dark-orange"
          >${product.category}</a
        >
        <span class="mx-2">&gt;</span>
        <span class="text-amazon-text-secondary">${product.name}</span>
      </div>

      <!-- Main Product Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Product Image -->
        <div class="lg:col-span-5">
          <div class="sticky top-4">
            ${product.badge
              ? html`<div class="mb-3">
                  <span
                    class="bg-amazon-deal-red text-white text-xs font-bold px-2 py-1 rounded-sm"
                    >${product.badge}</span
                  >
                </div>`
              : ""}
            <img
              src="${product.image}"
              alt="${product.name}"
              class="w-full max-w-md mx-auto border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <!-- Middle: Product Details -->
        <div class="lg:col-span-4">
          <h1 class="text-2xl text-amazon-text mb-2">${product.name}</h1>

          <!-- Ratings -->
          <div class="flex items-center gap-2 mb-4">
            <span class="text-amazon-star text-sm"
              >${renderStars(product.ratings.average)}</span
            >
            <span
              class="text-sm text-amazon-link hover:text-amazon-dark-orange cursor-pointer"
            >
              ${product.ratings.average} out of 5 stars
            </span>
            <span class="text-sm text-amazon-text-secondary">
              ${product.ratings.count.toLocaleString()} ratings
            </span>
          </div>

          <div class="border-t border-b border-gray-300 py-4 mb-4">
            <!-- Price -->
            ${product.discount
              ? html`<div class="mb-2">
                  <span class="text-amazon-deal-red text-sm font-bold"
                    >-${product.discount.percentage}%</span
                  >
                  <span class="ml-2 text-xs text-amazon-text-secondary"
                    >Deal</span
                  >
                </div>`
              : ""}
            <div class="flex items-baseline gap-2 mb-2">
              <span class="text-xs align-top">$</span>
              <span class="text-3xl font-normal text-amazon-text"
                >${splitPrice(product.price).dollars}</span
              >
              <span class="text-sm align-top"
                >${splitPrice(product.price).cents}</span
              >
            </div>
            ${product.discount
              ? html`<div class="text-sm text-amazon-text-secondary">
                  List Price:
                  <span class="line-through"
                    >${formatPrice(product.discount.originalPrice)}</span
                  >
                </div>`
              : ""}
            ${product.prime
              ? html`<div class="mt-2">
                  <span class="text-amazon-link text-sm font-bold">Prime</span>
                </div>`
              : ""}
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h2 class="font-bold text-amazon-text mb-2">About this item</h2>
            <p class="text-sm text-amazon-text">${product.description}</p>
          </div>

          <!-- Product Tags -->
          ${product.tags && product.tags.length > 0
            ? html`<div class="mb-6">
                <div class="flex flex-wrap gap-2">
                  ${product.tags
                    .map(
                      (tag) =>
                        html`<span class="text-xs bg-gray-200 px-2 py-1 rounded"
                          >${tag}</span
                        >`,
                    )
                    .join("")}
                </div>
              </div>`
            : ""}
        </div>

        <!-- Right: Buy Box -->
        <div class="lg:col-span-3">
          <div class="border border-gray-300 rounded-lg p-4 sticky top-4">
            <!-- Price -->
            <div class="flex items-baseline gap-2 mb-3">
              <span class="text-xs align-top">$</span>
              <span class="text-3xl font-normal text-amazon-text"
                >${splitPrice(product.price).dollars}</span
              >
              <span class="text-sm align-top"
                >${splitPrice(product.price).cents}</span
              >
            </div>

            ${product.prime
              ? html`<div class="mb-3">
                  <span class="text-amazon-link text-sm font-bold">Prime</span>
                  <span class="text-xs text-amazon-text">FREE delivery</span>
                </div>`
              : ""}

            <!-- Stock Status -->
            ${product.inStock
              ? html`<div class="text-amazon-success text-lg font-medium mb-3">
                  In Stock
                </div>`
              : html`<div class="text-amazon-deal-red text-lg font-medium mb-3">
                  Currently unavailable
                </div>`}

            <!-- Seller Info -->
            <div class="text-sm text-amazon-text-secondary mb-4">
              <div>
                Ships from
                <span class="text-amazon-text"
                  >${product.sellerInfo.shipsFrom}</span
                >
              </div>
              <div>
                Sold by
                <span class="text-amazon-text">${product.sellerInfo.name}</span>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <button
              id="add-to-cart-btn"
              data-product-id="${product.id}"
              class="w-full bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text text-sm font-medium py-2 px-4 rounded-full mb-2 ${!product.inStock
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"}"
              ${!product.inStock ? "disabled" : ""}
            >
              Add to Cart
            </button>

            <button
              id="buy-now-btn"
              data-product-id="${product.id}"
              class="w-full bg-amazon-orange hover:bg-amazon-dark-orange text-white text-sm font-medium py-2 px-4 rounded-full ${!product.inStock
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"}"
              ${!product.inStock ? "disabled" : ""}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <!-- Customer Reviews Section -->
      <div class="mt-12 max-w-4xl">
        <h2 class="text-2xl font-bold text-amazon-text mb-6">
          Customer reviews
        </h2>

        <!-- Overall Rating -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-300">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-amazon-star text-lg"
                >${renderStars(product.ratings.average)}</span
              >
              <span class="text-lg font-bold text-amazon-text"
                >${product.ratings.average} out of 5</span
              >
            </div>
            <div class="text-sm text-amazon-text-secondary">
              ${product.ratings.count.toLocaleString()} global ratings
            </div>
          </div>
        </div>

        <!-- Individual Reviews -->
        <div>
          <h3 class="font-bold text-amazon-text mb-4">Top reviews</h3>
          ${renderReviews(product.reviews)}
        </div>
      </div>
    </div>
  `;
}

function setupProductListeners(product) {
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const buyNowBtn = document.getElementById("buy-now-btn");

  if (addToCartBtn && product.inStock) {
    addToCartBtn.addEventListener("click", () => {
      cart.addItem(product);
      addToCartBtn.textContent = "Added to Cart";

      setTimeout(() => {
        addToCartBtn.textContent = "Add to Cart";
      }, 2000);
    });
  }

  if (buyNowBtn && product.inStock) {
    buyNowBtn.addEventListener("click", () => {
      if (!cart.items[product.id]) {
        cart.addItem(product);
      }
      window.location.href = `${import.meta.env.BASE_URL}src/pages/checkout/?buyNow=${product.id}`;
    });
  }
}

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

// Find product
const product = products.find((p) => p.id === productId);

// Initialize
initApp();

if (product) {
  renderProduct(product);
  setupProductListeners(product);
} else {
  // Product not found
  const app = document.getElementById("app");
  app.className = "bg-white";
  app.innerHTML = html`
    <div class="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 class="text-3xl font-bold text-amazon-text mb-4">
        Product Not Found
      </h1>
      <p class="text-amazon-text-secondary mb-6">
        The product you're looking for doesn't exist.
      </p>
      <a
        href="${import.meta.env.BASE_URL}"
        class="inline-block bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text font-medium py-2 px-6 rounded-full"
      >
        Continue Shopping
      </a>
    </div>
  `;
}
