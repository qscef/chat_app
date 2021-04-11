import NullPage from './pages/NullPage.vue'
import Login from './pages/Login.vue'
import Chats from './pages/Chats.vue'

const routes = [
  {
    name: 'nullPage',
    path: '/404',
    component: NullPage,
  },
  {
    name: 'chats',
    path: '/chats',
    props: true,
    component: Chats,
  },
  {
    name: 'login',
    path: "/login",
    props: true,
    component: Login,
  },
  {
    path: "/",
    component: Chats,
  },
  { 
    path: '*', 
    redirect: '/404' 
  }
];

export default routes;