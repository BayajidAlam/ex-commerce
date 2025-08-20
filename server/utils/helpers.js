const generateSKU = (category, name) => {
  const categoryPrefix = {
    'casual': 'CAS',
    'formal': 'FOR',
    'traditional': 'TRA',
    'bag': 'BAG',
    'jewellry': 'JEW',
    'glass': 'GLA',
    'watch': 'WAT'
  };

  const prefix = categoryPrefix[category] || 'PRD';
  const nameCode = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const timestamp = Date.now().toString().slice(-4);
  
  return `ALN-${prefix}-${nameCode}${timestamp}`;
};

const formatPrice = (price) => {
  return `৳${price.toLocaleString('en-US')}`;
};

const calculateDiscountPrice = (originalPrice, discountPercentage) => {
  return originalPrice - (originalPrice * discountPercentage / 100);
};

module.exports = {
  generateSKU,
  formatPrice,
  calculateDiscountPrice
};
