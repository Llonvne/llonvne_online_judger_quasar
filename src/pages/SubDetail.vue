<template>
  <div class="container q-pa-md shadow-3">
    <div class="row justify-between">
      <q-card flat bordered class="q-ma-md user-info">
        <q-card-section>
          <div class="text-h6">User Information</div>
        </q-card-section>
        <q-separator />
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>
              <q-item-label>User</q-item-label>
              <q-item-label caption
                >{{ submission?.user.username }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Problem</q-item-label>
              <q-item-label caption
                >{{ submission?.problem.problemId }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Language</q-item-label>
              <q-item-label caption
                >{{ submission?.language.languageName }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="label" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Submission Id</q-item-label>
              <q-item-label caption>{{ submission?.id }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
      <div class="code-section">
        <q-card flat bordered class="q-ma-md code-card">
          <q-card-section>
            <div class="text-h5">Code:</div>
            <pre class="q-ma-md rounded-borders code-box">
              <code v-html='highlightedCode'></code>
            </pre>
            <div class="text-h5">Result:</div>
            <div
              class="q-my-md result"
              :class="{
                accepted: submission?.ojResult === 'Accepted',
                rejected: submission?.ojResult !== 'Accepted',
              }"
            >
              {{ submission?.ojResult }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { Submission } from 'src/entities/Submission';
import axios from 'axios';
import { api } from 'boot/axios';

export default {
  setup() {
    // 从路径中获得 SubmissionId
    const route = useRoute() as RouteLocationNormalizedLoaded & {
      query: { id: number };
    };
    const submissionId = route.query.id;

    const submission = ref<Submission | null>(null);
    // load Submission from '`submissions/${submissionId}?projection=all`' use axios
    const asyncLoadSubmission = () => {
      api
        .get(
          `http://localhost:9003/api/submissions/${submissionId}?projection=all`
        )
        .then((data) => {
          submission.value = data.data as Submission | null;
          submission.value?.code.trim();
        });
    };

    const highlightedCode = computed(() =>
      Prism.highlight(
        submission?.value?.code ?? '',
        Prism.languages.javascript,
        'javascript'
      )
    );

    onMounted(() => {
      asyncLoadSubmission();
    });

    return {
      asyncLoadSubmission,
      highlightedCode,
      submission,
    };
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 0.25rem;
}

.container {
  background-color: #f5f5f5;
}

.user-info {
  flex: 0 0 30%;
  background-color: #ffffff;
  border: 1px solid #c0c0c0;
  max-height: 360px;
}

.code-section {
  flex: 1;
}

.code-card {
  background-color: #ffffff;
  border: 1px solid #c0c0c0;
}

.code-box {
  background-color: #d3d3d3;
  padding: 1rem;
}

.result {
  font-weight: bold;
}

.accepted {
  color: green;
}

.rejected {
  color: red;
}

.q-icon {
  transition: 0.5s;
}

.q-icon:hover {
  transform: rotate(360deg);
}
</style>
