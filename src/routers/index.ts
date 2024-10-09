import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Chat from '../views/Chat.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'chat',
		component: Chat,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
	{
		path: '/register',
		name: 'register',
		component: Register,
	},
	{ path: '/:pathMatch(.*)', redirect: '/' },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, _from, savedPosition) {
		if (to.hash) {
			return {
				el: to.hash,
				behavior: 'smooth',
			};
		} else if (savedPosition) {
			return savedPosition;
		} else {
			return { top: 0 };
		}
	},
});

router.beforeEach((to, _from, next) => {
	const isAuthenticated = localStorage.getItem('token');
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!isAuthenticated) {
			next('/login');
		} else {
			next();
		}
	} else {
		next();
	}
});
