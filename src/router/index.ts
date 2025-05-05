import { createRouter, createWebHistory } from "vue-router"
import { useSessionStore } from "../stores/session"

// Views
import Home from "../views/Home.vue"
import Login from "../views/Login.vue"
import Signup from "../views/Signup.vue"
import UserProfile from "../views/UserProfile.vue"
import ShowFollow from "../views/ShowFollow.vue"
import About from "../views/About.vue"
import Contact from "../views/Contact.vue"
import Users from "../views/Users.vue"
import UserEdit from "../views/UserEdit.vue"
import NotFound from "../views/NotFound.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { guestOnly: true },
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
      meta: { guestOnly: true },
    },
    {
      path: "/users",
      name: "Users",
      component: Users,
    },
    {
      path: "/users/:id",
      name: "UserProfile",
      component: UserProfile,
      props: true,
    },
    {
      path: "/users/:id/edit",
      name: "UserEdit",
      component: UserEdit,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/users/:id/following",
      name: "Following",
      component: ShowFollow,
      props: (route) => ({
        userId: route.params.id,
        type: "following",
      }),
    },
    {
      path: "/users/:id/followers",
      name: "Followers",
      component: ShowFollow,
      props: (route) => ({
        userId: route.params.id,
        type: "followers",
      }),
    },
    {
      path: "/about",
      name: "About",
      component: About,
    },
    {
      path: "/contact",
      name: "Contact",
      component: Contact,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore()

  if (sessionStore.loggedIn && (to.name === "login" || to.name === "signup")) {
    next({ name: "home" })
  } else {
    next()
  }
})

export default router
