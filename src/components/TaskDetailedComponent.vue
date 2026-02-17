<script setup>
//import { RouterLink } from 'vue-router'; 
import { timeAgo } from '@/assets/functions';
import { computed} from 'vue';
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
const props=defineProps(['task']);//or if is finished blueviolet color !!!
const created_at=computed(()=>(new Date(props.task.created_at)).toLocaleString());

const updated_at=computed(()=>(new Date(props.task.updated_at)).toLocaleString());
const updated_at_time_ago=computed(()=>
     timeAgo(new Date(props.task.updated_at)));
const {user} = storeToRefs(useAuthStore());
</script>
<template>
     <div class="card m-4" style="background-color: whitesmoke;">
         <div class="card-title d-flex justify-content-start ms-4 mt-4" style="font-weight: bold; font-size:large;">
          <span style="margin-right:10px;">Current Task</span>

         <span v-if="user.id===props.task.manager_user_id">
                    <RouterLink :to="{name:'editTask', params:{id: props.task.id}}" title="Edit"><i
                        class="bi bi-pencil text-success me-3"></i></RouterLink>
                    </span>
                    <span v-else>
                    <RouterLink to="#" title="Edit not allowed"><i
                        class="bi bi-pencil me-3" style="color:gray;"></i></RouterLink>
                  
         </span>
         </div><!--card title-->
        <div class="card-body m-1">
     <div class="ms-1 small"><strong>Manager: </strong><span>{{props.task.manager.name}}</span></div>
                  
     <div class="ms-1 mb-1 mt-1"><strong>Task: </strong><span style="color:black;"><strong>{{props.task.title}}</strong></span></div>           
      
      <div class="ms-1 mb-1 mt-1"><strong>Created: </strong><span style="color:black;">{{created_at}}</span></div>           
      <div class="ms-1 mb-1 mt-1"><strong style="color:blueviolet">Modified: </strong><span style="color:blueviolet;"><strong>{{updated_at_time_ago}}</strong></span></div>           
     
       <div class="ms-1 d-flex">
                    
                        <span><strong>Status:&nbsp;</strong></span><p class="mb-0 inline"><span class="badge" :style="`${'color:white!important; ' + ((props.task.is_done===false)?'background-color:green!important;':'background-color:blueviolet!important;')}`">{{ (props.task.is_done===false)? 'Opened':'Finished' }}</span></p>
                     
                   
      </div>

       <div class="ms-1 mb-1 mt-1"><strong>Description: </strong><span style="color:black;"><strong>{{props.task.description}}</strong></span></div>           
     
    </div><!--card body-->

     </div> <!--card-->            
</template>
<style scoped>

</style>