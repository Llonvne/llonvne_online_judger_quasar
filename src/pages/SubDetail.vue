<template>
  <div class="row">
    <div class="col-1">1</div>
    <div v-if="submission != null" class="col-grow" style="padding-top: 2em">
      <div>
        <div class="text-h6">
          #{{ subId }} | {{ submission.user }}'s solution for [Gym-102770A]
          [Problem A]
        </div>
        <div class="text-h4">Your Solution:</div>
        <q-input disable v-model="submission.code" filled type="textarea" />
      </div>

      <div class="text-h4">Result: {{ submission.ojResult }}</div>
    </div>
    <div class="col-1">1</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';

export default defineComponent({
  setup() {
    const subId = useRoute().query.id;
    const submission = ref(null);
    return { subId, submission };
  },
  mounted() {
    api
      .get(`http://localhost:9003/api/submissions/${this.subId}`)
      .then((data) => {
        console.log(data.data);
        this.submission = data.data;
      });
  },
});
</script>

<style scoped lang="sass"></style>
