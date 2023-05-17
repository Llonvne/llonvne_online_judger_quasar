<template>
  <div class="row" style="padding-top: 1em">
    <div class="col-1"></div>
    <div class="col-3">
      <div class="text-h4">Login</div>
      <q-input label="username" v-model="username"></q-input>
      <q-input label="password" type="password" v-model="password"></q-input>
      <q-btn style="margin-top: 1em" @click="login">login</q-btn>
      &nbsp;&nbsp;
      <q-btn style="margin-top: 1em">Sign up now!</q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios';
import { UserStore } from 'stores/example-store';

export default defineComponent({
  setup() {
    const username = ref(null);
    const password = ref(null);
    const userStore = UserStore();
    return {
      username,
      password,
      userStore,
    };
  },
  methods: {
    login() {
      api
        .post('http://localhost:9003/signin', {
          username: this.username,
          password: this.password,
        })
        .then((data) => {
          this.userStore.loginUser = data.data;
        });
    },
  },
});
</script>

<style scoped lang="css"></style>
