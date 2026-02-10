<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user, errors, successMessage } = storeToRefs(authStore);

const formData = reactive({
  email: '',
  password: '',
});

const loading = ref(false);

// Login function
const login = async () => {
  loading.value = true;

  try {
  await authStore.authenticate(formData);

  } finally {
  loading.value = false;
}
};

onMounted(() => {
  // Clear errors and messages on component mount
  errors.value = {};
  authStore.successMessage = null;
});
</script>

<template>
  <section class="container gradient-form mb-5" style="background-color:transparent!important;">
    <div class="container py-5">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-xl-10">
          <div class="card rounded-3 text-black">
            <div class="row g-0">
              <div class="col-lg-6">
                <div class="card-body p-md-5 mx-md-4">
                  <div class="text-center">
                    <h4 class="pb-1 mt-1 mb-1">Sign In</h4>
                    <!--img src="/src/images/check1.webp" class="mt-1 mb-3" style="width: 60px; height:60px;" alt="logo"-->
                  </div>

                  <form @submit.prevent="login">
                    <p style="color:blueviolet;">Please login to your account</p>

                    <div class="form-outline mb-4">
                      <label class="form-label" for="email">Email</label>
                      <input type="email" id="email" v-model="formData.email" class="form-control" placeholder="Email address" />
                      <p class="text-danger" v-if="errors?.email">{{ errors.email[0] }}</p>
                    </div>

                    <div class="form-outline mb-4">
                      <label class="form-label" for="password">Password</label>
                      <input type="password" id="password" v-model="formData.password" class="form-control" />
                      <p class="text-danger" v-if="errors?.password">{{ errors.password[0] }}</p>
                    </div>

                    <div class="text-center pt-1 mb-5 pb-1">
                      <button class="btn btn-primary btn-block fa-lg gradient-custom-1 mb-3" type="submit" :disabled="loading">
                        {{ loading ? 'Logging in...' : 'Log in' }}
                      </button>
                    </div>

                    <p class="text-success" v-if="successMessage">{{ successMessage }}</p>
                    <p class="text-danger" v-if="errors?.form">{{ errors.form[0] }}</p>
                  </form>

                </div>
              </div>

              <div class="col-lg-6 d-flex align-items-center gradient-custom-1">
                <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                  <h4 class="mb-4">This is a private task app!</h4>
                  <p class="small mb-0">
                    If you already have a user please login to your account. If not, you must contact the website's owner to create one.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gradient-custom-2 {
  background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
}

@media (min-width: 768px) {
  .gradient-form { min-height: 100vh !important; }
}

@media (min-width: 769px) {
  .gradient-custom-1 {
    border-top-right-radius: .3rem;
    border-bottom-right-radius: .3rem;
  }
}
</style>
