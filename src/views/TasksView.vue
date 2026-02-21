<script setup>
import TaskComponent from '@/components/TaskComponent.vue';
import PaginationComponent from '@/components/PaginationComponent.vue';
import router from '@/router';
//import _ from 'lodash';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { storeToRefs } from 'pinia';
import {  computed, onMounted,  ref, watch } from 'vue';
import { useRoute} from 'vue-router';
import { nextTick } from 'vue';
//const {errors} = storeToRefs(useTasksStore());
//const {getTaskById} = storeToRefs(useTasksStore());
//const {tasks} = storeToRefs(useTasksStore());
const {tasks, mytasks, errors} = storeToRefs(useTasksStore());
const {user} = storeToRefs(useAuthStore());
const tasksStore = useTasksStore();

const currentPage=ref(1);//mandatory 1
const route=useRoute();
const searchedText=ref(null);
const filtered_status=computed(()=>route.query.status? route.query.status: "all");
const filtered_text=computed(()=>route.query.text? route.query.text: "");

onMounted( async ()=> {
 errors.value={};
 currentPage.value = route.query.page ? parseInt(route.query.page) : 1;
 searchedText.value=route.query.text ? route.query.text : "";
 //filtered_status.value=computed(()=>route.params.status? route.params.status: "all");
 await tasksStore.getTasks(route.query.page ? parseInt(route.query.page) : 1, 
                           filtered_status.value, filtered_text.value);
}

);

function isNormalUser()
{
  if (!user.value) return false;
  if (!user.value.user_role) return false;
  if (!user.value.user_role.role) return false;//mandatory, at the begining we don't have the role
  return user.value.user_role.role=="user";
}

async function handleDeleteTaskParent(task)
{
  const ok=await tasksStore.deleteTask(task);
  console.log('123');
  if (ok) 
  {
     await tasksStore.getTasks(currentPage.value);
     if (Object.keys(mytasks.value).length===0) {router.push({ name: 'tasks', query: { page: 1 } });}
  }
}

//for pagination
// Watch for route query changes (pagination clicks)
watch(() => [route.query.page, route.query.status, route.query.text],
  ([newPage, newStatus, newText]) => {
  //console.log("Watch triggered! Page changed to:", newPage);
  currentPage.value = newPage ? parseInt(newPage) : 1;
  //console.log("Watch triggered! Page changed to:", newPage);
 
  tasksStore.getTasks(currentPage.value,filtered_status.value, filtered_text.value);
});

//for pagination

 
// Function to change pages manually
/* old:
const changePage = (page) => {
  if (page > 0 && page <= tasks.value.last_page) {
    router.push({ query: { page } });
  }
};
*/
const changePage = (page) => {
  if (page > 0 && page <= tasks.value.last_page) {
    router.push({
      query: {
        ...route.query,   //  cu ...route.query --- mandatory to KEEP status !!!!
        page
      }
    });
  }
};

