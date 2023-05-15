<template>
  <q-page class="justify-evenly  items-center ">
    <!-- row  -->
    <h2>Llonvne Online Judge</h2>
    <h6>A online-judge system based on Kotlin and Vue</h6>

    <p>@Overview</p>
    <ul>
      <li>Support multiple versions of multiple programming languages for judging</li>
      <li>Super easy multi-judger support, customizable judger support for questions, contests</li>
      <li>Out-of-the-box Contest support</li>
      <li>Simple question creation, support for providing Input/Output files or customizable C/Python/Kotlin scripts to
        perform judging
      </li>
    </ul>

    <p>@Modules</p>
    <ul>
      <li>Frontend:LlonvneOnlineJudgeQuasar</li>
      <li>Backend:LlonvneJudgerServerOnKotlin</li>
      <li>JudgeServer:LlonvneJudgerServer</li>
    </ul>
    <p>@Issues</p>
    <p>
      I have to admit that this project is only suitable for learning purposes,
      <br>
      its performance and security is terrible (even if we run all user code only on Docker),
      <br>
      so please do not deploy this project directly to production.
    </p>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HomePage',
  components: {},
  setup() {
    return {}
  }
});
</script>
