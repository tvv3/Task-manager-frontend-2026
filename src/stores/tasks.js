import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { ref } from "vue";
import {handle419} from "@/assets/functions"
const isDev =  import.meta.env.VITE_APP_ENV? (import.meta.env.VITE_APP_ENV != 'production') : false; 

export const useTasksStore = defineStore("TasksStore", {
  state: () => ({
    errors: {},
    tasks: ref({data:[]}),
    mytasks: ref([]),
    myserver: "http://127.0.0.1:8000/api",
  }),

  getters: {
    getTaskById: (state) => (id) => {
      return state.mytasks.find((task) => task.id === id);
    },
  },

  actions: {
    /************************* getTask **************************/
    async getTask(task_id) {
      //no 1,2,3
      if (!task_id)
      {
        this.errors = { task: ["Task not selected!"] };
        return null;
      }
      //no 4.1
      
      const authStore = useAuthStore();
    
      if (true)
      /*if ((task.id==task_id)&&(
        authStore.user.user_role.role === "admin" ||
        authStore.user.id === task.manager_user_id ||
        (task.users && task.users.find((u) => u.id === authStore.user.id))
      )*/
      //)//4.1
       {
      try {//5
        //no 5.0
        const res = await fetch(`${this.myserver}/tasks/${task_id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include", // send cookies automatically
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
            console.log(5.3);
            this.errors = { task: [isDev? data?.message || " Error fetching task" : " Error fetching task"] };
            //5.4
            //no 5.5, 5.6.1, 5.5.2,
            return null;// 5.6.2
          } 
        else 
          
          /*if (data !== null && !(Array.isArray(data) && data.length === 0)) 
           //5.7   
         {
        if (data.errors) {
          this.errors = data.errors;
          //console.log("errors at getting the task ", data.errors);
          return null;
          } //5.8
        else//5.9
             {
              if (data.message) {
              this.errors = { task: [data.message] };
               } //5.10
              else if (data.data) {
            //console.log({ task123: data.data[0] });
            const task=data.data[0];
            if ((task)&&(task.id==task_id)&&(
        authStore.user.user_role.role === "admin" ||
        authStore.user.id === task.manager_user_id ||
        (task.users && task.users.find((u) => u.id === authStore.user.id))
            ))
           { return task;}
           else
           {
            this.errors = { task: ["Task not found. Not authorized!"] };
            return null;
           }
           
          } else {
            this.errors = { task: ["Task not found."] };
            return null;
          }
               //5.11
        }//end 5.9
      } //end 5.7 
      else {
            this.errors = { task: ["No tasks found.!"] };
            return null;
          }//5.12
          */
         {
            if (data!=null && data.data!= null && !(Array.isArray(data.data) && data.data.length === 0))
           {
            //console.log({ task123: data.data[0] });
            const task=data.data[0];
            if ((task)&&(task.id==task_id)&&(
                 authStore.user.user_role.role === "admin" ||
                 authStore.user.id === task.manager_user_id ||
                (task.users && task.users.find((u) => u.id === authStore.user.id))
            ))
             { return task;}
           else
             {
               this.errors = { task: ["Task not fetched. Not authorized!"] };
               return null;
             }
          } 
           
           else {
            this.errors = { task: [ (isDev? (data.message? data.message: "Task not fetched") : "Task not fetched")] };
            //console.log(5.12);
             }//5.12
         }//res.ok=true
        } //end try 5
        catch (error)//6
        {
          console.log(6);
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
          return null;
        } 
        finally//7
        {
          
          console.log("end get task");
        }
      }
      /* else //4.2
      {
        this.errors = { task: ["Not authorized to fetch this task!"] };
        return null;
      }*/

      ////////////////////////
      
    },

    /************************* editTask ************************/  
    
    //note: res.not ok and res.ok to modify --- am ramas la editTask!!!

    async editTask(task_id, task_manager_user_id, formData) {
      //no 1,2,3
      if (!task_id)
      {
        this.errors = { task: ["Task not identified!"] };
        return;
      }
      if (!task_manager_user_id)
      {
        this.errors = { task: ["Task manager not identified!"] };
        return;
      }
      if (!formData.title)
      {
        this.errors = { task: ["Task's title cannot be empty!"] };
        return;
      }
      /*if (!formData.is_done) // null=opened so no error here (this part has been comented)
      {
        this.errors = { task: ["Task's status not identified!"] };
        return;
      }*/
      const authStore = useAuthStore();
      if (authStore.user.id === task_manager_user_id) {//4.1
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasks/${task_id}`, {
            method: "PUT",
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

          if (!res.ok) //5.3
          {
             this.errors = isDev? { task: [( data?.message || "") || " Error at updating task"] }
                               : {task: ["Error at task update"]};
          
           // this.errors = { task: [(data?.message||"") || " Error updating task"] };
            //5.4
            if (res.status === 422) {
              //this.errors = data.errors || { task: ["Error at update"] };
              if (isDev)
              {
              
              this.errors = {task: data.errors.title || data.errors.is_done || data.errors.user_id|| data.errors.description || ["Error at task update"] };
              console.log(5.5);
              }
              else
                if (data?.errors)
                this.errors= {
                    task: data.errors.title ? ["Please check your edited task"] : ( data.errors.is_done ? ["Please check your task's new status"] :
                       (data.errors.description? ["Please check your task's description"]:["Error at task update"])),
                     //task_id or task ???
                  };
                else this.errors={ task: ["Error at task's update"] };
                       
            }//end 5.4
           
            //return false;//5.6.2
          
          } else 
            /*if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
           {
             if (data.errors) {
              this.errors = data.errors;
              }//5.8
             else //5.9
              {
              if (!data.data.id) {
                console.log('data=',data);
                this.errors = { task: ["Error at update! Incorrect data fetched!"] };
              } //5.10.b
              else {
                this.errors={};
                this.router.push({ name: "tasks" }); //success
              }//5.11
            }//end 5.9
          }//end 5.7
           else {
            this.errors = { task: ["Error at task update! No data fetched!"] };
          }//5.12
          */
         {
          if (data?.data?.id) 
               {
                this.errors={};
                this.router.push({ name: "tasks" }); //success
              }//5.11
          else {
              this.errors = { task: [((isDev)? /*"Status: "+res.status +*/ (data.message? " "+ data.message: "Task not modified") : "Task not modified")] };
            //return;//false
          }

         }
        } catch (error)//6
       {
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message: "")] };
        } finally //7
        {
          console.log("end edit task");
        }
      } else {
        this.errors = { task: ["Not authorized to edit this task!"] };
      }//4.2
           
    }, 

    /************************* deleteTask *********************/
    async deleteTask(task) {
      //no 1,2,3
      if (!task)
      {
        this.errors = { form: ["Task not identified!"] };
        return false;
      }
      const authStore = useAuthStore();
      if (
        authStore.user.user_role.role === "admin" ||
        authStore.user.id === task.manager_user_id
      ) {//4.1
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasks/${task.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
               "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            credentials: "include",
          });//5.1

          if (handle419(res,this,'form')) return false;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }

          if (!res.ok) {//5.3
            this.errors = { form: [(isDev? (data?.message || "Error at task delete"): "Error deleting task")] };
            //5.4
            //no 5.5, 5.6.1, 5.5.2, 5.6.2
            //console.log(1, data.message);
          } else 
            /*
            if (data !== null && !(Array.isArray(data) && data.length === 0)) 
            //5.7
            {
            if (data.errors) {
              this.errors = data.errors;
              //console.log(2);
            }//5.8 
            else {//5.9
              //no 5.10
              this.errors = {};
              const taskIndex = this.mytasks.findIndex((t) => t.id === task.id);
            if (taskIndex !== -1) this.mytasks.splice(taskIndex, 1);

            const taskIndex2 = this.tasks.data.findIndex((t) => t.id === task.id);
            if (taskIndex2 !== -1) this.tasks.data.splice(taskIndex2, 1);
         
             // console.log("Successfully deleted task:", data.message || "");
             // console.log(3);
              return true;
            //5.11
          }//5.9 
        }//5.7
        else {
            this.errors = { form: ["Error at task delete! No data fetched!"] };
           // console.log(4);
          }//5.12
          */
         {//5.9
              //no 5.10
              this.errors = {};
              const taskIndex = this.mytasks.findIndex((t) => t.id === task.id);
            if (taskIndex !== -1) this.mytasks.splice(taskIndex, 1);

            const taskIndex2 = this.tasks.data.findIndex((t) => t.id === task.id);
            if (taskIndex2 !== -1) this.tasks.data.splice(taskIndex2, 1);
         
             // console.log("Successfully deleted task:", data.message || "");
             // console.log(3);
              return true;
            //5.11
          }//5.9 
        }//5
         catch (error) {//6
          this.errors = { form: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
          //console.log(5);
        } finally {//7
          console.log("end delete task");
        }
      } else {//4.2
        this.errors = { form: ["Not authorized! You cannot delete this task!"] };
        //console.log('6');
      }

      return false;//on any error if not returned true already; 
      //new step 8

    },

    /************************* changeTaskStatus ***************/
    async changeTaskStatus(task, mystatus) {
      if (!task)
      {
        this.errors = { task: ["Task not identified!"] };
        return;
      }

      if ((mystatus!==true)&&(mystatus!==false))
      {
        this.errors = { task: ["New status not identified!"] };
        //console.log("not identified");
        return;
      }
      const authStore = useAuthStore();
      //no 1

      const ok = ref(false);//2

      if (
        authStore.user.user_role.role === "user" &&
        authStore.user.id === task.manager_user_id
      ) {
        ok.value = true;
      }//3

      if (task.users) {
        task.users.forEach((teamUser) => {
          if (
            authStore.user.user_role.role === "user" &&
            authStore.user.id === teamUser.id
          ) {
            ok.value = true;
          }
        });
      }//3b

      if (ok.value === true) {//4.1
        try {//5
          //no 5.0
          const res = await fetch(
            `${this.myserver}/tasks/${task.id}/updateStatus`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                 "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
              },
              body: JSON.stringify({ is_done: mystatus }),
              credentials: "include",
            }
          );//5.1

          if (handle419(res,this,'task')) return;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }

           if (!res.ok) //5.3
          {
            this.errors = { task: [(isDev? (data?.message||"") || " Error updating status of task" : "Error updating status of task")] };
           //5.4
            if (res.status === 422) {
               if (isDev)
              { 
              this.errors = {task: data.errors.is_done || ["Error at task's status update"] };
              console.log(5.5);
              }
              /*....*/
                else this.errors={ task: ["Error at task's status update"] };
                       
            }//end 5.4
            
            //return false;//5.6.2
            
          } else
            /* if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
          //5.7 
          {
          if (data.errors) {
            this.errors = data.errors;
            //console.log(data.errors);
          }//5.8
           if (!data.data.id||!data.data.is_done) {
                this.errors = { task: ["Error at task's status update! Incorrect data fetched!"] };
              } //5.10.b
            else {
                this.errors={};
                const xstatus = data.data.is_done;

                const taskIndex = this.mytasks.findIndex((t) => t.id === data.data.id);
                if (taskIndex !== -1) this.mytasks[taskIndex].is_done = xstatus;

                 const taskIndex2 = this.tasks.data.findIndex((t) => t.id === data.data.id);
                 if (taskIndex2 !== -1) this.tasks.data[taskIndex2].is_done = xstatus;
                //success
                //5.11
             }//end 5.9
           }//end 5.7
          else {
            this.errors = { task: ["Error at task's status update! No data fetched!"] };
          }//5.12
          */
         {
           if (data?.data?.id&&((data?.data?.is_done==true)||(data?.data?.is_done==false))) 
            //data.data.is_done can be null meaning Opened so the condition above is corect not data?.data?.is_done which excludes null)
               {
                //success
                 this.errors={};
                const xstatus = data.data.is_done;

                const taskIndex = this.mytasks.findIndex((t) => t.id === data.data.id);
                if (taskIndex !== -1) this.mytasks[taskIndex].is_done = xstatus;

                 const taskIndex2 = this.tasks.data.findIndex((t) => t.id === data.data.id);
                 if (taskIndex2 !== -1) this.tasks.data[taskIndex2].is_done = xstatus;
                //success
                
              }//5.11
          else {
              //console.log("data=",data);
              this.errors = { task: [((isDev)? "Status: "+res.status + (data.message? " "+ data.message: "Task's status not modified!") : "Task's status not modified")] };
            //return;//false
          }
         }
        } catch (error)//6
       {
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
        } finally //7
        {
          console.log("end change status of task");
        }
      } else {
        this.errors = { task: ["Not authorized to change the status for this task!"] };
      }//4.2     
          ///////////////////////////
    },

    /************************* createTask *********************/     
    async createTask(formData2) {
      if (!formData2.title) //is_done null means opened so it's not tested here
      {
        this.errors = { task: ["New task cannot be empty!"] };
        return;
      }
      const authStore = useAuthStore();
      //no 1
      const ok = ref(false);//2

      if (authStore.user.user_role.role === "user") {ok.value = true;}//3

      if (ok.value === true) {//4.1
        try {//5
          //no 5.0
          const res = await fetch(`${this.myserver}/tasks`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
               "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
            },
            body: JSON.stringify(formData2),
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
            this.errors = { task: [(isDev? (data?.message || "") || " Failed to create task" :"Error at task create")] };
            //5.4.v2 // modified with data?.message
          
            //5.4
            if (res.status === 422) {
             
              if (isDev)
              { 
              this.errors = {task: data.errors.title || data.errors.is_done || data.errors.user_id||data.errors.description || ["Error at task create"] };
              console.log(5.5);
              }
              else
                if (data?.errors)
                this.errors= {
                    task: data.errors.title ? ["Please check your task"] : ( data.errors.is_done ? ["Please check your task's status"] : 
                      (data.errors.description ? ["Please check your task's description"]:["Error at task create"])),
                     //task_id or task ???
                  };
                else this.errors={ task: ["Error at task's creation"] };
                       
            }//end 5.4
           
            //return false;//5.6.2
            //////////////////////////
            if (res.status === 422) //5.5
            {
              this.errors = data.errors || { task: ["Error at adding the task"] };
            }//5.6.1
            
            //no 5.6.2
          } 
          else 
            /*if (data !== null && !(Array.isArray(data) && data.length === 0))//5.7
          {//5.7
          
          if (data.errors) {
            this.errors = data.errors;
          }//5.8

          else //5.9
              {
              if (!data.data.id) {
                this.errors = { task: ["Error at create! Incorrect data fetched!"] };
              } //5.10.b
              else {
                this.errors={};
                this.router.push({ name: "tasks" }); //success
              }//5.11
            }//end 5.9
          }//end 5.7

          else {
            this.errors = { task: ["Error at create task! No data fetched!"] };
          }//5.12
          */
         if (data.data.id)
          {
                this.errors={};
                this.router.push({ name: "tasks" }); //success
          }//5.11
          else 
          {
            this.errors = { task: [((isDev)? /*"Status: "+res.status +*/ (data.message? " "+ data.message: "Task not created") : "Task not created")] };
            return false;
           }//end 5.12 else
          
        } catch (error)//6
       {
          this.errors = { task: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
        } finally //7
        {
          console.log("end create Task");
        }
      } else {
        this.errors = { task: ["Not authorized to create tasks!"] };
      }//4.2

          ///////////////////////////////////
         
    },

    /************************* getTasks ***************/
    async getTasks(currentPage, filteredStatus) {
      //currentPage validation with error messages in form field -- not needed
      this.tasks.data=[];
      this.mytasks=[];
      console.log('initial=',filteredStatus);
      if ((filteredStatus!="opened")&&(filteredStatus!="finished"))
      {
        
        filteredStatus="all";
        
      }
      console.log('final=',filteredStatus);
      //all have rights no 1,2,3,4.1, 4.2
      try {//5
        //no 5.0
        let res;
        if (filteredStatus=="all")
        {

        res = await fetch(`${this.myserver}/tasks?page=${currentPage}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include",
        });//5.1
          console.log("res all");
         }
         else if ((filteredStatus=="opened")||(filteredStatus=="finished"))
         {
             res = await fetch(`${this.myserver}/tasks?status=${filteredStatus}&page=${currentPage}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include",
        });//5.1
         }
         else 
         {
           this.errors={'form':["Error in finding the tasks. See filtered status."]};
           return;
         }
        console.log(res);
        if (handle419(res,this,'form')) return;//5.1.b

          //const data = await res.json();//5.2
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }

        if (!res.ok)//5.3
         {
            this.errors = { form: [(isDev? data?.message || "Error fetching tasks for this page": "Error at fetching the tasks")] };
            //5.4
            //no 5.5, 5.6.1, 5.6.2
          } 
        else
          /* if (data !== null && !(Array.isArray(data) && data.length === 0))
          //5.7
          {
            if (data.errors) {
              this.errors = data.errors;
            } //5.8
            else 
            {//5.9  
            if (data.message) {
              this.errors = { form: [data.message] };
            }//5.10
            else {
              this.errors = {};
              this.tasks = data;
              this.mytasks = data.data;
             // console.log("Successfully fetched tasks for page " + currentPage);
            }//5.11
          }//5.9
        }//5.7 
          else {
            this.errors = { form: ["No tasks fetched for this page!"] };
          }//5.12
          */
         {
         if (data!=null && data.data!= null && !(Array.isArray(data.data) && data.data.length === 0))         
         {
             this.errors = {};
             this.tasks = data;
             this.mytasks = data.data;
             
         }
         else {
            //this.errors = { form: ["No tasks fetched for this page!"] };
            this.errors = { form: [ (isDev? (data.message? data.message: "No tasks fetched for this page") : "No tasks fetched for this page")] };
            
          }//5.12
         }
        }//5
         catch (error) {//6
          this.errors = { form: ["Network error or server is unreachable. " + (isDev? error.message:"")] };
        } finally {//7
          console.log("end get tasks");
        }

      //no 4.2  
    
    },
  },
});
