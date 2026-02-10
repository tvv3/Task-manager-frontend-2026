import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/main.css';

import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

import App from './App.vue';
import router from './router';

import piniaPersist from 'pinia-plugin-persistedstate'


// Create Vue app
const app = createApp(App);

// Pinia
const pinia = createPinia()
pinia.use(piniaPersist)
/*function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
}*/
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    // decodeURIComponent este vital aici pentru a elimina caracterele de tip %3D
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
}
pinia.use(({ store }) => {
  store.router = markRaw(router); // make router reactive-safe
  store.getCookie=getCookie;
});
app.use(pinia);



// Initialize auth store
const authStore = useAuthStore();

// Pornim getUser (care acum include și fetch-ul de cookie)
// Folosim .finally pentru a fi siguri că aplicația se montează 
// indiferent dacă userul este logat sau nu
//authStore.getUser().finally(() => {
    app.use(router);
    app.mount('#app');
//});
