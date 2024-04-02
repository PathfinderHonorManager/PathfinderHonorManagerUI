import { createRouter, createWebHistory } from "vue-router";
import ClubView from "../views/ClubView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "club",
      component: ClubView,
    },
    {
      path: "/plan",
      name: "plan",
      component: () => import("../views/PlanHonorView.vue"),
    },
    {
      path: "/earn",
      name: "earn",
      component: () => import("../views/EarnHonorView.vue"),
    },
  ],
});

export default router;
