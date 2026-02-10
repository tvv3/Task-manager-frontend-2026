import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { ref, reactive } from "vue";
import {handle419} from "@/assets/functions"
const isDev =  import.meta.env.VITE_APP_ENV? (import.meta.env.VITE_APP_ENV != 'production') : false; 

export const useTasksUsersStore = defineStore("TasksUsersStore", {
  state: () => ({
    errors: {},
    task_id: ref(null),
    users: ref([]),
    myserver: "http://127.0.0.1:8000/api",
  }),

  actions: {
    async getTaskOtherPotentialTeamMembers(task_id, task_manager_user_id) {
      //no 1,2,3
       if (!task_id)
      {
        this.errors = { task: ["Task not identified!"] };
        return {};
      }
       if (!task_manager_user_id)
      {
        this.errors = { task: ["Task manager not identified!"] };
        return {};
      }
      const authStore = useAuthStore();
      if (authStore.user.id === task_manager_user_id)//4.1
      {
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasksUsers/potential-members/task/${task_id}`, {
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
            this.errors = { task: [isDev? (data?.message||"") || " Team fetching error": "Task's team not fetched."] };
            //5.4.v2
            //no 5.5; 5.6.1; 5.5.2
            return {}; //5.6.2 
          } else 
          { //console.log("data=",data);
            if (data!=null && !(Array.isArray(data) && data.length === 0))
           {
              this.errors = {};
              return data;//just data --- data.data will be taken in view
              //console.log("Successfully fetched task's comments for page " + currentPage);
              //console.log('data:',data);
           }
           else {
            this.errors = { task: [ (isDev? (data.message? data.message: "No other users fetched") : "No other users fetched")] };
            //console.log(5.12);
             }//5.12
          }
            /*if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
          {
            if (data.errors) //5.8
           {
              this.errors = data.errors;
              return {};
            } else //5.9
            {
              if (data.message) {
              this.errors = { task: [data.message] };
              return {};
              }//5.10
               else {
              this.errors = {};
              return data;
              }//5.11
            }//end 5.9
          }//end 5.8
         else //5.12
          {
            this.errors = { task: ["No other users fetched!"] };
            return {};
          }*/
        } catch (error)//6
        {
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
          return {};
        }
        //no 7 finally
      } else {
        this.errors = { task: ["Not authorized to view the team of this task!"] };
        return {};
      }//4.2
    },

    async addTaskTeamMember(user_id, task_id, task_manager_user_id) {
      const formData = reactive({ user_id, task_id });
      //no 1,2,3
       if (!user_id)
      {
        this.errors = { task: ["User not identified!"] };
        return false;
      }
       if (!task_id)
      {
        this.errors = { task: ["Task not identified!"] };
        return false;
      }
       if (!task_manager_user_id)
      {
        this.errors = { task: ["Task's manager not identified!"] };
        return false;
      }
      const authStore = useAuthStore();
      //4.1:
      if (authStore.user.id === task_manager_user_id) {
        try {//5:
          const res = await fetch(`${this.myserver}/tasksUsers`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            body: JSON.stringify(formData),
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
            this.errors = { task: [isDev? (data?.message || "")||" Error at adding team member" : "Team member not added"] };
            //5.4.v2 // modified with data?.message
            if (res.status === 422) //5.5
            {
              //this.errors = data.errors || { task: ["Error at adding task member"] };
              //5.6.1
              if (isDev)
              {
              
              this.errors = {task: data.errors.user_id || data.errors.task_id || ["Error at adding the task member"] };
              //console.log(5.5,this.errors);
              }
              else
               { if (data?.errors)
                this.errors= {
                    task: data.errors.user_id ? ["Please check your new team member."] : ( data.errors.task_id ? ["Please check your task."] : ["Error at adding a new task's member to the team"]),
                     //task_id or task ???
                  };
                else this.errors={ task: ["Error at adding the team member"] };
               }       
              }//5.6.1
            //} 
            /*else {//5.5.2 //optional
              this.errors = { task: ["Team member creation error: " + (data?.message || "")] };
            }*/
            
            return false;//5.6.2
          } 
          //5.7:
          else 
          {//console.log("added data=",data);
          if (data?.data?.id)//5.12 if id comment creat not null
          {
            this.errors = {};
            //console.log("Successfully added new task's comment");
            return true;
          }
          else {
            this.errors = { task: [((isDev)? /*"Status: "+res.status +*/ (data.message? " "+ data.message: "Team member not added") : "Team member not added")] };
            return false;
           }//end 5.12 else
          
          }//end else res.ok=true

            /*if (data !== null && !(Array.isArray(data) && data.length === 0)) {
            //5.8:
            if (data.errors) {
              this.errors = data.errors;
              return false;
            } else//5.9
                //5.10:
               if (data.message) {
              this.errors = { task: [data.message] };
              return false;
               } 
               //5.11:
               else {
              this.errors = {};
              return true;
               }
          }//end 5.9 
          */
          /*
           else//5.12
            {
            this.errors = { task: ["No team member fetched after adding with errors!"] };
            return false;
            }*/

        } catch (error) {//6
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
          return false;
        }
      } else {//4.2
        this.errors = { task: ["Not authorized to add team members to this task!"] };
        return false;
      }
    },

    async deleteTeamMember(task, user) {
      //no 1,2,3
       if (!task)
      {
        this.errors = { task: ["Task not identified!"] };
        return;
      }
       if (!user)
      {
        this.errors = { task: ["User not identified!"] };
        return;
      }
      const authStore = useAuthStore();
      if (authStore.user.user_role.role === "admin" || authStore.user.id === task.manager_user_id) 
        //4.1
        {
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasksUsers/delete/task/${task.id}/user/${user.id}`, {
            method: "DELETE",
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

          if (!res.ok) //5.3
          {
            this.errors = { task: [isDev? (data?.message||"") || " Team member deletion error": "Team member deletion error"] };
            //5.4
            //no 5.5, 5.6.1, 5.5.2, no 5.6.2 (no return);

          } else 
            
            /*if (data !== null && !(Array.isArray(data) && data.length === 0)) 
            //5.7
            {
            if (data.errors) {
              this.errors = data.errors;
            } //5.8
            else //5.9
           {  //no 5.10!!!!
              this.errors = {};
              console.log("Successfully deleted team user!");//5.11
            }
          } else {
            this.errors = { task: ["No data fetched!"] };
          }//5.12
          */
         {
              this.errors = {};
              //console.log("Successfully deleted team user!");//5.11
            }
        } catch (error) //6
        {
          this.errors = { task: ["Network error or server is unreachable. " + error.message] };
        }
        //no 7 finally
      } else //4.2
      {
        this.errors = { task: ["Not authorized to delete team members of this task!"] };
      }
    },
  },
});
