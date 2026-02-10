<script setup>
import router from '@/router';
import { useTasksStore } from '@/stores/tasks';
import { storeToRefs } from 'pinia';
import { reactive, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/stores/auth';
const {editTask, getTask} = useTasksStore();
const is_vizible_page=ref(false);
const task_id=ref(null);
const route=useRoute();
const taskData=ref({title:'', is_done: false});
const taskData2=ref({title:'', is_done: false, manager_user_id: ''});
const {errors} = storeToRefs(useTasksStore());
const {user}=storeToRefs(useAuthStore());
task_id.value=route.params.id;
//onMounted(()=>{errors.value={};task_id.value=route.params.id;});
onMounted(async ()=> {
  is_vizible_page.value=false;
  errors.value={};
  taskData2.value = await getTask(route.params.id);
  if (user.value.id!=taskData2.value.manager_user_id)
{
  await router.push({name: 'home'});
  //console.log(taskData2.value);
}
else 
{ 
  task_id.value=route.params.id;
  taskData.value.title=taskData2.value.title;
  taskData.value.is_done=taskData2.value.is_done;
  is_vizible_page.value=true;
}
});
</script>
<template>
    <div v-if="is_vizible_page" class="container w-50 " style="margin-left: auto; margin-right:auto;">
    <h2 class="my-4" style="text-align: center;">Update Task</h2> 
  <form>
  <div class="form-group mb-3">
    <label for="exampleFormControlTextarea1">Title:</label>
    <textarea class="form-control" v-model="taskData.title" id="exampleFormControlTextarea1" rows="3"></textarea>
    <p class="text-danger" v-if="errors?errors.title:false">{{ errors.title[0] }}</p> 
                    
  </div>

  <div class="form-group form-check mb-3">
    <input type="checkbox" class="form-check-input" v-model="taskData.is_done" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Is Finished </label>
    <p class="text-danger" v-if="errors?errors.is_done:false">{{ errors.is_done[0] }}</p> 
                    
  </div>
  <button type="button" @click="editTask(task_id, taskData2.manager_user_id, taskData)" class="btn btn-success mb-3">Update</button>
</form>
<p class="text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="errors?errors.task:false">{{ errors.task[0] }}</p> 
        
</div>
</template>
<style scoped>
label {font-weight:bold;}
</style>