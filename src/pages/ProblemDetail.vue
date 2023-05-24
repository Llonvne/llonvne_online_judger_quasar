<template>
  <div class="row">
    <q-dialog v-model="submitDialog" full-height full-width>
      <q-card class="column full-height" style="width: 700px">
        <q-card-section>
          <div class="text-h6">
            Submit for <strong>{{ problem.problemName }}</strong>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none">
          <div class="text-h6">Problem: {{ problem.problemName }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">
            Submitter:
            <q-input
              v-model="userStore.loginUser.username"
              disable
              filled
              type="standard"
            />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Language:</div>
          <q-select
            v-model="chosenLanguage"
            :options="displayables()"
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
          <q-btn
            flat
            label="Submit"
            @click="submitSubmission()"
            v-close-popup
          />
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
        />&nbsp;
        <q-btn
          style="background: deeppink; color: white"
          label="Favorite"
          @click="addFavorite"
          :disable="this.userStore.loginUser == null"
        />
        <br />
        <!--        <q-btn flat>Submit</q-btn>-->
        <!--        <q-btn flat>Submit</q-btn>-->
        <br />
        <br />
        <p><strong>Time Limit</strong> :&nbsp;{{ problem.timeLimit }} ms</p>
        <p><strong>Memory Limit</strong> :&nbsp;{{ problem.memoryLimit }} KB</p>
        <p><strong>Problem Source</strong> :&nbsp;{{ problem.source }}</p>
        <p><strong>Problem Author</strong> :&nbsp;{{ problem.author }}</p>
        <p><strong>Solved</strong> :&nbsp; {{ problem.solved }}</p>
        <q-badge color="primary" v-for="tag in problem['tags']" :key="tag">
          {{ tag }} &nbsp;
        </q-badge>
      </div>
    </div>
    <div class="col-grow">
      <h3 style="display: inline-block">{{ problem.problemName }}</h3>
      <div>
        Created by <a href="">{{ problem.author }}</a>
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
            {{ problem.context }}
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
            <div v-for="(testcase, index) in problem.testCases" :key="index">
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
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { UserStore } from 'stores/example-store';

export default defineComponent({
  name: 'ProblemDetail',
  components: {},
  setup() {
    const curProblem = ref({});
    const submitDialog = ref(false);
    const chosenLanguage = ref(null);
    const solution = ref(null);
    const userStore = UserStore();
    return {
      problem: curProblem,
      submitDialog,
      chosenLanguage,
      solution,
      userStore,
    };
  },
  mounted() {
    api.get(`${useRoute().query.problemLinks}?projection=all`).then((data) => {
      this.problem = data.data;
    });
  },
  methods: {
    addFavorite() {
      api.get('public/');
    },
    displayables() {
      return this.problem.supportLanguages.map((language) => {
        console.log(language);
        return language.languageName + ' ' + language.languageVersion;
      });
    },
    submitSubmission() {
      console.log(this.userStore.loginUser.id);
      api
        .post('http://localhost:9003/judge', {
          problemId: this.problem.problemId,
          languageId: this.problem.supportLanguages.find((currentValue) => {
            return (
              currentValue.languageName == this.chosenLanguage.split(' ')[0] &&
              currentValue.languageVersion == this.chosenLanguage.split(' ')[1]
            );
          }).id,
          judger: null,
          rawCode: btoa(this.solution),
          userId: this.userStore.loginUser.id,
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
});
</script>
