<template>
  <q-page padding>
    Username:
    <q-input disable :model-value="username"></q-input>
    Role
    <q-input disable :model-value="role"></q-input>
    Nickname:
    <q-input v-model="nickname"></q-input>
    realname
    <q-input v-model="realname"></q-input>
    description
    <q-input v-model="description"></q-input>
    qq
    <q-input v-model="qq"></q-input>
    school
    <q-input v-model="school"></q-input>

    <q-btn @click="update">update</q-btn>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { UserLoginProjection, UserStore } from 'stores/example-store';
import { api } from 'boot/axios';

export default defineComponent({
  setup() {
    const userStore = UserStore();

    const username = ref(userStore.loginUser?.username);
    const role = ref(userStore?.loginUser?.role);
    const nickname = ref(userStore.loginUser?.nickname);
    const realname = ref(userStore.loginUser?.realname);
    const description = ref(userStore.loginUser?.description);
    const qq = ref(userStore.loginUser?.qq);
    const school = ref(userStore.loginUser?.school);

    const update = () => {
      if (userStore.loginUser?.id != null) {
        api
          .patch(`users/${userStore.loginUser.id}`, {
            nickname: nickname.value,
            realname: realname.value,
            description: description.value,
            qq: qq.value,
            school: school.value,
          })
          .then((res) => {
            alert('更新成功');
            userStore.login(res.data as UserLoginProjection);
          });
      } else {
        alert('你还未登入');
      }
    };

    return {
      userStore,
      update,
      username,
      role,
      nickname,
      realname,
      description,
      qq,
      school,
    };
  },
});
</script>

<style scoped lang="css"></style>
