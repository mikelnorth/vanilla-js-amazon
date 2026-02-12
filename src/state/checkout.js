const checkout = {
  selectedIds: new Set(),
  currentView: "cart",

  // Select all current cart item IDs
  init(cart) {
    this.selectedIds = new Set(cart.getItems().map((item) => item.id));
    this.currentView = "cart";
  },

  // Toggle a single item's selection
  toggle(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  },

  // Select all cart items
  selectAll(cart) {
    this.selectedIds = new Set(cart.getItems().map((item) => item.id));
  },

  // Deselect all items
  deselectAll() {
    this.selectedIds.clear();
  },

  // Check if item is selected
  isSelected(id) {
    return this.selectedIds.has(id);
  },

  // Get array of selected cart items
  getSelectedItems(cart) {
    return cart.getItems().filter((item) => this.selectedIds.has(item.id));
  },

  // Get total price of selected items in cents
  getSelectedTotal(cart) {
    return this.getSelectedItems(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  },

  // Get total count of selected items
  getSelectedCount(cart) {
    return this.getSelectedItems(cart).reduce(
      (count, item) => count + item.quantity,
      0,
    );
  },

  // After cart mutations, keep selection in sync
  syncWithCart(cart) {
    const cartIds = new Set(cart.getItems().map((item) => item.id));
    // Remove selections for items no longer in cart
    for (const id of this.selectedIds) {
      if (!cartIds.has(id)) {
        this.selectedIds.delete(id);
      }
    }
  },

  // Place order: delete selected items from cart, switch to success view
  placeOrder(cart) {
    for (const id of this.selectedIds) {
      cart.deleteItem(id);
    }
    this.selectedIds.clear();
    this.currentView = "success";
  },
};

export default checkout;
