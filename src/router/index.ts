import { createRouter, createWebHistory } from "vue-router";
import ClubView from "../views/ClubView.vue";
import LandingComponent from "../components/LandingComponent.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "club",
      component: ClubView,
      meta: { requiresAuth: true }
    },
    {
      path: "/landing",
      name: "landing",
      component: LandingComponent,
      beforeEnter: (to, from, next) => {
        const { isAuthenticated } = useAuth0();
        if (isAuthenticated.value) {
          next({ name: "club" });
        } else {
          next();
        }
      }
    },
    {
      path: "/manage/:selectionType(plan|earn|award)",
      name: "ManageHonors",
      component: () => import("../views/ManageHonorView.vue"),
      meta: { requiresAuth: true },
      props: true,
      beforeEnter: (to, from, next) => {
        const validTypes = ['plan', 'earn', 'award'];
        if (!validTypes.includes(to.params.selectionType as string)) {
          next({ name: 'club' });
        } else {
          next();
        }
      }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: to => {
        const { isAuthenticated } = useAuth0();
        return isAuthenticated.value ? { name: 'club' } : { name: 'landing' };
      }
    }
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Wait for Auth0 to initialize
  if (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Protect authenticated routes
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'landing' });
    return;
  }

  next();
});

export default router;
