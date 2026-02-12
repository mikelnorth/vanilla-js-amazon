// localStorage helpers with consistent error handling

const STORAGE_KEYS = {
  CART: "amazon-cart",
  LOCATION: "amazon-location",
};

// Generic get/set with JSON parsing
function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to get ${key} from localStorage:`, error);
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to set ${key} in localStorage:`, error);
    return false;
  }
}

function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
    return false;
  }
}

// Cart-specific helpers
export const cartStorage = {
  get() {
    return getItem(STORAGE_KEYS.CART);
  },
  set(cartItems) {
    return setItem(STORAGE_KEYS.CART, cartItems);
  },
  clear() {
    return removeItem(STORAGE_KEYS.CART);
  },
};

// Location-specific helpers
export const locationStorage = {
  get() {
    return getItem(STORAGE_KEYS.LOCATION);
  },
  set(location) {
    return setItem(STORAGE_KEYS.LOCATION, location);
  },
  clear() {
    return removeItem(STORAGE_KEYS.LOCATION);
  },
};

// Export keys for reference
export { STORAGE_KEYS };
