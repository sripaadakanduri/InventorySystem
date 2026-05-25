import api from "./api";
import { toast } from "react-toastify";

export const getProducts = async() => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const createProduct = async (product) => {
  try {
      const response = await api.post(`/products`, product);
      alert("Product updated successfully");

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }

}

export const deleteProduct = async (id) => {
  try {
      const response = await api.delete(`/products/${id}`);
      alert("Product deleted Successfully")
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }

}