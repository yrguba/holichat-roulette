export const fromMlToLitres = (ml: number) => {
  return ml / 1000;
};

export const formatPrice = (price: number) => {
  return Math.floor(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
