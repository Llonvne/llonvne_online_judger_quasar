<template>
  <h4>商品信息</h4>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  mounted() {
    api.get('http://localhost:9003/goodInfoes').then((data) => {
      console.log(data);
    });
  },
});
</script>

<style scoped lang="sass"></style>
