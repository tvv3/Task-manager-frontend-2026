<script setup>
import TaskComponent from '@/components/TaskComponent.vue';
import TeamMemberComponent from '@/components/TeamMemberComponent.vue';
import LoaderComponent from '@/components/LoaderComponent.vue';
import CreateTaskTeamMemberComponent from '@/components/CreateTaskTeamMemberComponent.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';

import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
//import { nextTick } from 'vue';
const {errors} = storeToRefs(useTasksStore());
const {getTask, deleteTask} = useTasksStore();
//const {team} = storeToRefs(useTeamStore());

const {user} = storeToRefs(useAuthStore());
//const teamStore = useTeamStore();

const route=useRoute();

const task_id=ref(null);
const task=ref(null);
task_id.value=route.params.task_id;
const showLoader=ref(false);
const fetchTask=

  async()=>{errors.value={};showLoader.value=true; await getTask(route.params.task_id).then((mytask)=>{task.value=mytask;}).finally(()=>{showLoader.value=false;});};

const keyAddMember=ref(0);
const refreshCreateTaskTeamMemberComponent=()=>{
  keyAddMember.value++;
};

onMounted(

async()=>{errors.value={};showLoader.value=true; await getTask(route.params.task_id).then((mytask)=>{task.value=mytask;}).finally(()=>{showLoader.value=false;}); console.log('mounted');});


const isAdminOrManagerOrTeamMember = () =>
{
  let ok=false;
 // console.log(user.value.id);
  console.log("task123:", task.value);
  if (task.value==null) return false;
  if (task.value==undefined) return false;
  //if (Object.keys(task.value).length==0) return false;
  if (user.value==null) return false;
  if (task.value.manager==null) return false;
  if (user.value.user_role.role=="admin") return true;
  if (user.value.id==task.value.manager.id) return true;
  if (task.value.users)
  {
    const x=task.value.users;
    x.forEach(element => {
        console.log(element.id,user.value.id);
        if (element.id==user.value.id) {ok= true;}
    });
  }
  if (ok) return true; 
  else return false;
};

const isManager = ()=>
{
  console.log(user.value.id);
  console.log("task1234:", task.value);
  if (!task.value) return false;
  if (!user.value) return false;
  //if (user.value.user_role.role=="admin") return false;
  if (user.value.id==task.value.manager.id) {return true;}
  return false;
};
async function handleDeleteTaskParent2(task)
{
  const ok=await deleteTask(task);
  console.log('123');
  if (ok) 
  {
    router.push({name: 'tasks'});
   }
}  
                   
</script>
<template>
    <section>
  <LoaderComponent v-show="showLoader"/>
  <template v-if="(showLoader==false)&&(isAdminOrManagerOrTeamMember()==true)">
                      
  <div class="container">
    <div class="row" style="display:flex; justify-content: center; align-items: center;">
        <div class="col-md-12 col-lg-12 col-xl-12">
        <div class="card mb-3 bg-light"> <!--custom-background-->
          <div class="card-body">
            
            <div class="pt-3 pb-2 text-center">
              <div class="d-lg-flex justify-content-lg-center">
        
              <h2 class="my-4" style="text-align: center;">Task's Team </h2>
              <!--img src="/src/images/check1.webp"
              alt="Check" width="60px" height="60px" class="my-2"-->
              </div>
              <template style="display:block; margin-bottom:30px;margin-top:10px;">
              <template v-if="isManager()==true">
                 <CreateTaskTeamMemberComponent :key="keyAddMember" :task_id="task.id" :task_manager_user_id="task.manager_user_id" @reload="async()=>{showLoader=true; await getTask(route.params.task_id).then((mytask)=>{task=mytask;}).finally(()=>{showLoader=false;});}"/>
              </template>
              <template v-else>
                 <button disabled="disabled">Add new member</button>
              </template>
              </template>
              

            </div>
          
            <div style="padding-left:30px;padding-right: 30px;">
               <p class="d-block text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="errors? (errors.form?true:(errors.task?true:false)):false">{{ errors.form?errors.form[0]:errors.task[0] }}</p> 
              <table class="table table-responsive mb-4" style="margin-left: auto;margin-right: auto;">
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
                <TaskComponent :task="task"
                    index="0"  :key="task.id" 
                    @deleteTask="handleDeleteTaskParent2(task)"
                    @reload="async ()=>{ await fetchTask();}" />
              </tbody>
              </table>
            </div>
            <div class="container">
            <table class="table table-responsive mb-4" style="margin-left: auto;margin-right: auto;max-width:600px;">
              <thead>
                <tr>
                  <th scope="col">Team Member</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="task.users"> 
                  <template v-if="task.users.length>0">       
                   <TeamMemberComponent v-for="(user, index) in task.users" :user="user"  :task="task"
                    :index="index"  :key="user.id" @reload="async ()=>{await fetchTask(); refreshCreateTaskTeamMemberComponent();/*router.push({name: 'taskTeam', params: {'task_id': props.task.id}});*/}"/>
                </template>
                <template v-else>
                     There is no team defined for this task!
                </template>
                </template>
                <template v-else>
                     No team defined for this task!
                </template>
              </tbody>
            </table>
          </div><!--div container-->


          </div>
        </div>

      </div>
    </div>
</div>
</template>
<template v-if="(showLoader==false)&&((isAdminOrManagerOrTeamMember()==false))">
                      
   <p class="d-block text-danger" style="margin-left:30px;font-weight:bold;"> Task doesn't exist or You are not authorized to view this task's team!</p>
</template>
</section>
</template>
<style>
.pagination .page-item{margin-right:5px;}
.pagination .page-item:first-of-type .page-link, .pagination .page-item:last-of-type .page-link {border-radius:50%;}
.pagination .page-link{color: #7e40f6 ; border-radius: 50%;}
.pagination .page-link:hover{opacity:0.8;}
.pagination .active>.page-link{background-color: blueviolet!important;color:white;}
.pagination span.disabled{color:darkgray!important;}
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


.page-link.disabled {
  pointer-events: none;
  color: #ccc;
}
  
</style>