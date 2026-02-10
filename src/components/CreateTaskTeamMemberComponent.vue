<script setup>

import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTasksUsersStore } from '@/stores/tasksUsers';
//import { RouterLink } from 'vue-router'; 
import { storeToRefs } from 'pinia';
import { onMounted, computed } from 'vue';
import { defineEmits } from 'vue';

const errorMessage = ref('');

const props=defineProps(['task_id','task_manager_user_id']);
const {getTaskOtherPotentialTeamMembers}=useTasksUsersStore();
const {addTaskTeamMember}=useTasksUsersStore();
const {user} = storeToRefs(useAuthStore());

const newMember=ref(null);
const emit = defineEmits(['reload'])

const triggerReload = () => {
  console.log("reloaded1");
  emit('reload');
  console.log("reloaded2");
}

const createTaskTeamMember=async () =>
{
    const ok=ref(true);
    errorMessage.value = ''; // resetam eroarea
   // console.log('1:',member);
    console.log('1 prop:',newMember.value);
   if (newMember.value) {
    
    ok.value=await addTaskTeamMember(newMember.value, props.task_id, props.task_manager_user_id);
    
     if  (ok.value==false)
     {
    // Extrage mesajul din response, dacă există
      errorMessage.value = "Error adding member to the team. The page was refreshed!";
      console.log('eroare 123');
      }
    else
    {
      console.log('true 123');
    }
    newMember.value=null;
    
    //if (ok.value) {
      getMembers();triggerReload();
    //}
   }
}
const taskRemainingMembers=ref(null);
const getMembers=async ()=> {
  taskRemainingMembers.value= await getTaskOtherPotentialTeamMembers(props.task_id, props.task_manager_user_id);
};

onMounted(getMembers);

</script>

<template>
    <form class="d-flex justify-content-center" >
    <select v-model="newMember" style="margin-right:10px;line-height:1rem;min-width:100px;">
        <option v-for="(user) in taskRemainingMembers"
        :value="user.id">{{ user.name }}</option>
    </select>
    
    <button type="button" @click="createTaskTeamMember()" class="btn btn-primary" style="line-height: 1rem;">Add team member</button>
    </form>
     <!--  Alerta dacă apare eroare -->
     <div v-if="errorMessage" style="color:red;">
      {{ errorMessage }}
    </div>

</template>