import { initApp, html } from "../../app.js";
import cart from "../../state/cart.js";
import checkout from "../../state/checkout.js";
import { formatPrice } from "../../utils/currency.js";
import { renderCartItems } from "../../components/cartView.js";

function render() {
  switch (checkout.currentView) {
    case "review":
      renderReviewView();
      break;
    case "success":
      renderSuccessView();
      break;
    default:
      renderCartView();
      break;
  }
}

// ── Cart View ──────────────────────────────────────────────

function renderCartView() {
  const app = document.getElementById("app");
  app.className = "bg-white";

  app.innerHTML = html`
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main Cart Section -->
        <div class="lg:col-span-9">
          <h1 class="text-3xl text-amazon-text mb-2">Shopping Cart</h1>
          <div id="cart-items"></div>
        </div>

        <!-- Subtotal Sidebar -->
        <div class="lg:col-span-3">
          <div
            class="bg-white border border-gray-300 rounded-lg p-4 sticky top-4"
            id="cart-summary"
          ></div>
        </div>
      </div>
    </div>
  `;

  renderCartItems(cart, checkout);
  renderCartSummary();
}

function renderCartSummary() {
  const summary = document.getElementById("cart-summary");
  if (!summary) return;

  const itemCount = checkout.getSelectedCount(cart);
  const total = checkout.getSelectedTotal(cart);
  const disabled = itemCount === 0;

  summary.innerHTML = html`
    <div class="mb-4">
      <div class="text-sm text-amazon-success mb-2">
        <svg
          class="inline w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Your order qualifies for FREE Delivery.
        <a href="#" class="text-amazon-link hover:text-amazon-dark-orange"
          >Select this option at checkout.</a
        >
      </div>
    </div>

    <div class="text-lg mb-4">
      Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"}):
      <span class="font-bold text-amazon-text">${formatPrice(total)}</span>
    </div>

    <button
      id="proceed-to-checkout"
      class="w-full text-sm font-medium py-2 px-4 rounded-full mb-2 ${disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text"}"
      ${disabled ? "disabled" : ""}
    >
      Proceed to checkout
    </button>
  `;
}

// ── Review View ────────────────────────────────────────────

