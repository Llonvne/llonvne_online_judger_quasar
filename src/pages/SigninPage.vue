<template>
  <div class="container">
    <div class="card">
      <div class="logo-container">
        <!--        <img class="logo" src="path-to-your-logo.png" alt="logo" />-->
        <h1 class="title">Online Judge Login</h1>
      </div>
      <q-input
        class="input-field"
        label="username"
        v-model="username"
      ></q-input>
      <q-input
        class="input-field"
        label="password"
        type="password"
        v-model="password"
      ></q-input>
      <q-btn class="submit-btn" @click="login">login</q-btn>
      <div class="signup">
        New to Our Online Judge?
        <router-link to="signup">
          <q-btn class="signup-btn">Sign up now!</q-btn>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios';
import { UserStore } from 'stores/example-store';

export default defineComponent({
  setup() {
    const username = ref('');
    const password = ref('');
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
          if (data.data.id == null) {
            alert('Login failed...');
            this.username = '';
            this.password = '';
          } else {
            this.userStore.login(data.data);
            this.$router.push('/home');
          }
        });
    },
  },
});
</script>

<style scoped lang="css">
@import url('https://fonts.googleapis.com/css?family=Lato');

body {
  background: linear-gradient(to right, #36d1dc, #5b86e5);
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.card {
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.logo {
  width: 80px;
  height: 80px;
}

.title {
  text-align: center;
  color: #24292e;
  font-size: 30px;
  font-weight: 300;
  margin: 20px 0;
}

.input-field {
  width: 100%;
  margin-bottom: 20px;
}

.submit-btn,
.signup-btn {
  width: 100%;
  margin-top: 20px;
}

.signup {
  text-align: center;
  margin-top: 20px;
}

a {
  text-decoration: none;
  color: inherit;
  cursor: inherit;
}
</style>
