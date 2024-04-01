import permitLoggedUsersOnly from '@/utils/permitLoggerUsersOnly'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import("@/views/HomeView.vue")
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/LoginView.vue")
    },
    {
        path: '/user',
        name: 'user',
        component: () => import("@/views/UserProfileView.vue"),
        beforeEnter: permitLoggedUsersOnly,
    },
    {
        path: '/courses',
        name: 'courses',
        component: () => import('@/views/CourseListView.vue'),
        beforeEnter: permitLoggedUsersOnly,
    },
    {
        path: '/courses/:courseId/:tabId',
        name: 'activities',
        component: () => import('@/views/CourseDetailView.vue'),
        beforeEnter: permitLoggedUsersOnly
    },
    {
        path: '/courses/:courseId/activities/:activityId/:tabId',
        name: 'activityDetail',
        component: () => import('@/views/ActivityDetailView.vue'),
        beforeEnter: permitLoggedUsersOnly
    },
    
    {
        path: '/courses/:courseId/tasks/:taskId',
        name: 'taskDetail',
        component: () => import('@/views/TaskDetailView.vue'),
        beforeEnter: permitLoggedUsersOnly
    },

    // Wildcard route for Page Not Found
    {
        path: '/:catchAll(.*)',
        name: 'notFound',
        component: () => import("@/views/PageNotFoundView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router
