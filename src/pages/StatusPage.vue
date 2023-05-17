<template>
  <div>
    <div class="row" style="padding-top: 1em">
      <div class="col-2"></div>
      <div class="col-grow">
        <q-markup-table separator="vertical" flat bordered>
          <thead>
            <tr>
              <th class="text-left">Username</th>
              <th class="text-right">Problem</th>
              <th class="text-right">Result</th>
              <th class="text-right">Times(ms)</th>
              <th class="text-right">Mem(MB)</th>
              <th class="text-right">Length</th>
              <th class="text-right">Language</th>
              <th class="text-right">Submit Time</th>
            </tr>
          </thead>
          <tbody v-if="inited1 && inited2">
            <tr v-for="sub in submissions" :key="sub.id">
              <td class="text-left">{{ sub.user }}</td>
              <td class="text-right">
                <a :href="getProblemUrl(sub)">
                  {{ sub.problem.problemName }}
                </a>
              </td>
              <td
                class="text-right"
                v-if="sub.ojResult == 'Accepted'"
                style="color: darkgreen"
              >
                <router-link
                  :to="{
                    path: '/sub',
                    query: {
                      id: sub.id,
                    },
                  }"
                  >{{ sub.ojResult }}
                </router-link>
              </td>
              <td
                class="text-right"
                style="color: red"
                v-if="sub.ojResult != 'Accepted'"
              >
                <router-link
                  :to="{
                    path: '/sub',
                    query: {
                      id: sub.id,
                    },
                  }"
                  >{{ sub.ojResult }}
                </router-link>
              </td>
              <td class="text-right">100</td>
              <td class="text-right">10</td>
              <td class="text-right">{{ sub.code.length }}</td>
              <td class="text-right">
                {{ sub.language.languageName }}
                {{ sub.language.languageVersion }}
              </td>
              <td class="text-right">{{ sub.submittedTime }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-inner-loading
          :showing="!inited1 || !inited2"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
      <div class="col-0.5">1</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios';
import axios from 'axios';

export default defineComponent({
  name: 'statusPage',
  components: {},
  mounted() {
    console.log('!23');
    api.get('http://localhost:9003/api/submissions?size=100').then((data) => {
      this.submissions = data.data['_embedded'].submissions;

      const problemRequests = this.submissions.map((sub) => {
        return api.get(sub['_links']['problem']['href']);
      });

      axios.all(problemRequests).then((resps) => {
        for (let i = 0; i < resps.length; i++) {
          this.submissions[i].problem = resps[i].data;
          this.inited1 = true;
        }
      });
      const languageRequests = this.submissions.map((sub) => {
        return api.get(sub['_links']['language']['href']);
      });
      axios.all(languageRequests).then((resps) => {
        for (let i = 0; i < resps.length; i++) {
          this.submissions[i].language = resps[i].data;
          this.inited2 = true;
        }
      });
    });
  },
  setup() {
    const submissions = ref(null);
    const inited1 = ref(false);
    const inited2 = ref(false);
    return { submissions, inited1, inited2 };
  },
  methods: {
    getProblemUrl(sub) {
      return `http://localhost:9000/#/detail?problemLinks=http://localhost:9003/api/problems/${sub.problem.problemId}`;
    },
  },
});
</script>
<style scoped lang="css">
router-link {
  text-decoration: none;
  color: inherit;
}

a,
a:hover,
a:active,
a:active {
  color: inherit;
}
</style>
