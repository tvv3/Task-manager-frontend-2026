import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { ref } from "vue";
import {handle419} from "@/assets/functions"
const isDev =  import.meta.env.VITE_APP_ENV? (import.meta.env.VITE_APP_ENV != 'production') : false; 

export const useTasksCommentsStore = defineStore("TasksCommentsStore", {
  state: () => ({
    errors: {},
    comment_id: null, //for update and delete
    tasksComments: ref({data:[]}),
    myserver: "http://127.0.0.1:8000/api",
  }),

  actions: {
    /************************* createTaskComment *********************/
    async createTaskComment(task, user, formCommentData2) {
      this.comment_id = null;//1
      const ok = ref(false);//2
      
      if ((task)&&(user)&&(formCommentData2)&&(formCommentData2.comment)
        &&(user.user_role.role === "user"))
        { ok.value = true;}//3

      if (ok.value === true)//4.1
      {
        try {//5
          const formData = { task_id: task.id, comment: formCommentData2.comment };
          //5.0
          const res = await fetch(`${this.myserver}/tasksComments`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            body: JSON.stringify(formData),
            credentials: "include", // send cookies automatically
          });//5.1

          if (handle419(res,this,'task')) return false;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }


          if (!res.ok) //5.3
            {
            this.errors = isDev? { task: [( data?.message || "") || " Failed to create comment"] }
                               : {task: ["Failed to create comment"]};
            //5.4.v2 // modified with data?.message
            if (res.status === 422) //5.5
            {
              if (isDev)
              {
              
              this.errors = {task: data.errors.comment || data.errors.task_id || ["Error at adding a comment"] };
              //console.log(5.5,this.errors);
              }
              else
                if (data?.errors)
                this.errors= {
                    task: data.errors.comment ? ["Please check your comment."] : ( data.errors.task_id ? ["Please check your comment's task."] : ["Error at comment create"]),
                     //task_id or task ???
                  };
                else this.errors={ task: ["Error at adding a comment"] };
                       
            }//5.6.1
            /*else {//5.5.2 //new 4 dec 2025 
              this.errors = { task: ["Comment creation error: " + (data?.message || "")] };
            }*/
            return false;//5.6.2
          } 
          else 
            {//res.ok=true --- status 200-299 success
            /*if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
          {
            if (data.errors) {
              this.errors = data.errors;
              return false;
            } //5.8
            else //5.9
            {
              if (data.message) {
                this.errors = { task: [data.message] };
                return false;
              }//5.10 
              else {
                this.errors = {};
                console.log("Successfully added new task's comment");
                return true;
              }//5.11
            }//end 5.9
          }//end 5.7 
          */
          if (data?.data?.id)//5.12 if id comment creat not null
          {
            this.errors = {};
            //console.log("Successfully added new task's comment");
            return true;
          }
          else {
            this.errors = { task: [((isDev)? /*"Status: "+res.status +*/ (data.message? " "+ data.message: "Comment not created") : "Comment not created")] };
            return false;
           }//end 5.12 else
          
          }//end else res.ok=true
        } catch (error)//6 
        {
          this.errors = { task: ["Network error or server is unreachable. " + ((isDev)? error.message:"")] };
          return false;
        } finally//7
        {
          console.log("end create comment");
        }
      } else//4.2
      {
        if (!((task)&&(user)))
        {
        this.errors = { task: ["Error! Task or user not identified!"] };
        return false;
        }
        else if (!formCommentData2?.comment)
          {
        this.errors = { task: ["Error! Comment cannot be empty!"] };
        return false;
        }
        else{
        this.errors = { task: ["Not authorized to create comments for this task!"] };
        return false;
        }
      }
    },

    /************************* getTasksComments ***************/
    async getTasksComments(task, currentPage) {
      this.comment_id = null;//1
      //no 2,3 
      const authStore = useAuthStore();
      this.tasksComments.data =[];//initializare
      //1b
      if (!task)
      {
        this.errors = { task: ["Task not selected!"] };
        return;
      }
      if (
        authStore.user.user_role.role === "admin" ||
        authStore.user.id === task.manager_user_id ||
        (task.users && task.users.find((u) => u.id === authStore.user.id))
      )//4.1
       {
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasksComments/list/${task.id}?page=${currentPage}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            credentials: "include",
          });//5.1

           if (handle419(res,this,'task')) return;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }


          if (!res.ok)//5.3
         {
            this.errors = { task: [((isDev)?(data?.message ||"")|| " Error fetching comments" :"Error fetching comments")] };
            //5.4
            //no 5.5, 5.6.1, 5.5.2, 5.6.2
          } else 
            /*
            if (data !== null && !(Array.isArray(data) && data.length === 0)) 
           //5.7   
         {
            if (data.errors) {
              this.errors = data.errors;
            }//5.8
             else//5.9
             {
              if (data.message) {
              this.errors = { task: [data.message] };
               } //5.10
              else {
              this.errors = {};
              this.tasksComments = data;
              console.log("Successfully fetched task's comments for page " + currentPage);
              }//5.11
            }//end 5.9
          } //end 5.7 
           */
          {
           if (data!=null && data.data!= null && !(Array.isArray(data.data) && data.data.length === 0))
           {
              this.errors = {};
              this.tasksComments = data;//just data --- data.data will be taken in view
              console.log("Successfully fetched task's comments for page " + currentPage);
              console.log('data:',data);
           }
           else {
            this.errors = { task: [ (isDev? (data.message? data.message: "No comments fetched for this page") : "No comments fetched for this page")] };
            //console.log(5.12);
             }//5.12
          }//end else res.ok=true
        } //end try 5
        catch (error)//6
        {
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
        } 
        finally//7
        {
          console.log("end getTasksComments");
        }
      } else //4.2
      {
        this.errors = { task: ["Not authorized to fetch the comments of this task!"] };
      }
    },

    /************************* editTasksComment ***************/
    async editTasksComment(task_id, comment, newCommentValue) {
      this.comment_id = comment.id;//1
      //no 2,3
      const authStore = useAuthStore();

      if (!task_id)
      {
        this.errors = { comment: ["Task not selected!"] };
        return;
      }
      if (!comment)
      {
        this.errors = { comment: ["Comment not selected!"] };
        return;
      }
      if (!newCommentValue)
      {
        this.errors = { comment: ["New comment cannot be empty!"] };
        return;
      }
      if (
        authStore.user.user_role.role === "user" &&
        authStore.user.id === comment.user.id &&
        task_id === comment.task_id
      )//4.1
       {
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasksComments/${comment.id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            body: JSON.stringify({ comment: newCommentValue, task_id }),
            credentials: "include",
          });//5.1

          if (handle419(res,this,'comment')) return;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }

          if (!res.ok) //5.3
          {
             //5.4.v2 // modified with data?.message
            this.errors = isDev? { comment: [( data?.message || "") || " Error at updating comment"] }
                               : {comment: ["Error at updating comment"]};
            //5.4

            if (res.status === 422) //5.5
            {
              if (isDev)
              {
              
              this.errors = {comment: data.errors.comment || data.errors.task_id || ["Error at update"] };
              //console.log(5.5,this.errors);
              }
              else
                if (data?.errors)
                this.errors= {
                    comment: data.errors.comment ? ["Please check your comment"] : ( data.errors.task_id ? ["Please check your comment's task."] : ["Error at comment update"]),
                     //task_id or task ???
                  };
                else this.errors={ comment: ["Error at comment's update"] };
                       
            }//5.6.1
           
            //return false;//5.6.2
            
          } else 
            
            /*if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
           {
             if (data.errors) {
              this.errors = data.errors;
              }//5.8
             else //5.9
              {
              if (!data.data.comment || !data.data.updated_at) {
                this.errors = { comment: ["Error at update! Incorrect data fetched!"] };
              } //5.10.b
              else {
                this.errors = {};
                const index = this.tasksComments.data.findIndex((c) => c.id === comment.id);
                if (index !== -1) {
                  this.tasksComments.data[index].comment = data.data.comment;
                  this.tasksComments.data[index].updated_at = data.data.updated_at;
                }//5.11.1
                
               // else
                  //{
                 // this.errors={comment: ["The comment could not be identified!! Please reload!!!"]};
                 // }
                  
                //else remains not!! added here at 4 dec 2025
                // 5.11.2
              }//5.11
            }//end 5.9
          }//end 5.7
          */
         /*
           else {
            this.errors = { comment: ["Error at comment update! No data fetched!"] };
          }//5.12
          */

          {
            if (data?.data?.id)//5.12 if id comment creat not null
          {
            this.errors = {};
                const index = this.tasksComments.data.findIndex((c) => c.id === comment.id);
                if (index !== -1) {
                  this.tasksComments.data[index].comment = data.data.comment;
                  this.tasksComments.data[index].updated_at = data.data.updated_at;
                }//5.11.1
            //return;//true
          }
          else {
            this.errors = { comment: [((isDev)? /*"Status: "+res.status +*/ (data.message? " "+ data.message: "Comment not modified") : "Comment not modified")] };
            //return;//false
           }//end 5.12 else
          
          }//end else res.ok=true

        } catch (error)//6
       {
          this.errors = { comment: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
        } finally //7
        {
          console.log("end edit comment");
        }
      } else {
        this.errors = { comment: ["Not authorized to edit this comment!"] };
      }//4.2
    },

    /************************* deleteTasksComment ***************/
    async deleteTasksComment(comment) {
      this.comment_id = comment.id;//1
      const authStore = useAuthStore();
      if (!comment)
      {
        this.errors = { comment: ["Error! Comment not selected!"] };
        return false;
      }
      //no 2,3
      if (
        (authStore.user.user_role.role === "user" && authStore.user.id === comment.user_id) ||
        authStore.user.user_role.role === "admin"
      )//4.1
       {
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasksComments/${comment.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            credentials: "include",
          });//5.1

          if (handle419(res,this,'comment')) return false;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }

          if (!res.ok)
          //5.3   
         {
            this.errors = { comment: [isDev? data?.message || "Error deleting comment" : "Error deleting comment"] };
            //5.4
            //no 5.5, 5.6.1, 5.5.2, 5.6.2
            //console.log(1);
          } else 
            
          /*if (data !== null && !(Array.isArray(data) && data.length === 0))
           //5.7  
          {
            if (data.errors) {
              this.errors = data.errors;
              //console.log(2);
            } //5.8
            else //5.9
              { //no 5.10
              this.errors = {};
              const index = this.tasksComments.data.findIndex((c) => c.id === comment.id);
              if (index !== -1) {
                this.tasksComments.data.splice(index, 1);
              }
              //console.log("Successfully deleted comment:", data.message || "");
              //console.log(3);
              return true;
              //5.11.1
            }//end 5.9
          } //end 5.7
          else {
            this.errors = { comment: ["Error at comment delete! No data fetched!"] };
            console.log(4);
          }//5.12
          */
           { //no 5.10
              //console.log("data: ",data);
              this.errors = {};
              const index = this.tasksComments.data.findIndex((c) => c.id === comment.id);
              if (index !== -1) {
                this.tasksComments.data.splice(index, 1);
              }
              //console.log("Successfully deleted comment:", data.message || "");
              //console.log(3);
              return true;
              //5.11.1
            }//end 5.9
        } catch (error)//6
         {
          this.errors = { comment: ["Network error or server is unreachable. " + (isDev? error.message: "")] };
          console.log(5);
        } finally //7
        {
          console.log("end delete comment");
        }
      } else {
        this.errors = { comment: ["Not authorized! You cannot delete this comment!"] };
        //console.log('6');
      }//4.2

      return false;//on any error if not returned true already; 
      //new step 8 !!!
    },
  },
});
