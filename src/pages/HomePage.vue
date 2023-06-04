<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-8 overflow-hidden">
        <h2>Llonvne Online Judge</h2>
        <h6>A online-judge system based on Kotlin and Vue</h6>

        <p>@Overview</p>
        <ul>
          <li>
            Support multiple versions of multiple programming languages for
            judging
          </li>
          <li>
            Super easy multi-judger support, customizable judger support for
            questions, contests
          </li>
          <li>Out-of-the-box Contest support</li>
          <li>
            Simple question creation, support for providing Input/Output files
            or customizable C/Python/Kotlin scripts to perform judging
          </li>
          <li>Simple and beautiful Github style UI</li>
        </ul>

        <p>@Modules</p>
        <ul>
          <li>Frontend:LlonvneOnlineJudgeQuasar</li>
          <li>Backend:LlonvneJudgerServerOnKotlin</li>
          <li>JudgeServer:LlonvneJudgerServer</li>
        </ul>
        <p>@Issues</p>
        <p>
          I have to admit that this project is only suitable for learning
          purposes,
          <br />
          its performance and security is terrible (even if we run all user code
          only on Docker),
          <br />
          so please do not deploy this project directly to production.
          <br />
          Please keep the network latency between the back-end and the database
          server as low as possible (if possible, place them on the same
          server). Due to the complexity of the entity relationships, the
          back-end may need to perform quite a few database operations quickly,
          and a network database may seriously affect the response time
        </p>
      </div>
      <div class="col-3"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserStore } from 'stores/user';

export default defineComponent({
  name: 'HomePage',
  setup() {
    return {
      userStore: UserStore(),
    };
  },
});
</script>
