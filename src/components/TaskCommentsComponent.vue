<script setup>
import TaskCommentComponent from './TaskCommentComponent.vue';
import TaskDetailedComponent from './TaskDetailedComponent.vue';
import PaginationComponent from './PaginationComponent.vue';
import LoaderComponent from './LoaderComponent.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { useTasksCommentsStore } from '@/stores/tasksComments';

import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const { errors: errorsOfTask } = storeToRefs(tasksStore)

const tasksCommentsStore=useTasksCommentsStore();
const task=ref(null);
const formCommentData=reactive({comment:null});
const {user} = storeToRefs(useAuthStore());
const {tasksComments, errors, comment_id} = storeToRefs(useTasksCommentsStore());
const showAddCommentForm=ref(false);
const currentPage=ref(1);//mandatory 1
const showLoader=ref(true);
//console.log(localStorage.getItem('token'));
onMounted(async ()=> {
  errors.value={};
  showLoader.value=true;
  console.log(true);

  await tasksStore.getTask(route.params.task_id).then(
  //function(value) {showLoader.value=false;},
  //function(error) {console.log(error);showLoader.value=false;}
  async (mytask)=>{
    //console.log('errorsOfTask:'+errorsOfTask.value.task[0]);  
    task.value=mytask;
   //console.log('got the task data', mytask);
  
   //console.log("object123:",task.value);
   currentPage.value = route.query.page ? parseInt(route.query.page) : 1;
   await tasksCommentsStore.getTasksComments(mytask, currentPage.value).then(
   function (value){
   console.log('got the comments data');
   showLoader.value=false;
  }
); 
   //console.log(tasksComments.value);
   }

  ).finally(()=>{showLoader.value=false; 
                 //console.log("finally");
                 }); 
});
async function updComment(newCommentFromChild, comment, task)
{
  //console.log(newCommentFromChild.newCommentValue);
  //console.log(comment);
   
  //todo: call pinia updatecomment from store of tasksComments here
   await tasksCommentsStore.editTasksComment(task.id, comment, newCommentFromChild.newCommentValue);
    
}

//for pagination
// Watch for route query changes (pagination clicks)
watch(() => route.query.page, (newPage) => {
  console.log("Watch triggered! Page changed to:", newPage);
  currentPage.value = newPage ? parseInt(newPage) : 1;
  tasksCommentsStore.getTasksComments(task.value, currentPage.value);
});


// Function to change pages manually
const changePage = (page) => {
  if (page > 0 && page <= tasksCommentsStore.tasksComments.last_page) {
    console.log("go to", page);
    router.push({ query: { page } });
  }
};
async function handleUpdateComment(newCommentFromChild, comment, task)
{
showLoader.value=true; 
await updComment(newCommentFromChild, comment, task)
.then((value) => {})
.finally(()=>{showLoader.value=false;});
}  

async function handleDeleteComment(comment, task)
{
  let ok;
  
  showLoader.value=true;
  await tasksCommentsStore.deleteTasksComment(comment).then(
    (value)=> {
  if (value===true) {
    ok=true;
   
    //tasksCommentsStore.getTasksComments(task, route.query.page ? parseInt(route.query.page) : 1);
     }
 
  }
  //not necessary because if it doesn't delete it refreshes and i don't get the solution
    )
  .finally(()=>{if (!ok) {showLoader.value=false;}});
                 
   if (ok)
  {
     
      await tasksCommentsStore.getTasksComments(task, route.query.page ? parseInt(route.query.page) : 1);
    
       if (Object.keys(tasksComments.value.data).length===0) {
      //router.push('taskComments/'+task.id+'?page=1');
         await  router.push({ path: `/taskComments/${task.id}`, query: { page: 1 } });  
        }
       showLoader.value=false;  
                     
  } 
}

</script>
<template>
  <section>
  <div class="container">
<LoaderComponent v-show="showLoader==true" />
<div v-show="showLoader==false" id="page">
  
<div class="row d-flex justify-content-center">
  
  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <div class="card shadow-0 border" style="background-color: #f0f2f5;overflow-y: hidden;">
      <div class="card-title d-block">
        <br>
        <div class="d-lg-flex justify-content-lg-center">
        
         <h2 class="my-4" style="text-align: center;">Task's Comments </h2>
           <!--img src="/src/images/check1.webp"
              alt="Check" width="60px" height="60px" class="my-2"-->
        </div>
        <br>
        
        <TaskDetailedComponent v-if="task" :task="task" />
         <p class="text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="errorsOfTask?.task" >{{ errorsOfTask.task[0] }}</p>           
        <p class="text-danger" style="margin-left:30px;font-weight:bold; margin-top:-10px;" v-if="(!errorsOfTask?.task)&&errors?.task">{{ errors.task[0] }}</p> 
        
      </div>
      <div v-if="task">
      <div class="container" style="padding-left:30px; padding-right:30px;">
      <div class="card-body p-2">
        <div class="text-center mb-4"><button
          class="btn btn-primary btn-block fa-lg mb-1"
        :class="[showAddCommentForm ? 'bg-violet-custom': 'bg-success']"
        @click="showAddCommentForm=!showAddCommentForm;">
         {{ showAddCommentForm ? 'Hide Add Comment Form' : 'Show Add Comment Form' }}
        </button>
        </div>
        <div data-mdb-input-init v-if="showAddCommentForm" class="form-outline mb-4" style="padding-left:30px; padding-right:30px;">
          <textarea class="form-control" id="addAComment" rows="3"
                  v-model="formCommentData.comment"
                  style="background: #fff;"></textarea>
         <div>
          <!--label class="form-label" for="addAComment">+ Add a comment</label-->
          <div class="text-end mt-2 pt-1">
              <button  type="button"
               @click="async ()=>{const ok=await tasksCommentsStore.createTaskComment(task, user, formCommentData); if (ok) {tasksCommentsStore.getTasksComments(task, route.query.page ? parseInt(route.query.page) : 1);}
 formCommentData.comment='';}"
              data-mdb-button-init data-mdb-ripple-init class="btn btn-success btn-sm m-lg-2">Add comment</button>
           </div>
          </div>
        </div>
        
        <hr style="margin-left: 30px;margin-right: 30px;"> 
        
       <template v-if="tasksCommentsStore.tasksComments"> 
           <template v-if="tasksCommentsStore.tasksComments.data">
            <template v-if="tasksCommentsStore.tasksComments.data.length>0">     
            <div style="color:blueviolet;font-weight:bold; margin-top:10px; margin-bottom: 20px;padding-left:30px; padding-right:30px;">Comments:</div>   
            <div style="padding-left: 30px; padding-right: 30px;">
            <TaskCommentComponent v-for="(comment, index) in tasksCommentsStore.tasksComments.data" :task="task"
                    :index="index+1"  :key="comment.id"  :comment="comment" :auth_user="user"
                    @updateComment="handleUpdateComment($event, comment, task)"
                    
                    @deleteComment="handleDeleteComment(comment, task)"
                    
                  > <p class="text-danger" v-if="(comment_id)&&(comment_id==comment.id)&&(errors?errors.comment:false)">{{ errors.comment[0] }}</p> 
                   </TaskCommentComponent>

                    <!--@reload="reloadTask(task)"-->
          
          <PaginationComponent  :elements="tasksCommentsStore.tasksComments" :currentPage="currentPage"
        :changePage="changePage" 
       />
         </div>
        </template>
       </template>
      </template>
       
      </div>
      
      </div><!--container-->
      </div><!--if task div -->
    </div>
  </div>
  </div>
  <!--End of page-->
</div>
</div>
</section>
</template>    