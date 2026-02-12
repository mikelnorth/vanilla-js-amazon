import { formatPrice, perUnit } from "../utils/currency.js";

const html = String.raw;

function getDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2); // 2 days from now
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function renderCartItems(cart, checkout) {
  const cartContainer = document.querySelector("#cart-items");
  if (!cartContainer) return;

  const items = cart.getItems();

  if (items.length === 0) {
    cartContainer.innerHTML = html`
      <div class="text-center py-12">
        <p class="text-amazon-text-secondary text-lg">Your cart is empty</p>
        <a
          href="/src/pages/home/"
          class="text-amazon-link hover:text-amazon-dark-orange mt-4 inline-block"
        >
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }

  const deliveryDate = getDeliveryDate();
  const allSelected = items.every((item) => checkout.isSelected(item.id));

  cartContainer.innerHTML = html`
    <!-- Toggle all link and Price header -->
    <div
      class="flex justify-between items-center mb-3 pb-3 border-b border-gray-300"
    >
      <a
        href="#"
        class="text-amazon-link hover:text-amazon-dark-orange text-xs"
        id="toggle-all"
      >
        ${allSelected ? "Deselect all items" : "Select all items"}
      </a>
      <span class="text-amazon-text-secondary text-sm">Price</span>
    </div>

    <!-- Cart Items -->
    <div class="bg-white">
      ${items
        .map(
          (item) => html`
            <div
              class="flex gap-4 py-4 border-b border-gray-300"
              data-product-id="${item.id}"
            >
              <!-- Checkbox -->
              <div class="shrink-0 pt-1">
                <input
                  type="checkbox"
                  ${checkout.isSelected(item.id) ? "checked" : ""}
                  class="w-4 h-4 cursor-pointer cart-item-checkbox"
                  data-product-id="${item.id}"
                />
              </div>

              <!-- Product Image -->
              <div class="shrink-0">
                <a href="/src/pages/product/?id=${item.id}">
                  <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="w-44 h-44 object-contain hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <!-- Title and Badge -->
                <div>
                  <a
                    href="/src/pages/product/?id=${item.id}"
                    class="text-amazon-link hover:text-amazon-dark-orange font-normal text-base leading-tight"
                  >
                    ${item.name}
                  </a>
                  ${item.badge
                    ? html`<div class="mt-1">
                        <span
                          class="bg-amazon-deal-red text-white text-xs font-bold px-2 py-0.5 rounded-sm"
                          >${item.badge}</span
                        >
                      </div>`
                    : ""}
                </div>

                <!-- Stock Status -->
                ${item.inStock
                  ? html`<div
                      class="text-amazon-success text-sm font-medium mt-1"
                    >
                      In Stock
                    </div>`
                  : html`<div
                      class="text-amazon-deal-red text-sm font-medium mt-1"
                    >
                      Currently unavailable
                    </div>`}

                <!-- Prime Delivery -->
                ${item.prime
                  ? html`<div class="flex items-center gap-2 mt-1">
                      <span class="text-amazon-link text-xs font-bold"
                        >prime</span
                      ><span class="text-xs text-amazon-text"
                        >FREE delivery
                        <strong>Overnight ${deliveryDate}</strong></span
                      >
                    </div>`
                  : html`<div class="text-xs text-amazon-text mt-1">
                      FREE delivery <strong>${deliveryDate}</strong>
                    </div>`}

                <!-- FREE Returns -->
                <div class="mt-0.5">
                  <a
                    href="#"
                    class="text-amazon-link hover:text-amazon-dark-orange text-xs"
                    >FREE Returns</a
                  >
                </div>

                <!-- Gift Option -->
                ${item.tags && item.tags.includes("gift")
                  ? html`<div class="flex items-center gap-2 mt-2">
                      <input type="checkbox" class="w-4 h-4" /><label
                        class="text-xs text-amazon-text"
                        >This is a gift
                        <a
                          href="#"
                          class="text-amazon-link hover:text-amazon-dark-orange"
                          >Learn more</a
                        ></label
                      >
                    </div>`
                  : ""}

                <!-- Variations (using first 2 tags) -->
                ${item.tags && item.tags.length > 0
                  ? html`<div class="mt-2 text-xs text-amazon-text">
                      <span class="font-medium">Style:</span> ${item.tags
                        .slice(0, 2)
                        .join(", ")}
                    </div>`
                  : ""}

                <!-- Quantity Controls -->
                <div
                  class="flex items-center gap-3 mt-3 bg-gray-100 rounded-lg p-1 w-fit"
                >
                  <button
                    class="cart-decrease px-2 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm"
                    data-product-id="${item.id}"
                  >
                    <span class="block w-3 text-center">-</span>
                  </button>
                  <span class="text-amazon-text text-sm font-medium px-2"
                    >${item.quantity}</span
                  >
                  <button
                    class="cart-increase px-2 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-sm"
                    data-product-id="${item.id}"
                  >
                    <span class="block w-3 text-center">+</span>
                  </button>
                </div>

                <!-- Actions Row -->
                <div class="flex items-center gap-3 mt-3 text-xs">
                  <button
                    class="cart-delete text-amazon-link hover:text-amazon-dark-orange"
                    data-product-id="${item.id}"
                  >
                    Delete
                  </button>
                  <span class="text-gray-300">|</span>
                  <button
                    class="cart-save-later text-amazon-link hover:text-amazon-dark-orange"
                    data-product-id="${item.id}"
                  >
                    Save for later
                  </button>
                  <span class="text-gray-300">|</span>
                  <button
                    class="cart-compare text-amazon-link hover:text-amazon-dark-orange"
                    data-product-id="${item.id}"
                  >
                    Compare with similar items
                  </button>
                  <span class="text-gray-300">|</span>
                  <button
                    class="cart-share text-amazon-link hover:text-amazon-dark-orange"
                    data-product-id="${item.id}"
                  >
                    Share
                  </button>
                </div>
              </div>

              <!-- Price Column -->
              <div class="flex-shrink-0 text-right w-32">
                ${item.discount
                  ? html`<div class="mb-1">
                      <span class="text-amazon-deal-red text-sm font-bold"
                        >-${item.discount.percentage}%</span
                      ><span
                        class="ml-1 text-xs text-white bg-amazon-deal-red px-1.5 py-0.5 rounded"
                        >Save ${item.discount.percentage}%</span
                      >
                    </div>`
                  : ""}
                <div class="text-2xl font-bold text-amazon-text">
                  ${formatPrice(item.price)}
                </div>
                ${item.discount
                  ? html`<div class="text-xs text-amazon-text-secondary mt-1">
                      List:
                      <span class="line-through"
                        >${formatPrice(item.discount.originalPrice)}</span
                      >
                    </div>`
                  : ""}
                <div class="text-xs text-amazon-text-secondary mt-1">
                  (${formatPrice(perUnit(item.price, item.quantity))} / count)
                </div>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>

    <!-- Subtotal -->
    <div class="mt-6 text-right">
      <span class="text-lg">
        Subtotal (${checkout.getSelectedCount(cart)}
        ${checkout.getSelectedCount(cart) === 1 ? "item" : "items"}):
        <span class="font-bold text-amazon-text text-2xl ml-2">
          ${formatPrice(checkout.getSelectedTotal(cart))}
        </span>
      </span>
    </div>
  `;
}
