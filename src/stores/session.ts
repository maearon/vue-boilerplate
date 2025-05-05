import { defineStore } from "pinia"
import { ref } from "vue"
import api from "../api"

export interface User {
  readonly id: string
  email: string
  name: string
  role: boolean
  avatar?: string
}

export const useSessionStore = defineStore(
  "session",
  () => {
    const loggedIn = ref(false)
    const user = ref<User>({} as User)
    const status = ref<"idle" | "loading" | "failed">("idle")
    const error = ref("")

    async function fetchUser() {
      try {
        status.value = "loading"
        const response = await api.get("/sessions")
        user.value = response.user
        loggedIn.value = true
        status.value = "idle"
        error.value = ""
      } catch (err: any) {
        status.value = "failed"
        loggedIn.value = false
        user.value = {} as User
        error.value = err.message || "Failed to fetch user"
      }
    }

    function logout() {
      loggedIn.value = false
      user.value = {} as User
      localStorage.removeItem("token")
      localStorage.removeItem("remember_token")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("remember_token")
    }

    return {
      loggedIn,
      user,
      status,
      error,
      fetchUser,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ["loggedIn", "user"],
    },
  },
)
