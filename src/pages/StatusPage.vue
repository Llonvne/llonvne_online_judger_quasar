<template>
  <div>
    <div class="row" style="padding-top: 1em">
      <div class="col-2">
        <div class="q-pa-md" style="max-width: 250px; margin-top: 4em">
          <q-list bordered padding class="rounded-borders text-primary">
            <q-item
              clickable
              v-ripple
              :active="username === null"
              @click="username = null"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>All</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :disable="this.userStore.loginUser === null"
              :active="username === this.userStore.loginUser.username"
              @click="username = this.userStore.loginUser.username"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>Mine</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
      <div class="col-grow">
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-if="pageMeta != null"
            v-model="current"
            :max="pageMeta['totalPages']"
            direction-links
          />
        </div>
        <q-markup-table
          separator="vertical"
          flat
          bordered
          style="margin-bottom: 3em"
        >
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
          <tbody v-if="submissions != null">
            <tr v-for="sub in submissions" :key="sub.id">
              <td class="text-left">
                <div v-if="sub.user != null">{{ sub.user.username }}</div>
              </td>
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
              <td class="text-right">{{ sub.codeLength }}</td>
              <td class="text-right">
                {{ sub.languageRepr }}
              </td>
              <td class="text-right">{{ sub.submittedTime }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-inner-loading
          :showing="submissions == null"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { UserStore } from 'stores/example-store';

export default defineComponent({
  name: 'statusPage',
  components: {},
  mounted() {
    api
      .get(
        'http://localhost:9003/api/submissions/search/statusProblem?projection=status&size=20&sort=submittedTime,asc'
      )
      .then((data) => {
        this.pageMeta = data.data['page'];
        this.submissions = data.data['_embedded'].submissions;
        console.log(this.submissions);
      });
  },
  setup() {
    const submissions = ref(null);

    const current = ref(1);

    const pageMeta = ref(null);

    const link = ref('');

    const userStore = UserStore();

    const username = ref(null);

    watch(current, (newCount, oldCount) => {
      console.log(`Count changed from ${oldCount} to ${newCount}`);
      submissions.value = null;
      api
        .get(
          `submissions/search/statusProblem?projection=status&page=${
            current.value - 1
          }&username=${username.value}&sort=submittedTime,asc`
        )
        .then((data) => {
          pageMeta.value = data.data['page'];
          submissions.value = data.data['_embedded'].submissions;
          console.log(submissions);
        });
    });

    watch(username, (newName, oldName) => {
      current.value = 0;
      if (newName == null) {
        api
          .get(
            `submissions/search/statusProblem?projection=status&page=${
              current.value - 1
            }&sort=submittedTime,asc`
          )
          .then((data) => {
            pageMeta.value = data.data['page'];
            submissions.value = data.data['_embedded'].submissions;
            console.log(submissions);
          });
      } else {
      }
      api
        .get(
          `submissions/search/statusProblem?projection=status&page=${
            current.value - 1
          }&username=${newName}`
        )
        .then((data) => {
          pageMeta.value = data.data['page'];
          submissions.value = data.data['_embedded'].submissions;
          console.log(submissions);
        });
    });

    return {
      submissions,
      current,
      pageMeta,
      link,
      userStore,
      username,
    };
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
