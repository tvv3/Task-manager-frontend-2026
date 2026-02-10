<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, reactive } from 'vue';
//import _ from 'lodash';
const {user, errors, successMessage} = storeToRefs(useAuthStore());
const {changePassword} = useAuthStore();
const formData=reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});
onMounted(()=>errors.value={});
async function handleChangePassword(formData)
{
  
  await changePassword(formData).then((value)=>{
    
    if ((Object.keys(errors.value).length === 0)
    //(_.isEmpty(errors.value))
        &&(successMessage.value!=null)) {alert(successMessage.value);}
    else { alert('Error ');}
  }).catch((reason)=>{console.log('reason=',reason);alert("Error at changing password");});
 // .finally(()=>{console.log(errors.value);});

  
}
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
                  <h4 class="pb-1 mt-1 mb-1">Change Password</h4>
                  <!--img src="/src/images/check1.webp"
                    class="mt-1 mb-3"
                    style="width: 60px; height:60px;" alt="logo"-->
                
                </div>

                <form @submit.prevent="handleChangePassword(formData)">
                  <p style="color:blueviolet;">Change Password</p>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label" for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" class="form-control"
                      placeholder="Email address" />
                      <p v-if="errors?errors.email:false" class="text-danger">{{ errors.email[0] }}</p> 
                   
                    </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" id="password" v-model="formData.password" class="form-control" />
                    <p class="text-danger" v-if="errors?errors.password:false">{{ errors.password[0] }}</p> 
                   
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <label class="form-label" for="password_confirmation">Repeat Password</label>
                    <input type="password" id="password_confirmation" v-model="formData.password_confirmation" class="form-control" />
                  </div>

                  <div class="text-center pt-1 mb-5 pb-1">
                    <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block fa-lg gradient-custom-1 mb-3" type="submit" style="margin-right: 0.5em;">
                      Change Password</button>
                    
                  </div>

                </form>

              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center gradient-custom-1">
              <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 class="mb-4">This is a private task app!</h4>
                <p class="small mb-0">If you already have a user please login to your account. If you are the website's administrator you can change any account's password here!</p>
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
/* fallback for old browsers */
background: #fccb90;

/* Chrome 10-25, Safari 5.1-6 */
background: -webkit-linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);

/* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
background: linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593);
}

@media (min-width: 768px) {
.gradient-form {
min-height: 100vh !important;
}
}
@media (min-width: 769px) {
.gradient-custom-1 {
border-top-right-radius: .3rem;
border-bottom-right-radius: .3rem;
}
}
</style>