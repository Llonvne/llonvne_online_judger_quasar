<template>
  <div class="row">
    <q-dialog v-model="submitDialog" full-height full-width>
      <q-card class="column full-height" style="width: 700px">
        <q-card-section>
          <div class="text-h6">
            Submit for <strong>{{ problem?.problemName }}</strong>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <div class="text-h6">Problem: {{ problem?.problemName }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">
            Submitter:
            {{ this.userStore.loginUser?.username ?? 'Not logged in' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Language:</div>
          <q-select
            v-model="chosenLanguage"
            :options="displayable()"
            label="Choose your solution language"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Solution:</div>
          <div class="q-pa-md" style="max-width: 100%; max-height: 400px">
            <q-input v-model="solution" filled type="textarea" />
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Submit" @click="submitSubmission" v-close-popup />
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="col-1"></div>
    <div class="col-3">
      <div style="margin-top: 3.5em; padding-left: 3em">
        <q-btn
          style="background: #0275d8; color: white"
          label="Submit"
          @click="submitDialog = true"
          :disable="this.userStore.loginUser == null"
          icon="send"
        />&nbsp;
        <q-btn
          style="background: deeppink; color: white; margin-top: 1em"
          :disable="this.userStore.loginUser == null"
          @click="toggleFavorite"
        >
          <div v-if="isUserFavorite">
            <q-icon name="favorite" />
            <span>UnFavorite</span>
          </div>
          <div v-else>
            <q-icon name="favorite_border" />
            <span>Favorite</span>
          </div>
        </q-btn>
        <q-btn
          :disable="!isUserAbleUpdate()"
          style="margin-top: 1em"
          @click="
            $router.push({
              name: 'updateProblem',
              query: { problemId: problem?.problemId },
            })
          "
          >Update
        </q-btn>
        <br />
        <br />
        <br />
        <p><strong>Time Limit</strong> :&nbsp;{{ problem?.timeLimit }} ms</p>
        <p>
          <strong>Memory Limit</strong> :&nbsp;{{ problem?.memoryLimit }} KB
        </p>
        <p><strong>Problem Source</strong> :&nbsp;{{ problem?.source }}</p>
        <p><strong>Problem Author</strong> :&nbsp;{{ problem?.author }}</p>
        <p><strong>Solved</strong> :&nbsp; {{ problem?.solved }}</p>
        <q-badge color="primary" v-for="tag in problem?.tags ?? []" :key="tag">
          {{ tag }} &nbsp;
        </q-badge>
      </div>
    </div>
    <div class="col-grow">
      <h3 style="display: inline-block">{{ problem?.problemName }}</h3>
      <div>
        Created by <a href="">{{ problem?.author }}</a>
      </div>
      <q-layout
        view="lhh LpR lff"
        container
        style="height: 200px; margin-top: 1.5em"
        class="shadow-2 rounded-borders"
      >
        <q-header class="bg-black">
          <q-toolbar>
            <q-toolbar-title>&nbsp; Problem Description</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            {{ problem?.context }}
          </q-page>
        </q-page-container>
      </q-layout>

      <q-layout
        view="lhh LpR lff"
        container
        style="height: 300px; margin-top: 1.5em"
        class="shadow-2 rounded-borders"
      >
        <q-header class="bg-black">
          <q-toolbar>
            <q-toolbar-title>&nbsp; Testcases</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <div v-for="(testcase, index) in problem?.testCases" :key="index">
              <strong>Testcase {{ index + 1 }}</strong
              ><br />
              <strong>Input:</strong><br />
              <code>{{ testcase.input }}</code>
              <br />
              <strong>Output:</strong><br />
              <code>{{ testcase.output }}</code>
              <br />
              <br />
            </div>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
    <div class="col-1"></div>
    <q-inner-loading
      :showing="problem == null"
      label="Please wait..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { UserStore } from 'stores/user';
import { Language } from 'src/entities/Submission';

class TestCase {
  constructor(public id: number, public input: string, public output: string) {}
}

class Problem {
  constructor(
    public problemId: number,
    public problemName: string,
    public context: string,
    public timeLimit: number,
    public memoryLimit: number,
    public source: string,
    public author: string,
    public solved: number,
    public tags: string[],
    public supportLanguages: Language[],
    public testCases: TestCase[]
  ) {}
}

export default defineComponent({
  name: 'ProblemDetail',
  methods: { useRouter },
  components: {},
  setup() {
    const curProblem = ref<Problem | null>(null);
    const submitDialog = ref<boolean>(false);
    const chosenLanguage = ref<string | null>(null);
    const solution = ref<string | null>(null);
    const userStore = UserStore();
    const isUserFavorite = ref<boolean>(false);

    onMounted(() => {
      api
        .get(`problems/${useRoute().query.problemId}?projection=all`)
        .then((data) => {
          curProblem.value = data.data as Problem | null;
        })
        .then(() => {
          if (userStore.loginUser != null) {
            userStore.isFavorite(curProblem.value?.problemId ?? -1, (resp) => {
              isUserFavorite.value = resp;
            });
          }
        });
    });

    const displayable = () => {
      return curProblem?.value?.supportLanguages?.map((language) => {
        return language.languageName + ' ' + language.languageVersion;
      });
    };

    const submitSubmission = () => {
      api
        .post('http://localhost:9003/judge', {
          problemId: curProblem.value?.problemId,
          languageId: curProblem.value?.supportLanguages?.find(
            (currentValue) => {
              return (
                currentValue?.languageName ==
                  chosenLanguage?.value?.split(' ')[0] &&
                currentValue?.languageVersion ==
                  chosenLanguage?.value?.split(' ')[1]
              );
            }
          )?.id,
          judger: null,
          rawCode: btoa(solution?.value ?? ''),
          userId: userStore.loginUser?.id,
        })
        .then((res) => {
          console.log(res);
        });
    };

    const toggleFavorite = () => {
      if (isUserFavorite.value) {
        userStore.deleteFavorite(curProblem.value?.problemId ?? -1, (resp) => {
          isUserFavorite.value = resp;
        });
      } else {
        userStore.addFavorite(curProblem.value?.problemId ?? -1, (resp) => {
          isUserFavorite.value = resp;
        });
      }
    };

    const isUserAbleUpdate = () => {
      if (userStore.loginUser == null) {
        return false;
      } else if (userStore.loginUser.role == 'Administrator') {
        return true;
      } else {
        return curProblem.value?.author == userStore.loginUser.username;
      }
    };

    return {
      problem: curProblem,
      submitDialog,
      chosenLanguage,
      solution,
      userStore,
      displayable,
      submitSubmission,
      isUserFavorite,
      toggleFavorite,
      isUserAbleUpdate,
    };
  },
});
</script>
