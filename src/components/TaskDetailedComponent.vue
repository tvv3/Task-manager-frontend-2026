<script setup>
//import { RouterLink } from 'vue-router'; 
import { timeAgo } from '@/assets/functions';
import { computed } from 'vue';
import { defineProps } from 'vue';
const props=defineProps(['task']);//or if is finished blueviolet color !!!
const created_at=computed(()=>(new Date(props.task.created_at)).toLocaleString());

const updated_at=computed(()=>(new Date(props.task.updated_at)).toLocaleString());
const updated_at_time_ago=computed(()=>
     timeAgo(new Date(props.task.updated_at)));
</script>
<template>
     <div class="card m-4" style="background-color: whitesmoke;">
        <div class="card-body m-1">
     <div class="ms-1 small"><strong>Manager: </strong><span>{{props.task.manager.name}}</span></div>
                  
     <div class="ms-1 mb-1 mt-1"><strong>Task: </strong><span style="color:black;"><strong>{{props.task.title}}</strong></span></div>           
      
      <div class="ms-1 mb-1 mt-1"><strong>Created: </strong><span style="color:black;">{{created_at}}</span></div>           
      <div class="ms-1 mb-1 mt-1"><strong style="color:blueviolet">Modified: </strong><span style="color:blueviolet;"><strong>{{updated_at_time_ago}}</strong></span></div>           
     
       <div class="ms-1 d-flex">
                    
                        <span><strong>Status:&nbsp;</strong></span><p class="mb-0 inline"><span class="badge" :style="`${'color:white!important; ' + ((props.task.is_done===false)?'background-color:green!important;':'background-color:blueviolet!important;')}`">{{ (props.task.is_done===false)? 'Opened':'Finished' }}</span></p>
                     
                   
      </div>
    </div>
     </div> <!--container-->            
</template>
<style scoped>

</style>