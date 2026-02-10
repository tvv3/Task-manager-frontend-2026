<script setup>
import { useAuthStore } from '@/stores/auth';
//import { useTasksStore } from '@/stores/tasks';
import { useTasksUsersStore } from '@/stores/tasksUsers';
import { RouterLink } from 'vue-router'; 
import { storeToRefs } from 'pinia';
import { onMounted, computed } from 'vue';
//import { defineEmits } from 'vue';
const props=defineProps(['user','task']);
const {deleteTeamMember}=useTasksUsersStore();
const {user} = storeToRefs(useAuthStore());


const emit = defineEmits(['reload'])

const triggerReload = () => {
  console.log("reloaded1");
  emit('reload');
  console.log("reloaded2");
}

/*
function isAdmin()
{
  if (!user.value) return false;
  return user.value.user_role.role=="admin";
}
*/
function isAdminOrManager()
{
  if (!user.value) return false;
  if (user.value.user_role.role=="admin") return true;
  if (user.value.id===props.task.manager_user_id) return true;
  return false; 
}

function isManagerOrTeamUser()
{
  if (!user.value) return false;
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
                    <span class="ms-2">{{props.user.name}}</span>
                  </td>
                  
                  <td class="align-middle">

                   <template v-if="isAdminOrManager()===true">
                    <button type="button"  title="Delete Member" style="border:none;background-color: transparent;" @click="deleteTeamMember(props.task, props.user);triggerReload();"><i
                        class="bi bi-trash text-danger"></i></button>
                   </template>
                   <template v-else>
                    <button type="button"    style="border:none;background-color: transparent;"  title="Delete Member not allowed"><i
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

</style>