</script>
<template>
    <section>
  <div class="container">
     
    <div class="row" style="display:flex; justify-content: center; align-items: center;">
        <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card mb-3 bg-light"> <!--custom-background-->
          <div class="card-body">
            
            <div class="pt-3 pb-2 text-center">
              <div class="d-lg-flex justify-content-lg-center">
        
              <h2 class="my-4" style="text-align: center;">Tasks</h2>
              
              </div>
              <template v-if="isNormalUser()===true">
              <RouterLink id="addNewTaskButton" :to="{name: 'createTask'}" class="btn btn-primary mb-4" style="border-radius: 50%; background-color: blueviolet;"><i class="bi bi-plus" style="font-size:22px;"></i></RouterLink>
              </template>
              <template v-else>
              <RouterLink id="addNewTaskButton" to="#" class="btn btn-primary mb-4" style="border-radius: 50%; background-color: gray;"><i class="bi bi-plus" style="font-size:22px;"></i></RouterLink>
             
              </template>
              <div class="mb-4 d-flex justify-content-center">
                <div class="d-flex col col-lg-6 col-md-8 col-sm-12">
                 <div class="input-group">
                   <input class="form-control" type="search" placeholder="Search text in tasks" aria-label="Search"
                     v-model="searchedText"
                     @keyup.enter="$router.push({ name: 'tasks', query: searchedText ? { text: searchedText, page: 1 } : { page: 1 } })"
                     >
                   <RouterLink id="viewFilteredTasksBySearchedTextButton" :to="{name: 'tasks', query: (searchedText? ({'text':searchedText, 'page': 1}) :  ({'page': 1}))}" class="btn btn-success text-white" style="margin-right:20px;"><i class="bi bi-search"></i></RouterLink>
                 </div>
                </div>
              </div>

               <div>
               <RouterLink id="viewOpenedTasksButton" :to="{name: 'tasks', query: {'status': 'opened', 'page': 1}}" class="btn btn-success mb-4 text-white" style="margin-right:20px;">Opened tasks</RouterLink>
             
               <RouterLink id="viewFinishedTasksButton" :to="{name: 'tasks', query: {'status': 'finished', 'page': 1}}" class="btn mb-4 text-white" style="background-color: blueviolet;margin-right:20px;">Finished tasks</RouterLink>
            
               <RouterLink id="viewAllTasksButton" :to="{name: 'tasks', query: {'page': 1}}" class="btn mb-4 text-white" style="background-color: black;">All tasks</RouterLink>
              </div>
              <p><span>Showed tasks: </span> <strong v-if="!filtered_text">{{ filtered_status }}</strong> <strong v-if="filtered_text">{{ 'containing: "'+ filtered_text+'"' }}</strong></p>
            </div>
            <div style="padding-left:30px;padding-right:30px;">
             <p class="d-block text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="errors?(errors.form?true:(errors.task?true:false)):false">{{ errors.form?errors.form[0]:errors.task[0] }}</p> 
            <table class="table table-responsive mb-4" style="margin-left: auto;margin-right: auto; text-align: left;">
              <thead>
                <tr>
                  <th scope="col" style="width: 120px;">Manager</th>
                  <th scope="col" style="width:240px;">Task</th>
                  <th scope="col" style="width:140px;">Modified at</th>
                  <th scope="col" style="width:100px;">Status</th>
                  <th scope="col" style="width:220px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="mytasks"> 
                  <template v-if="mytasks.length>0">       
                   <TaskComponent v-for="(task, index) in mytasks" :task="task"
                    :index="index+1"  :key="task.id" 
                    @deleteTask="handleDeleteTaskParent(task)"
                    />
                   
                </template>
                </template>
              </tbody>
            </table>

       <PaginationComponent  :elements="tasks" :currentPage="currentPage"
        :changePage="changePage" 
       /> 
           </div>
          </div>
        </div>

      </div>
    </div>
</div>
</section>
</template>
<style scoped>

.custom-background{
  background: rgba(126, 64, 246, 1)!important;
  border:none!important;
  border-radius: 2em!important;
  
  border: 2px solid rgba(255, 255, 255, 0.05)!important;
  
  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03)!important;
} 

table {border-radius: 2em!important;}
tr, td{
  background-color: rgba(24, 24, 16, 0.2)!important;
  color:white!important;
}

th{
  background-color: rgba(126, 64, 246, 0.8)!important;
  color:white!important;
}

 tr,th:first-of-type {
  border-top-left-radius: 2em!important;
  }

  tr,th:last-of-type {
  border-top-right-radius: 2em!important;
  }
  
  tr:last-of-type, tr:last-of-type td:first-child   {
  border-bottom-left-radius: 2em!important;
  }

  tr:last-of-type, tr:last-of-type td:last-child  {
  border-bottom-right-radius: 2em!important;
  }

  
  
</style>