import { createRouter, createWebHistory } from "vue-router"
import { useSessionStore } from "../stores/session"
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Signup from "../views/Signup.vue"
import UserProfile from "../views/UserProfile.vue"
import Following from "../views/Following.vue"
import Followers from "../views/Followers.vue"
import NotFound from "../views/NotFound.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
    },
    {
      path: "/users/:id",
      name: "user-profile",
      component: UserProfile,
    },
    {
      path: "/users/:id/following",
      name: "following",
      component: Following,
    },
    {
      path: "/users/:id/followers",
      name: "followers",
      component: Followers,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()

  // Nếu người dùng đã đăng nhập và cố gắng truy cập trang đăng nhập hoặc đăng ký
  if (sessionStore.loggedIn && (to.name === "login" || to.name === "signup")) {
    next({ name: "home" })
  } else {
    next()
  }
})

export default router
