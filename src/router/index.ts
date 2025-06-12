import { createRouter, createWebHistory } from "vue-router";
import ClubView from "../views/ClubView.vue";
import LandingComponent from "../components/LandingComponent.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { AnalyticsService } from "../services/analyticsService";
import type { RouteLocationNormalized } from 'vue-router';

export function analyticsAfterEach(to: RouteLocationNormalized) {
  AnalyticsService.trackPageView(to.name?.toString(), to.fullPath);
}

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
      meta: { guestOnly: true }
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
      path: "/investiture",
      name: "Investiture",
      component: () => import("../views/InvestiturePage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: '/landing'
    }
  ],
});

router.afterEach(analyticsAfterEach);

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Wait for Auth0 to initialize
  if (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isLoading.value) {
      return next(); // Still loading, allow navigation to continue
    }
  }

  // For landing page, allow access if not authenticated
  if (to.name === 'landing') {
    if (isAuthenticated.value) {
      return next({ name: 'club' });
    }
    return next();
  }
  
  // For all other routes that require auth
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      return next({ name: 'landing' });
    }
  }

  // Default redirect for root path
  if (to.path === '/') {
    if (!isAuthenticated.value) {
      return next({ name: 'landing' });
    }
  }

  next();
});

export default router;
