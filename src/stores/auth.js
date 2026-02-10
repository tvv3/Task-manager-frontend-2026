import { defineStore } from "pinia";
//import { ref } from "vue";
import {handle419} from "@/assets/functions"

const isDev =  import.meta.env.VITE_APP_ENV? (import.meta.env.VITE_APP_ENV != 'production') : false; 

export const useAuthStore = defineStore("AuthStore", {
  state: () => ({
    user: null,
    errors: {},
    isLoggedIn: false,
    successMessage: null,
    apiBase: "http://127.0.0.1:8000/api",
    apiBase2: "http://127.0.0.1:8000",
  }),

  actions: {
    
    // Fetch logged-in user
    
   async  getUser() {
      this.successMessage=null;
      //console.log("Start getUser 123");
      try{
      const res1= await  fetch(`${this.apiBase2}/sanctum/csrf-cookie`,
       { 
        credentials: "include",
       });
        if (!res1.ok) throw new Error("Failed to get CSRF token");
   
       /*.then(
        async (value)=>{*/

        //try{//5
        const res = await fetch(`${this.apiBase}/user`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include", // important for session
        });//5.1

         //no need for handle419 here !!!
                 
        //const data = await res.json();//5.2
         const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }
        //if (data) console.log(data);
        if ((res.ok)&&(data?.user)) {
          //console.log("data get user=");
          this.user = data.user;
          this.errors = {};
        } else {
          this.user = null;
          console.log("1");
         // console.log("1 error getting the user ");
          this.errors= {};
        }
      } catch (err) {
        this.errors= {};
        this.user = null;
        console.log("2");
        //console.log("2 get user error");
        
      }
     
    },

    // Logout user
    async logout() {
      this.successMessage = null;
      this.errors = {};
      //this.isLoggedIn=false;
      
      if (this.router) {
            this.router.push({ name: "home" });//mandatory
             }
      try {
        // POST logout
        //const token = this.getCookie("XSRF-TOKEN");
        const res = await fetch(`${this.apiBase}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include",
        });

        if (handle419(res,this,'email')) return;

        if (res.ok) {
          this.user=null;
          this.successMessage = "Logged out successfully!";
          this.isLoggedIn=false;
        } else {
          //const data = await res.json();//5.2
          // 5.2 Parse JSON if content-type is JSON
          const contentType = res.headers.get('content-type') || '';
          let data = null;
          if (contentType.includes('application/json')) {
              data = await res.json();
           }
          this.errors = { logout: isDev? [data?.message || data?.errors?.email[0] || "Logout failed"] : ["Logout failed"] };
        }
      } catch (err) {
        this.errors = { logout: ["Network error: " + (isDev? err.message: '')] };
      }
    },

    // Register user
    async registerUser(formData) {
      this.successMessage = null;
      this.errors = {};

      try {//5.0
       // await fetch(`${this.apiBase}/sanctum/csrf-cookie`, { credentials: "include" });
        //await this.getUser();
        const token = this.getCookie("XSRF-TOKEN");//5.a2
        const res = await fetch(`${this.apiBase}/registerUser`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN"),
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });//5.1

        //const data = await res.json();//5.2
        if (handle419(res,this,'form')) return;
        // 5.2 Parse JSON if content-type is JSON
        const contentType = res.headers.get('content-type') || '';
        let data = null;
        if (contentType.includes('application/json')) {
            data = await res.json();
        }

        if (!res.ok) {
          if (isDev)
          {
          if (data?.errors?.form[0])
          this.errors = { form: [data?.errors?.form[0]|| "Registration failed"]} ;
          else 
              if (data?.errors) {this.errors= data.errors ;}
                 else this.errors= {form: [data?.message|| "Registration failed"]};
           } 
          else this.errors={form: ["Error at registrating user"]} ;  
                            
          //console.log('register:1', data);
          
        } else {
          this.errors = {};
          this.successMessage = "User registered successfully!";
          //console.log('register:2');
          //await this.getUser();
        }
      } catch (err) {
        this.errors = { form: ["Network error: " + (isDev? err.message : '')] };
        //console.log('register:3');
      }
    },

    
   //final version 2 feb 2026
  async authenticate(formData) {
  this.successMessage = null;
  this.errors = {};
  this.user = null;
  this.isLoggedIn=false;
  

  // Minimal validation
  if (!formData.email || !formData.password) {
    this.errors = { email: ["Email and password are required."] };
    this.user = null;
    return;
  }

  try { //5
    
    // 1️ Get CSRF cookie (Laravel Sanctum)
    const res1 = await fetch(`${this.apiBase2}/sanctum/csrf-cookie`, { credentials: "include" });

    if (!res1.ok) throw new Error("Failed to get CSRF token");
    //console.log("0");

    // 2️ Send POST to /login
    const res = await fetch(`${this.apiBase2}/login`, { //5.1
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": this.getCookie("XSRF-TOKEN") || ""
      },
      credentials: "include",
      body: JSON.stringify(formData)
    });

    //console.log("res");
    if (handle419(res,this,'email')) return;

    // 5.2 Parse JSON if content-type is JSON
    const contentType = res.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    }

   // const isDev = process.env.APP_ENV? process.env.APP_ENV === 'debug': false; // define once for production/dev messages

    //5.3 Handle server errors (status >= 400)
    if (!res.ok) {
      if (data && data.errors) { //5.8
        // Laravel validation errors (email/password)
        this.errors = isDev
          ? data.errors // dev: full Laravel messages
          : {
              email: data.errors.email ? ["Please check your email."] : [data.errors.password ? "": "Other validation error"],
              password: data.errors.password ? ["Please check your password."] : []
            };
        this.user = null;
        
      } else {
      this.errors = { 
        email: [isDev
          ? (data?.message || data?.errors?.email?.[0] || `Login failed: ${res.statusText}`)
          : "Login failed."
        ]
      };
      this.user = null;
    }//end else

    } 
    else //res.ok=true --- status 200-299 success
    { //deleted 5.7,5.8,5.9
       if (data?.user) { //5.11
          // Login successful
          this.errors = {};
          this.user = data.user;
          this.successMessage = "Successfully logged in!";
          this.isLoggedIn=true;
          // Redirect to tasks
          if (this.router) {
            this.router.push({ name: "tasks" });
          }

        } //end 5.11

      else
      { // fallback 5.10
          this.errors = { 
            email: [
              isDev 
                ? data?.message || "Error at login"
                : "Login failed. Please try again."
            ]
          };
          this.user = null;
        }//end 5.10
    
    } //end else res.ok=true
  }// end try
    catch (err) { //6
    this.errors = {
      email: [
        !isDev
          ? "Unable to connect to the server. Please try again later."
          : "Network error: " + err.message
      ]
    };
    this.user = null;
  }
},


    // Change password (only for admin)
    async changePassword(formData) {
      this.successMessage = null;
      this.errors = {};

      try {//5
        //await fetch(`${this.apiBase}/sanctum/csrf-cookie`, { credentials: "include" });
        const token = this.getCookie("XSRF-TOKEN");//5a2
        const res = await fetch(`${this.apiBase}/changePassword`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
             "X-XSRF-TOKEN": token,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });//5.1

       if  (handle419(res,this,'email')) return;

        //const data = await res.json();//5.2
        const contentType = res.headers.get('content-type') || '';
        let data = null;
        if (contentType.includes('application/json')) {
            data = await res.json();
          }

        if (!res.ok) {//5.3
         // this.errors = isDev? (data?.errors || { email: [data?.message || "Password change failed"] } ) : { email: ["Error at changing password"] };
          if (isDev)
          {
          if (data?.errors?.form[0])//we don't have anything in back at form level only at email but maybe for the future !!!

            this.errors = { form: [data?.errors?.form[0]|| "Password change failed"]} ;
          else 
              if (data?.errors) {this.errors= data.errors ;}
                 else this.errors= {form: [data?.message|| "Password change failed"]};
           } 
          else this.errors={form: ["Error at changing password"]} ;  
            
        } else {
          this.errors = {};
          this.successMessage = "Password changed successfully!";
        }
      } catch (err) {
        this.errors = { email: ["Network error: " + (isDev? err.message : '')] };
      }
    },
  },

  persist: {
    paths: ['isLoggedIn'] // persisted hint
  }
  
});
