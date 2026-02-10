<script setup>
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { RouterLink } from 'vue-router'; 
import { storeToRefs } from 'pinia';
import { onMounted, computed } from 'vue';
import { defineEmits } from 'vue';
import { timeAgo } from '@/assets/functions';

const props=defineProps(['task','index']);
const {changeTaskStatus, deleteTask}=useTasksStore();
const {user} = storeToRefs(useAuthStore());

const updated_at=computed(()=>(new Date(props.task.updated_at)).toLocaleString());
const updated_at_time_ago=computed(()=>
     timeAgo(new Date(props.task.updated_at)));

const emit = defineEmits(['reload','deleteTask'])

const triggerReload = () => {
  console.log("reloaded1");
//  emit('reload');
  console.log("reloaded2");
}

const triggerReload2 = () => {
 // console.log("reloaded1");
  emit('reload');
 // console.log("reloaded2");
}
/*
async function handleDeleteTask(task)
{
  //showLoader.value=true;
  await deleteTask(task).then(
    (value)=> { console.log(value);
  if (value===true) { console.log('refresh after delete '); return true;}
  //tasksCommentsStore.getTasksComments(task, route.query.page ? parseInt(route.query.page) : 1);
  //not necessary because if it doesn't delete it refreshes and i don't get the solution
    })
  .finally(()=>{//showLoader.value=false
     console.log('task was deleted');
  }) ;
  return false;
}
*/
function isAdminOrManager()
{
  if (!user.value) return false;
  if (!user.value.user_role) return false;
  if (!user.value.user_role.role) return false;
  if (user.value.user_role.role=="admin") return true;
  if (user.value.id===props.task.manager.id) return true;
  return false; 
}

function isManagerOrTeamUser()
{
  if (!user.value) return false;
  if (!user.value.user_role) return false;
  if (!user.value.user_role.role) return false;//mandatory cause at the begining we don't have the role
  if (user.value.user_role.role=="user") 
{
  if (user.value.id===props.task.manager.id) return true;
  if (props.task.users)
  {
   props.task.users.forEach(teamUser => {
     if (user.value.id===teamUser.id) return true;
   });
  }
}
  return false;
}
</script>
<template>
     <tr>
                  <td>
                    <span class="ms-2">{{props.task.manager.name}}</span>
                  </td>
                  <td class="align-middle">
                    <span>{{props.task.title}}</span>
                  </td>
                  <td>
                     <strong class="text-violet-custom">{{ updated_at_time_ago }}</strong>  
                  </td>
                  <td class="align-middle">
                    <h6 class="mb-0"><span class="badge" :style="`${(props.task.is_done===false)?'background-color:green!important;':'background-color:blueviolet!important;'}`">{{ computed(()=>(props.task.is_done===false)? 'Opened':'Finished') }}</span></h6>
                  </td>
                  <td class="align-middle">
                    <RouterLink :to="{name: 'taskTeam', params: {'task_id': props.task.id}}" title="Team"><i
                        class="bi bi-people-fill me-3" style="color:blueviolet"></i></RouterLink>
              
                        <RouterLink :to="'/taskComments/' + props.task.id" title="Comments"><i
                       class="bi bi-chat-left-text text-primary me-3"></i></RouterLink>
                    <template v-if="user.id===props.task.manager_user_id">
                    <RouterLink :to="{name:'editTask', params:{id: props.task.id}}" title="Edit"><i
                        class="bi bi-pencil text-success me-3"></i></RouterLink>
                    </template>
                    <template v-else>
                    <RouterLink to="#" title="Edit not allowed"><i
                        class="bi bi-pencil me-3" style="color:gray;"></i></RouterLink>
                  
                    </template>
                    <template v-if="isManagerOrTeamUser()===false">
                    <button type="button" style="border:none;background-color: transparent;"  :title="`${(props.task.is_done===false)?'Finish':'Open'}`"><i
                        class="bi bi-check me-3 text-seccondary"></i>
                    </button>
                      </template>
                    <template v-else>
                    <button type="button" style="border:none;background-color: transparent;" @click="async ()=> {await changeTaskStatus(props.task, !props.task.is_done/*, triggerReload*/); triggerReload2();}" :title="`${(props.task.is_done===false)?'Finish':'Open'}`"><i
                        :class="`${(props.task.is_done===false)? 'bi bi-check me-3 text-danger': 'bi bi-check me-3 text-success'}`"></i>
                    </button>
                    </template>

                   <template v-if="isAdminOrManager()===true">
                    <button type="button"  title="Delete" style="border:none;background-color: transparent;" @click="()=>{emit('deleteTask');}"><i
                        class="bi bi-trash text-danger"></i></button>
                   </template>
                   <template v-else>
                    <button type="button"    style="border:none;background-color: transparent;"  title="Delete not allowed"><i
                        class="bi bi-trash" style="color:gray;"></i></button>
                   </template>
                  </td>
    </tr>
</template>
<style scoped>

th, tr, td{
  background: /*rgba(24, 24, 16, 0.2)*/ whitesmoke!important;
  color:black!important;
  border-color:transparent!important;
}
td{padding-right:10px;}
td:first{padding-left: 10px;}
</style>