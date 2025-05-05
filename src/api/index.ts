import axios from "axios"

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3001/api"
  : "https://ruby-rails-boilerplate-3s9t.onrender.com/api"

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")
    const remember_token = localStorage.getItem("remember_token") || sessionStorage.getItem("remember_token")

    if (token && remember_token) {
      config.headers.Authorization = `Bearer ${token} ${remember_token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
