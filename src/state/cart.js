import { updateCartCount } from "../components/header.js";
import { cartStorage } from "../utils/storage.js";

const cart = {
  items: {},

  // Initialize cart from localStorage
  init() {
    this.load();
  },

  // Add item to cart
  addItem(product) {
    if (this.items[product.id]) {
      this.items[product.id].quantity++;
    } else {
      this.items[product.id] = { ...product, quantity: 1 };
    }
    this.save();
  },

  // Remove one quantity of item
  removeItem(productId) {
    if (this.items[productId]) {
      this.items[productId].quantity--;
      if (this.items[productId].quantity === 0) {
        delete this.items[productId];
      }
    }
    this.save();
  },

  // Remove item entirely from cart
  deleteItem(productId) {
    delete this.items[productId];
    this.save();
  },

  // Get total number of items in cart
  getItemCount() {
    return Object.values(this.items).reduce(
      (count, item) => count + item.quantity,
      0,
    );
  },

  // Get total price in cents
  getTotal() {
    return Object.values(this.items).reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  // Get items as array
  getItems() {
    return Object.values(this.items);
  },

  // Save to localStorage
  save() {
    cartStorage.set(this.items);
    this.updateHeader();
  },

  // Load from localStorage
  load() {
    const saved = cartStorage.get();
    if (saved) {
      this.items = saved;
    }
  },

  // Update header cart count
  updateHeader() {
    updateCartCount(this.getItemCount());
  },
};

// Initialize cart on import
cart.init();

export default cart;
