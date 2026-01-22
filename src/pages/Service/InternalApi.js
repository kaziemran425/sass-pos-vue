import { api } from "src/boot/axios";
import axios from "axios";

export default class InternalApi {
  constructor() {
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }
  // Internal API
  async authRegister(payload) {
    return api.post("/register", payload);
  }
  async authLogin(payload) {
    return api.post("/login", payload);
  }
  async validRegisterOtp(payload) {
    return api.patch(`/user-otp-verify`, payload);
  }

  async deleteProduct(id) {
    return api.delete(`/product/${id}`);
  }
  async getInternalProduct(id) {
    return api.get(`/products-by-user-id/${id}`).then((res) => res.data);
  }

  // ---- Image Upload (external API) ----
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("files", file);

    const res = await axios.post(
      "https://api.zebratechnology.net/api/v1/web/gallery/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data?.data?.url; // return uploaded image URL
  }
}
