import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TasksView from '../views/TasksView.vue'
import LoginView from '../views/LoginView.vue'
import TaskCommentsView from '../views/TaskCommentsView.vue'
import TaskTeamView from '../views/TaskTeamView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import CreateTaskView from '@/views/tasks/CreateTaskView.vue'
import EditTaskView from '@/views/tasks/EditTaskView.vue'
//import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/tasks', name: 'tasks', component: TasksView, meta: { auth: true } },
 // { path: '/tasks/:status', name: 'filteredTasks', component: TasksView, meta: { auth: true } },
  { path: '/tasks/create', name: 'createTask', component: CreateTaskView, meta: { auth: true } },
  { path: '/tasks/:id/edit', name: 'editTask', component: EditTaskView, meta: { auth: true, isTaskManager: true } },
  { path: '/taskComments/:task_id', name: 'taskComments', component: TaskCommentsView, meta: { auth: true } },
  { path: '/taskTeam/:task_id', name: 'taskTeam', component: TaskTeamView, meta: { auth: true } },
  { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },
  { path: '/change-password', name: 'changePassword', component: ChangePasswordView, meta: { auth: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global guard for route authentication
router.beforeEach(async (to, from) => {
  
  console.log(to);
 
  const authStore=useAuthStore();//must be put here not on top
  const { user, isLoggedIn } = storeToRefs(authStore);
  // If user is not loaded, try to fetch user from backend
   //console.log('user1=',user.value);
  if ((user.value==null)&& (!to.path.includes('logout'))&&(isLoggedIn.value==true)) {
    console.log('get user from index.js');
    await authStore.getUser();
    //user.value= authStore.user;//mandatory with await to actualy refresh the user variable from store!!!!
    //console.log('user2=',user.value);  
  }
   //console.log('user3=',user.value);
  // Redirect logged-in users away from guest-only pages
  
  if ((user.value!=null) && to.meta?.guest==true) {
    //console.log('go to home');
    return { name: 'home' }
  }

  // Redirect guests trying to access auth-protected pages
  if ((user.value==null) && to.meta?.auth==true) {
    //
    //console.log('go to login');
    return { name: 'login' };
  }
  
  // check if user is task manager before editing
  /*
  if (authStore.user && to.meta.auth && to.meta.isTaskManager) {
    const taskId = to.params.id
    const isManager = authStore.user.id === parseInt(taskId) // replace with proper logic if needed
    if (!isManager) {
      return { name: 'tasks' }
    }
  }*/
  //console.log("navigation true");
  console.log("end index.js");
  return true; // allow navigation
})

export default router
