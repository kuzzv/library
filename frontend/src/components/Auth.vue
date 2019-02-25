<template>
  <v-form>
    <v-text-field v-model="login" outline label="login" required></v-text-field>
    <v-text-field type="password" outline v-model="password" label="password" required></v-text-field>
    <v-btn color="info" @click="doLogin">login</v-btn>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      login: null,
      password: null
    };
  },
  methods: {
    doLogin() {
      this.$emit("login", {
        login: this.login,
        password: this.password,
      })
    }
  }
};
</script>
