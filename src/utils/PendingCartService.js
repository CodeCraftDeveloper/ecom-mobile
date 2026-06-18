let pendingCartItem = null;

const PendingCartService = {
  set: (product, count) => {
    pendingCartItem = { product, count };
  },
  get: () => pendingCartItem,
  clear: () => {
    pendingCartItem = null;
  },
};

export default PendingCartService;
