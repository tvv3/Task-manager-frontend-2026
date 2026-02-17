<script setup>
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { storeToRefs } from 'pinia';
import { reactive, onMounted } from 'vue';
const {createTask} = useTasksStore();
const {user}= storeToRefs(useAuthStore());
const formData=reactive({
    title:"",
    is_done:false,
    description: null,
});
const {errors} = storeToRefs(useTasksStore());
function isNormalUser()
{
  if (!user.value) return false;
  return user.value.user_role.role=="user";
}
onMounted(()=>{errors.value={};
   if (isNormalUser()===false) { router.push({name: 'home'});} 
});
</script>
<template>
    <div class="container w-50 " style="margin-left: auto; margin-right:auto;">
    <h2 class="my-4" style="text-align: center;">Create Task</h2>
<form>
  
  <div class="form-group mb-3">
    <label for="exampleFormControlTextarea1">Title:</label>
    <textarea class="form-control" v-model="formData.title" id="exampleFormControlTextarea1" rows="3"></textarea>
    <p class="text-danger" v-if="errors?errors.title:false">{{ errors.title[0] }}</p> 
                    
  </div>

  <div class="form-group mb-3">
    <label for="descr">Description:</label>
    <textarea class="form-control" v-model="formData.description" id="descr" rows="3"></textarea>
    <p class="text-danger" v-if="errors?errors.description:false">{{ errors.description[0] }}</p> 
                    
  </div>

  <div class="form-group form-check mb-3">
    <input type="checkbox" class="form-check-input" v-model="formData.is_done" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Is Finished </label>
    <p class="text-danger" v-if="errors?errors.is_done:false">{{ errors.is_done[0] }}</p> 
                    
  </div>
  <button type="button" @click="createTask(formData)" class="btn btn-success mb-3">Create</button>
</form>
<p class="text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="errors?errors.task:false">{{ errors.task[0] }}</p> 

</div>
</template>
<style scoped>
label {font-weight:bold;}
</style>