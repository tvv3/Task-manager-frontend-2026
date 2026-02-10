  
<script setup>
import { timeAgo } from '@/assets/functions';
import { ref, defineProps, reactive, defineEmits, computed } from 'vue';
const props=defineProps(['task', 'comment', 'auth_user']);
const showUpdate=ref(false);
const formData=reactive({"comment": props.comment.comment});
const emit=defineEmits(['updateComment', 'deleteComment']);
const created_at=computed(()=>(new Date(props.comment.created_at)).toLocaleString());
const updated_at=computed(()=>(new Date(props.comment.updated_at)).toLocaleString());
const created_at_time_ago=computed(()=>
     timeAgo(new Date(props.comment.created_at)));
const updated_at_time_ago=computed(()=>
     timeAgo(new Date(props.comment.updated_at)));
</script>
  <template>
  <div class="card mb-4">
    <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
                        <p class="mb-1">
                          
                        <strong>{{ comment.user.name }} : </strong>  {{comment.comment}}<span class="small"> 
                          <br>
                          <strong>  
                          {{ "created: " + created_at_time_ago}}</strong>
                        
                         <template v-if="updated_at!=created_at" >  
                          <br>
                          <strong class="text-violet-custom">{{ "updated: "+updated_at_time_ago }}</strong>  
                         </template> 
                      </span>
                        </p>
                        <div class="d-flex justify-content-center">
                        <button v-if="comment.user_id==auth_user.id" class="m-lg-2 symbols" title="Edit" @click="showUpdate=true"><i class="bi bi-pencil text-success"></i></button>
                        <button v-else class="m-lg-2 symbols" title="Edit"><i class="bi bi-pencil text-seccondary"></i></button>
                        
                      <button v-if="(comment.user_id==auth_user.id)||(auth_user.user_role.role=='admin')" title="Delete" class="symbols" @click="emit('deleteComment')"><i class="bi bi-trash text-danger"></i><!--span class="small"> Delete</span--></button>
                      <button v-else title="Delete" class="symbols"><i class="bi bi-trash text-seccondary"></i><!--span class="small"> Delete</span--></button>
                            
                      </div>
         </div>
      <slot></slot>
      <p v-if="false" class="small mb-0">Comment's text goes here!</p>
        
    </div>
    <!--footer for update comment-->
    <div v-if="showUpdate" class="card-footer py-3 border-0" style="background-color: #f8f9fa;"  >
            <div class="d-flex flex-start w-100">
              
              <div data-mdb-input-init class="form-outline w-100">
                <textarea class="form-control" id="textAreaExample" rows="3"
                  style="background: #fff;" v-model="formData.comment"></textarea>
               
              </div>
            </div>
            <div class="float-end mt-2 pt-1">
              <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-success btn-sm m-lg-2" @click="emit('updateComment',{'newCommentValue':formData.comment});showUpdate=false;/*props.comment.comment=formData.comment; formData.comment='';*/">Update comment</button>
              <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-outline-success btn-sm" @click="formData.comment=comment.comment;showUpdate=false;">Cancel</button>
            </div>
          </div>
  </div>
</template>
<style scoped>
button.symbols {border:none; background-color:transparent;}
</style>