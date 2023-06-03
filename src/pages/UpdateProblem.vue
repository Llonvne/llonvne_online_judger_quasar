<template>
  <q-page padding>
    <div class="text-h6">Problem Name:</div>
    <q-input v-model="problemName" />
    <div class="text-h6">Problem Context</div>
    <div class="q-pa-md" style="max-width: 100%">
      <q-input v-model="context" filled type="textarea" />
    </div>
    <div class="text-h6">Time Limit (ms)</div>
    <q-input v-model="timeLimit" filled />
    <div class="text-h6">Memory Limit (KB)</div>
    <q-input v-model="memoryLimit" filled />
    <div class="text-h6">Author</div>
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

    <q-select
      filled
      v-model="chosenLanguages"
      clearable
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
    <q-select :options="problemVisibilityTypes" v-model="visibility"></q-select>
    <q-btn @click="update">Update</q-btn>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Language, Problem } from 'src/entities/Submission';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'UpdateProblem',
  computed: {
    Language() {
      return Language;
    },
  },
  setup() {
    const route = useRoute();
    const problemId = route.query.problemId;
    const problem = ref<Problem>();

    const problemName = ref<string | null>('');
    const context = ref<string | null>('');
    const timeLimit = ref<number>(1000);
    const memoryLimit = ref<number>(512);

    const author = ref<string>('');
    const source = ref<string>('');
    const args = ref<string[]>([]);
    const visibility = ref<string>('Public');
    const problemVisibilityTypes = ['Public', 'Private', 'Limited'];

    const allLanguages = ref<Language[]>([]);
    const chosenLanguages = ref<Language[]>([]);

    const fetchProblem = () => {
      api.get(`problems/${problemId}?projection=all`).then((data) => {
        problem.value = data.data as Problem;

        problemName.value = problem.value?.problemName;
        context.value = problem.value?.context;
        timeLimit.value = problem.value?.timeLimit;
        memoryLimit.value = problem.value?.memoryLimit;
        author.value = problem.value?.author;
        source.value = problem.value?.source;
        args.value = problem.value?.tags;
        chosenLanguages.value = problem.value?.supportLanguages;
        visibility.value = problem.value?.visibility.toString();
      });
    };

    onMounted(() => {
      api.get('languages').then((data) => {
        allLanguages.value = data.data._embedded.languages;
        allLanguages.value = allLanguages.value.map((language) => {
          return {
            id: language.id,
            languageName: language.languageName,
            languageVersion: language.languageVersion,
          };
        });
      });

      fetchProblem();
    });

    const update = () => {
      console.log(chosenLanguages.value);
      api
        .patch(`problems/${problemId}`, {
          problemName: problemName.value,
          context: context.value,
          timeLimit: timeLimit.value,
          memoryLimit: memoryLimit.value,
          source: source.value,
          author: author.value,
          tags: args.value,
          visibility: visibility.value,
        })
        .then((response) => {
          console.log('题目创建成功', response.data);
        })
        .catch((error) => {
          console.error('创建问题失败', error);
        });
      api
        .patch(
          `public/problems/updateSupportLanguages/${problemId}`,
          chosenLanguages.value
        )
        .then((response) => {
          console.log('题目语言更新成功', response.data);
        })
        .catch((error) => {
          console.error('题目语言更新失败', error);
        });
    };

    return {
      problem,
      problemName,
      context,
      timeLimit,
      memoryLimit,
      author,
      source,
      args,
      visibility,
      problemVisibilityTypes,
      languages: allLanguages,
      chosenLanguages,
      update,
    };
  },
});
</script>

<style scoped lang="css"></style>
