import axios from 'axios';

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`); // Menggunakan proxy
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