function renderReviewView() {
  const app = document.getElementById("app");
  app.className = "bg-white";

  const selectedItems = checkout.getSelectedItems(cart);
  const itemCount = checkout.getSelectedCount(cart);
  const total = checkout.getSelectedTotal(cart);

  app.innerHTML = html`
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Order Review Section -->
        <div class="lg:col-span-9">
          <h1 class="text-3xl text-amazon-text mb-2">Review your order</h1>
          <div class="border-b border-gray-300 mb-4 pb-2">
            <span class="text-amazon-text-secondary text-sm"
              >${itemCount} ${itemCount === 1 ? "item" : "items"} selected</span
            >
          </div>

          ${selectedItems
            .map(
              (item) => html`
                <div class="flex gap-4 py-4 border-b border-gray-300">
                  <div class="shrink-0">
                    <img
                      src="${item.image}"
                      alt="${item.name}"
                      class="w-28 h-28 object-contain"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-base text-amazon-text">${item.name}</div>
                    <div class="text-sm text-amazon-text-secondary mt-1">
                      Qty: ${item.quantity}
                    </div>
                  </div>
                  <div class="shrink-0 text-right">
                    <div class="text-lg font-bold text-amazon-text">
                      ${formatPrice(item.price)}
                    </div>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-3">
          <div
            class="bg-white border border-gray-300 rounded-lg p-4 sticky top-4"
          >
            <button
              id="place-order"
              class="w-full bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text text-sm font-medium py-2 px-4 rounded-full mb-4"
            >
              Place your order
            </button>

            <h2
              class="text-lg font-bold text-amazon-text mb-3 border-b border-gray-300 pb-2"
            >
              Order Summary
            </h2>

            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span>Items (${itemCount}):</span>
                <span>${formatPrice(total)}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping &amp; handling:</span>
                <span>$0.00</span>
              </div>
              <div
                class="border-t border-gray-300 pt-2 flex justify-between font-bold text-lg text-amazon-deal-red"
              >
                <span>Order total:</span>
                <span>${formatPrice(total)}</span>
              </div>
            </div>

            <button
              id="back-to-cart"
              class="w-full text-amazon-link hover:text-amazon-dark-orange text-sm mt-4"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Success View ───────────────────────────────────────────

function renderSuccessView() {
  const app = document.getElementById("app");
  app.className = "bg-white";

  app.innerHTML = html`
    <div class="max-w-2xl mx-auto px-4 py-16 text-center">
      <div class="mb-6">
        <svg
          class="w-20 h-20 mx-auto text-amazon-success"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-amazon-text mb-4">
        Order placed, thank you!
      </h1>
      <p class="text-amazon-text-secondary text-lg mb-8">
        Your order has been confirmed. You will receive an email confirmation
        shortly.
      </p>
      <a
        href="${import.meta.env.BASE_URL}src/pages/home/"
        class="inline-block bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-text text-sm font-medium py-2 px-6 rounded-full"
      >
        Continue Shopping
      </a>
    </div>
  `;
}

// ── Event Listeners ────────────────────────────────────────

function setupCheckoutListeners() {
  const app = document.getElementById("app");

  app.addEventListener("click", (e) => {
    // Toggle all
    if (e.target.id === "toggle-all") {
      e.preventDefault();
      const allSelected = cart
        .getItems()
        .every((item) => checkout.isSelected(item.id));
      if (allSelected) {
        checkout.deselectAll();
      } else {
        checkout.selectAll(cart);
      }
      renderCartItems(cart, checkout);
      renderCartSummary();
      return;
    }

    // Proceed to checkout
    if (
      e.target.id === "proceed-to-checkout" ||
      e.target.closest("#proceed-to-checkout")
    ) {
      if (checkout.getSelectedCount(cart) === 0) return;
      checkout.currentView = "review";
      render();
      return;
    }

    // Place order
    if (e.target.id === "place-order" || e.target.closest("#place-order")) {
      checkout.placeOrder(cart);
      render();
      return;
    }

    // Back to cart
    if (e.target.id === "back-to-cart" || e.target.closest("#back-to-cart")) {
      checkout.syncWithCart(cart);
      checkout.currentView = "cart";
      render();
      return;
    }

    const button = e.target.closest("button");
    if (!button) return;

    const productId = parseInt(button.dataset.productId);
    if (!productId) return;

    // Increase quantity
    if (button.classList.contains("cart-increase")) {
      const product = cart.items[productId];
      if (product) {
        cart.addItem(product);
        checkout.syncWithCart(cart);
        renderCartItems(cart, checkout);
        renderCartSummary();
      }
    }

    // Decrease quantity
    if (button.classList.contains("cart-decrease")) {
      cart.removeItem(productId);
      checkout.syncWithCart(cart);
      renderCartItems(cart, checkout);
      renderCartSummary();
    }

    // Delete item
    if (button.classList.contains("cart-delete")) {
      cart.deleteItem(productId);
      checkout.syncWithCart(cart);
      renderCartItems(cart, checkout);
      renderCartSummary();
    }

    // Save for later (placeholder)
    if (button.classList.contains("cart-save-later")) {
      e.preventDefault();
      alert("Save for later functionality coming soon!");
    }

    // Compare (placeholder)
    if (button.classList.contains("cart-compare")) {
      e.preventDefault();
      alert("Compare functionality coming soon!");
    }

    // Share (placeholder)
    if (button.classList.contains("cart-share")) {
      e.preventDefault();
      alert("Share functionality coming soon!");
    }
  });

  // Checkbox change events (bubble as "change", not "click")
  app.addEventListener("change", (e) => {
    if (e.target.classList.contains("cart-item-checkbox")) {
      const productId = parseInt(e.target.dataset.productId);
      if (!productId) return;
      checkout.toggle(productId);
      renderCartSummary();
    }
  });
}

initApp();

// Handle buyNow query param: select only that item and go straight to review
const urlParams = new URLSearchParams(window.location.search);
const buyNowId = parseInt(urlParams.get("buyNow"));

if (buyNowId && cart.items[buyNowId]) {
  checkout.init(cart);
  1;
  checkout.deselectAll();
  checkout.toggle(buyNowId);
  checkout.currentView = "review";
} else {
  checkout.init(cart);
}

render();
setupCheckoutListeners();
