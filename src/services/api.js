// src/services/apiService.js
import axios from "axios";

// Tạo một "instance" của axios với cấu hình cơ bản
const apiService = axios.create({
  baseURL: "https://localhost:7023/api", // Cổng backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});


export const apiCreateInventory = (inventoryData) => {
  return apiService.post("/inventories", inventoryData);
};

// (Hàm này cho trang AddItemInventory)
export const apiGetInventories = () => {
  return apiService.get("/inventories");
};

export const apiAddItemToInventory = (inventoryId, itemData) => {
  return apiService.post(`/inventories/${inventoryId}/items`, itemData);
};

export const apiGetInventoryItems = (inventoryId) => {
  // Đảm bảo inventoryId hợp lệ trước khi gọi
  if (!inventoryId) {
    return Promise.reject(new Error("Inventory ID is required."));
  }
  return apiService.get(`/inventories/${inventoryId}/items`);
};
export const apiDeleteItemFromInventory = (inventoryId, itemId) => {
  if (!inventoryId || !itemId) {
    return Promise.reject(new Error("Inventory ID and Item ID are required."));
  }
  // URL này phải khớp với API backend của bạn
  return apiService.delete(`/inventories/${inventoryId}/items/${itemId}`);
};

export const apiUpdateInventoryItem = (inventoryId, itemId, itemData) => {
  if (!inventoryId || !itemId) {
    return Promise.reject(new Error("Inventory ID and Item ID are required."));
  }
  // URL này phải khớp với API backend của bạn (PUT)
  return apiService.put(`/inventories/${inventoryId}/items/${itemId}`, itemData);
};

export const apiDeleteInventory = (inventoryId) => {
  if (!inventoryId) {
    return Promise.reject(new Error("Inventory ID is required."));
  }
  // URL này phải khớp với API backend của bạn (DELETE /api/inventories/{id})
  return apiService.delete(`/inventories/${inventoryId}`);
};

export default apiService;