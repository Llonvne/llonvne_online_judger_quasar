<template>
  <div>
    <q-page padding>
      <div class="text-h4 text-center q-mb-lg">Add New Problem</div>

      <div class="text-h6">Problem Name:</div>
      <q-input v-model="problemName" label="type your problem name here" />
      <div class="text-h6">Problem Context</div>
      <div class="q-pa-md" style="max-width: 100%">
        <q-input v-model="problemContext" filled type="textarea" />
      </div>
      <div class="text-h6">Time Limit (ms)</div>
      <q-input v-model="timeLimit" filled />
      <div class="text-h6">Memory Limit (KB)</div>
      <q-input v-model="memoryLimit" filled />
      <div class="text-h6">Author (your account)</div>
      <q-input v-model="author" disable filled />
      <div class="text-h6">Source</div>
      <q-input v-model="source" filled />
      <div class="text-h6">Tags</div>
      <div class="q-pa-md">
        <q-select
          label="Unique values only"
          filled
          v-model="args"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          style="width: 250px"
          newValueMode="add-unique"
        />
      </div>
      <div class="text-h6">TestCases</div>
      <q-btn @click="addTestcase(testCases.length)">New TestCase</q-btn>
      <div v-for="(testcase, index) in testCases" :key="index">
        <div>
          <q-separator style="margin-top: 1em"></q-separator>
          <div>Name</div>
          <q-input v-model="testcase.name" filled />
          <div>Stdin</div>
          <q-input v-model="testcase.input" filled />
          <div>Expected</div>
          <q-input v-model="testcase.output" filled />
          <q-btn @click="deleteTestcase(index)">Delete</q-btn>
        </div>
      </div>
      <div class="text-h6">visibility</div>
      <q-select
        :options="problemVisibilityTypes"
        v-model="visibility"
      ></q-select>
      <q-select
        filled
        v-model="chosenLanguages"
        multiple
        :options="languages"
        label="Multiple"
        style="width: 250px"
        :option-label="
        (value:Language) => {
          return value.languageName + value.languageVersion;
        }
      "
      />
      <q-btn @click="submit">Submit</q-btn>
    </q-page>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { UserStore } from 'stores/example-store';
import { api } from 'boot/axios';
import { Language } from 'src/entities/Submission';

export class TestCase {
  constructor(
    public name: string,
    public input: string,
    public output: string
  ) {}
}

export default defineComponent({
  name: 'AddProblem',
  computed: {
    Language() {
      return Language;
    },
  },
  components: {},
  setup() {
    const problemName = ref<string>('');
    const problemContext = ref<string>('');
    const timeLimit = ref<number>(1000);
    const memoryLimit = ref<number>(512);
    const author = UserStore()?.loginUser?.username;
    const args = ref<string[]>([]);
    const testCases = ref<Array<TestCase>>([new TestCase('', '', '')]);
    const source = ref<string>('');
    const visibility = ref<string>('Public');
    const problemVisibilityTypes = ['Public', 'Private', 'Limited'];
    const allLanguages = ref<Language[]>([]);
    const chosenLanguages = ref<Language[]>([]);

    onMounted(() => {
      api.get('languages').then((data) => {
        allLanguages.value = data.data._embedded.languages;
      });
    });

    const createArg = (value: string) => {
      args.value.push(value);
    };

    const addTestcase = (index: number) => {
      testCases.value.push(new TestCase(`TestCase${index + 1}`, '', ''));
    };

    const deleteTestcase = (index: number) => {
      testCases.value.splice(index, 1);
    };

    const submitProblem = () => {
      api
        .post('public/problems', {
          problemName: problemName.value,
          context: problemContext.value,
          timeLimit: timeLimit.value,
          memoryLimit: memoryLimit.value,
          source: source.value,
          author: author,
          tags: args.value,
          testCases: testCases.value,
          visibility: visibility.value,
          supportLanguages: chosenLanguages.value,
        })
        .then((response) => {
          console.log('题目创建成功', response.data);
        })
        .catch((error) => {
          console.error('创建问题失败', error);
        });
    };

    return {
      problemName,
      problemContext,
      timeLimit,
      memoryLimit,
      author,
      args,
      createArg,
      testCases,
      addTestcase,
      deleteTestcase,
      source,
      submit: submitProblem,
      visibility,
      problemVisibilityTypes,
      languages: allLanguages,
      chosenLanguages,
    };
  },
});
</script>

<style scoped lang="css">
body {
  background-color: #f8f9fa;
  font-family: Arial, sans-serif;
}

div {
  margin-bottom: 10px;
}

.text-h4 {
  color: #3c4858;
}
</style>
