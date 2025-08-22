// Categories
export const categories = [
    { id: 1, name: 'Electronics', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Fashion', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Home Appliances', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Beauty & Health', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Books', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Toys', image: 'https://via.placeholder.com/150' }
  ];
  
  // Subcategories
  export const subcategories = [
    { id: 11, name: 'Mobiles', categoryId: 1 },
    { id: 12, name: 'Laptops', categoryId: 1 },
    { id: 13, name: 'Wearables', categoryId: 1 },
    { id: 21, name: 'Men', categoryId: 2 },
    { id: 22, name: 'Women', categoryId: 2 },
    { id: 31, name: 'Kitchen', categoryId: 3 },
    { id: 32, name: 'Cleaning', categoryId: 3 }
  ];
  
  // Products
  export const products = [
    { id: 101, name: 'Smartphone', price: 499, categoryId: 1, subcategoryId: 11, image: 'https://via.placeholder.com/150', isSpecialOffer: true },
    { id: 102, name: 'Laptop', price: 899, categoryId: 1, subcategoryId: 12, image: 'https://via.placeholder.com/150', isSpecialOffer: true },
    { id: 103, name: 'Smartwatch', price: 199, categoryId: 1, subcategoryId: 13, image: 'https://via.placeholder.com/150', isSpecialOffer: false },
  
    { id: 201, name: 'Shirt', price: 29, categoryId: 2, subcategoryId: 21, image: 'https://via.placeholder.com/150', isSpecialOffer: true },
    { id: 202, name: 'Sneakers', price: 79, categoryId: 2, subcategoryId: 21, image: 'https://via.placeholder.com/150', isSpecialOffer: false },
    { id: 203, name: 'Jeans', price: 59, categoryId: 2, subcategoryId: 21, image: 'https://via.placeholder.com/150', isSpecialOffer: false },
  
    { id: 301, name: 'Air Fryer', price: 120, categoryId: 3, subcategoryId: 31, image: 'https://via.placeholder.com/150', isSpecialOffer: true },
    { id: 302, name: 'Microwave', price: 250, categoryId: 3, subcategoryId: 31, image: 'https://via.placeholder.com/150', isSpecialOffer: false },
  
    { id: 401, name: 'Lipstick', price: 20, categoryId: 4, subcategoryId: null, image: 'https://via.placeholder.com/150', isSpecialOffer: true },
    { id: 501, name: 'Fiction Novel', price: 12, categoryId: 5, subcategoryId: null, image: 'https://via.placeholder.com/150', isSpecialOffer: false },
    { id: 601, name: 'Lego Set', price: 50, categoryId: 6, subcategoryId: null, image: 'https://via.placeholder.com/150', isSpecialOffer: true }
  ];
  