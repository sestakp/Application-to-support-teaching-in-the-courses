import store from "@/store";
import userMutationTypes from "@/store/User/userMutationTypes";
import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { getCookie } from "./cookies";
import isStringSet from "./isStrSet";

export default function permitLoggedUsersOnly(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext){
    //enable only when api is specified
    
    
    // todo remove after api development is done
    //next();

    if (process.env.VUE_APP_API_URL != undefined) {
       // Check if the user is logged in
      if (store.getters['user/isLogged']) {
        // User is logged in, allow access to /courses
        next();
      } else {
        // User is not logged in, redirect to /login
        const cookie = getCookie("currentUser");
        let user = undefined;
        if(isStringSet(cookie) && cookie != undefined){
            user = JSON.parse(cookie);
        }
        if(user){
          store.dispatch('setCurrentUserAction', user);
          next();
        }

        next('/login');
      }
    }
    else{
      next();
    }
  }

