export const productStatus = {
  ALL: '',
  ENABLED: 'true',
  DISABLED: 'false',
};

export const formatPrice = (price) => {
  return `$${Number(price ?? 0).toLocaleString()}`;
};

export const getProductImage = (imageUrl) => {
  if (!imageUrl) return null;
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  return `/products_img/${imageUrl}`;
};

export const formatSku = (sku) => {
  return sku ? String(sku).replace(/^SKU-/, '') : sku;
};
