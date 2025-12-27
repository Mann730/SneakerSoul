import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api/products",
  headers: {
    "Content-Type": "application/json",
  },
});

// CREATE PRODUCT
export const createProduct = async (data, token) => {
  try {
    const response = await API.post("/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// UPDATE PRODUCT
export const updateProduct = async (id, data, token) => {
  try {
    const response = await API.put(`/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id, token) => {
  try {
    const response = await API.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
