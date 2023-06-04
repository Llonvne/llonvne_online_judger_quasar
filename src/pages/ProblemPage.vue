<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-2">
        <div class="q-pa-md" style="max-width: 350px">
          <q-list bordered separator>
            <q-item clickable v-ripple :active="show == Show.All">
              <q-item-section @click="show = Show.All">All</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="show == Show.Accepted"
              :disable="!userStore.isLogin()"
              @click="show = Show.Accepted"
            >
              <q-item-section>
                <q-item-label>Accepted</q-item-label>
                <!--                <q-item-label caption>Caption</q-item-label>-->
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="show == Show.Attempted"
              :disable="!userStore.isLogin()"
              @click="show = Show.Attempted"
            >
              <q-item-section>
                <!--                <q-item-label overline>OVERLINE</q-item-label>-->
                <q-item-label>Attempted</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="show == Show.Favorite"
              :disable="!userStore.isLogin()"
              @click="show = Show.Favorite"
            >
              <q-item-section>
                <!--                <q-item-label overline>OVERLINE</q-item-label>-->
                <q-item-label>Favorite</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-show="isCurrentUserAllowAddProblem()">
          <div style="margin-top: 2em; margin-left: 1em">
            <q-btn to="addProblem">Add Problem</q-btn>
          </div>
        </div>
      </div>
      <div class="col-10" style="margin-top: 1em">
        <q-markup-table separator="vertical" flat bordered>
          <thead>
            <tr>
              <th class="text-left">
                <q-input square v-model="name" label="Title" />
              </th>
              <th class="text-right">
                <q-input square v-model="source" label="Source" />
              </th>
              <th class="text-right">Solved</th>
              <th class="text-right">Languages</th>
              <th class="text-right">
                <q-input square v-model="tag" label="Tags" />
              </th>
              <th class="text-right">
                <q-input square v-model="author" label="Author" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in problems" :key="problem['problemName']">
              <td class="text-left">
                <router-link
                  :to="{
                    name: 'detail',
                    query: {
                      problemId: problem['problemId'],
                    },
                  }"
                  >{{ problem['problemName'] }}
                </router-link>
              </td>
              <td class="text-right">{{ problem['source'] }}</td>
              <td class="text-right">{{ problem['solved'] }}</td>
              <td class="text-right">
                <q-badge
                  color="primary"
                  v-for="language in problem.supportLanguages"
                  :key="language.id"
                  style="margin-left: 3px"
                >
                  {{ language.languageName }} {{ language.languageVersion }}
                </q-badge>
              </td>
              <td class="text-right">
                <q-badge
                  color="primary"
                  v-for="tag in problem['tags']"
                  :key="tag"
                >
                  {{ tag }}
                </q-badge>
              </td>
              <td class="text-right">{{ problem['author'] }}</td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-inner-loading
          :showing="problems === null"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { Show } from 'src/utils/UserUtils';
import { Problem } from 'src/entities/Submission';
import { UserStore } from 'stores/example-store';

export default defineComponent({
  name: 'ProblemPage',
  computed: {
    Show() {
      return Show;
    },
  },
  setup() {
    const name = ref<string | null>(null);
    const author = ref<string | null>(null);
    const source = ref<string | null>(null);
    const tag = ref<string | null>(null);
    const problems = ref<Problem[]>([]);
    const accepted = ref<Problem[]>([]);
    const attempted = ref<Problem[]>([]);
    const favorite = ref<Problem[]>([]);
    const userStore = UserStore();
    const show = ref<Show>(Show.All);
    let origin = ref<Problem[]>([]);
    const allowAddProblem = ['Administrator', 'Creator'];

    const userFavorite = ref<number[]>([]);

    const isCurrentUserAllowAddProblem = () => {
      if (userStore.loginUser == null) {
        return false;
      } else {
        return allowAddProblem.includes(userStore.loginUser.role);
      }
    };

    const loadProblem = () => {
      return api
        .get(
          `problems/search/findProblem?problemName=${name.value ?? ''}&author=${
            author.value ?? ''
          }&source=${source.value ?? ''}&projection=problems`
        )
        .then((response) => {
          problems.value = response.data._embedded.problems;
          origin.value = response.data._embedded.problems;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    userStore.getUserFavorite((favorite) => {
      userFavorite.value = favorite;
    });

    onMounted(() => {
      // 读取当前用户数据
      if (userStore.loginUser != null) {
        api
          .get(`users/${userStore.loginUser.id}?projection=problem`)
          .then((resp) => {
            accepted.value = resp.data.solvedProblem;
            attempted.value = resp.data.attemptedProblem;
            favorite.value = resp.data.favoritesProblems;
          });
      }
      // 读取问题数据
      loadProblem();
    });

    // 当 author, name, source, tag 变化时，重新请求数据
    watch([name, author, source], () => {
      loadProblem();
    });

    // 当 showAccepted 为 true，从 problems 找出 accept 里面的题目
    watch(show, () => {
      if (show.value == Show.Accepted) {
        problems.value = origin.value.filter((problem) =>
          accepted.value.some(
            (accept) => accept.problemId === problem.problemId
          )
        );
      } else if (show.value == Show.Attempted) {
        problems.value = origin.value.filter((problem) =>
          attempted.value.some(
            (attempt) => attempt.problemId === problem.problemId
          )
        );
      } else if (show.value == Show.Favorite) {
        problems.value = origin.value.filter((problem) =>
          userFavorite.value.some((favorite) => favorite === problem.problemId)
        );
      } else {
        loadProblem();
      }
    });

    return {
      name,
      author,
      source,
      tag,
      problems,
      accepted,
      attempted,
      loadProblem,
      show,
      userStore,
      isCurrentUserAllowAddProblem,
    };
  },
});
</script>
