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
            :max="pageMeta.totalPages"
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { UserStore } from 'stores/example-store';

class Submission {
  id: number;
  codeLength: number;
  languageRepr: string;
  submittedTime: string;
  ojResult: string;
  problem: {
    problemName: string;
    problemId: number;
    _links: {
      testCases: { href: string };
      supportLanguages: { href: string };
      self: { href: string; templated: boolean };
    };
  };
  user: {
    username: string;
    _links: {
      solvedProblem: { href: string; templated: boolean };
      self: { href: string; templated: boolean };
    };
  };
  _links: {
    self: { href: string };
    submission: { href: string; templated: boolean };
    problem: { href: string; templated: boolean };
    language: { href: string };
    user: { href: string; templated: boolean };
  };

  constructor(data: any) {
    this.id = data.id;
    this.codeLength = data.codeLength;
    this.languageRepr = data.languageRepr;
    this.submittedTime = data.submittedTime;
    this.ojResult = data.ojResult;
    this.problem = data.problem;
    this.user = data.user;
    this._links = data._links;
  }
}

class Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;

  constructor(data: any) {
    this.size = data.size;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.number = data.number;
  }
}

export default defineComponent({
  name: 'statusPage',
  components: {},
  setup() {
    const submissions = ref<Array<Submission> | null>(null);
    const current = ref(1);
    const pageMeta = ref<Page | null>(null);
    const link = ref<string>('');
    const userStore = UserStore();
    const username = ref<string | null>(null);

    const fetchData = (username: string | null, page: number) => {
      const url = username
        ? `http://localhost:9003/api/submissions/search/statusProblem?projection=status&page=${page}&sort=submittedTime,asc&username=${username}`
        : `submissions?projection=status&page=${page}&sort=submittedTime,asc`;
      api.get(url).then((data) => {
        pageMeta.value = new Page(data.data['page']);
        submissions.value = data.data['_embedded'].submissions.map(
          (item: any) => new Submission(item)
        );
      });
    };

    onMounted(() => {
      fetchData(null, 0);
    });

    watch(current, (newCount) => {
      submissions.value = null;
      fetchData(username.value, newCount - 1);
    });

    watch(username, (newName) => {
      current.value = 0;
      fetchData(newName, current.value - 1);
    });

    const getProblemUrl = (sub: Submission) => {
      return `http://localhost:9000/#/detail?problemLinks=http://localhost:9003/api/problems/${sub.problem.problemId}`;
    };

    return {
      submissions,
      current,
      pageMeta,
      link,
      userStore,
      username,
      getProblemUrl,
    };
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
