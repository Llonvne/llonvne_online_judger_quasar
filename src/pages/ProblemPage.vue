<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-2">
        <div style="margin-top: 2em; margin-left: 1em">
          <q-btn>Add Problem</q-btn>
        </div>
      </div>
      <div class="col-10">
        <q-markup-table separator="vertical" flat bordered>
          <thead>
            <tr>
              <th class="text-left">
                <q-input square v-model="problemNameFilter" label="Title" />
              </th>
              <th class="text-right">
                <q-input square v-model="sourceFilter" label="Source" />
              </th>
              <th class="text-right">Solved</th>
              <th class="text-right">
                <q-input square v-model="tagFilter" label="Tags" />
              </th>
              <th class="text-right">
                <q-input square v-model="authorFilter" label="Author" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="problem in filteredByAuthor"
              :key="problem['problemName']"
            >
              <td class="text-left">
                <router-link
                  :to="{
                    name: 'detail',
                    query: {
                      problemLinks: problem['_links']['self']['href'],
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
import { defineComponent, ref } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'ProblemPage',
  components: {},
  setup() {
    const problemNameFilter = ref(null);
    const sourceFilter = ref(null);
    const tagFilter = ref(null);
    const authorFilter = ref(null);
    const problems = ref(null);
    return {
      problemNameFilter,
      sourceFilter,
      tagFilter,
      authorFilter,
      problems,
    };
  },
  mounted() {
    api
      .get('http://localhost:9003/api/problems?projection=problems')
      .then((data) => {
        console.log(data.data);
        this.problems = data.data['_embedded']['problems'];
      });
  },
  computed: {
    filteredByName() {
      if (this.problemNameFilter == null) {
        return this.problems;
      } else {
        return this.problems.filter((problem) => {
          return problem['problemName'].includes(this.problemNameFilter);
        });
      }
    },
    filteredBySource() {
      if (this.sourceFilter == null) {
        return this.filteredByName;
      } else {
        return this.filteredByName.filter((problem) => {
          return problem['source'].includes(this.sourceFilter);
        });
      }
    },
    filteredByTag() {
      if (this.tagFilter == null) {
        return this.filteredBySource;
      } else {
        return this.filteredBySource.filter((problem) => {
          for (const tag of problem['tags']) {
            return tag.includes(this.tagFilter);
          }
          return false;
        });
      }
    },
    filteredByAuthor() {
      if (this.authorFilter == null) {
        return this.filteredByTag;
      } else {
        return this.filteredByTag.filter((problem) => {
          return problem['author'].includes(this.authorFilter);
        });
      }
    },
  },
});
</script>
