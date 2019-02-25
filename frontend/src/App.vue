<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Library</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="!(user.id || user.admin)">
        <v-btn v-if="!user.id" flat @click="showUserLogin = true; showAdminLogin = false">
          <span class="mr-2">Login as client</span>
        </v-btn>
        <v-btn v-if="!user.admin" flat @click="showAdminLogin = true; showUserLogin = false">
          <span class="mr-2">Login as admin</span>
        </v-btn>
      </div>
      <div v-else>
        <v-btn flat @click="logout">
          <span class="mr-2">Logout</span>
        </v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <v-alert :value="error" type="error" dismissible>{{error}}</v-alert>
      <v-container v-if="showUserLogin">
        <h2>Client login</h2>
        <Auth v-on:login="authUser"/>
      </v-container>
      <v-container v-if="showAdminLogin">
        <h2>Admin login</h2>
        <Auth v-on:login="authAdmin"/>
      </v-container>
      <v-container v-if="user.id && !user.admin">
        <Client/>
      </v-container>
      <v-container v-if="user.admin">
        <Admin/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Client from "./components/Client";
import Admin from "./components/Admin";
import Auth from "./components/Auth";

import { AUTH_USER, AUTH_ADMIN } from "./constants/graphql";

export default {
  name: "App",
  components: {
    Auth,
    Client,
    Admin
  },
  data() {
    return {
      showUserLogin: false,
      showAdminLogin: false,
      user: {},
      error: null
    };
  },
  created() {
    const token = window.localStorage.getItem("token");
    if (token) {
      this.user = JSON.parse(atob(token.split(".")[1]));
    }
  },
  methods: {
    async authUser({ login, password }) {
      try {
        const {
          data: { authUser }
        } = await this.$apollo.mutate({
          mutation: AUTH_USER,
          variables: {
            login,
            password
          }
        });
        this.showUserLogin = false;
        this.user = JSON.parse(atob(authUser.split(".")[1]));
        window.localStorage.setItem("token", authUser);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
    },
    async authAdmin({ login, password }) {
      try {
        const {
          data: { authAdmin }
        } = await this.$apollo
          .mutate({
            mutation: AUTH_ADMIN,
            variables: {
              login,
              password
            }
          })
          .catch(e => {
            this.error = e.message;
          });
        this.showAdminLogin = false;
        this.user = JSON.parse(atob(authAdmin.split(".")[1]));
        window.localStorage.setItem("token", authAdmin);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
    },
    logout() {
      this.user = {};
      window.localStorage.removeItem("token");
    }
  }
};
</script>
