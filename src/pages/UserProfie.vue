<template>
  <div class="container">
    <div class="sidebar">
      <q-avatar color="red" text-color="white">
        <img src="https://cdn.quasar.dev/img/avatar3.jpg" alt="" />
      </q-avatar>
      <div class="username">{{ userStore.loginUser?.username ?? '' }}</div>
      <div class="nickname">{{ userStore.loginUser?.nickname ?? '' }}</div>
    </div>

    <div class="content">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">24 Hours</th>
            <th class="text-right">7 Days</th>
            <th class="text-right">30 Days</th>
            <th class="text-right">Overall Accepted</th>
            <th class="text-right">Overall Attempted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ before24HoursSubmissions?.length }}</td>
            <td class="text-right">{{ before7DaysSubmissions?.length }}</td>
            <td class="text-right">{{ before30DaysSubmissions?.length }}</td>
            <td class="text-right">{{ overallAcceptedSubmissions?.length }}</td>
            <td class="text-right">{{ overallAttemptedProblems?.length }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="info-container">
        <div class="text-h6">
          <span class="key">Register Date:</span>
          <span class="value">{{
            userStore.loginUser?.registerDate ?? 'Unknown'
          }}</span>
        </div>
        <div class="text-h6">
          <span class="key">QQ:</span>
          <span class="value">{{ userStore.loginUser?.qq ?? 'Unknown' }}</span>
        </div>
        <div class="text-h6">
          <span class="key">Description:</span>
          <span class="value">{{
            userStore.loginUser?.description ?? 'Unknown'
          }}</span>
        </div>
        <div class="text-h6">
          <span class="key">Email:</span>
          <span class="value">{{
            userStore.loginUser?.email ?? 'Unknown'
          }}</span>
        </div>
        <div class="text-h6">
          <span class="key">School:</span>
          <span class="value">{{
            userStore.loginUser?.school ?? 'Unknown'
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue';
import { UserStore } from 'stores/example-store';
import { api } from 'boot/axios';
import { Problem, Submission } from 'src/entities/Submission';

function getDaysBefore(days = 1): string {
  const currentDate = new Date(); // 当前时间
  const previousDate = new Date(
    currentDate.getTime() - 24 * 60 * 60 * 1000 * days
  );

  return previousDate.toISOString();
}

function filterSubmissionsByProblemId(submissions: Submission[]): Submission[] {
  const problemIdSet: Set<number> = new Set();
  const filteredSubmissions: Submission[] = [];

  for (const submission of submissions) {
    const problemId = submission.problem.problemId;

    if (!problemIdSet.has(problemId)) {
      problemIdSet.add(problemId);
      filteredSubmissions.push(submission);
    }
  }

  return filteredSubmissions;
}

export default defineComponent({
  setup() {
    const userStore = UserStore();
    let before24HoursSubmissions = ref<Array<Submission> | null>(null);
    let before7DaysSubmissions = ref<Array<Submission> | null>(null);
    let before30DaysSubmissions = ref<Array<Submission> | null>(null);
    let overallAcceptedSubmissions = ref<Array<Submission> | null>(null);
    let overallAttemptedProblems = ref<Array<Problem> | null>(null);

    const getBeforeIosDateAcceptedSubmission = (
      iosDate: string,
      to: Ref<Array<Submission> | null>
    ) => {
      api
        .get(
          `submissions/search/findByUserIdAndPreviousDay?userId=${userStore?.loginUser?.id}&limit=${iosDate}&projection=all`
        )
        .then((data) => {
          console.log(data.data);
          to.value = filterSubmissionsByProblemId(
            data.data['_embedded']['submissions'] as Array<Submission>
          );
        });
    };

    onMounted(() => {
      console.log(new Date(1).toISOString());
      getBeforeIosDateAcceptedSubmission(
        getDaysBefore(1),
        before24HoursSubmissions
      );
      getBeforeIosDateAcceptedSubmission(
        getDaysBefore(7),
        before7DaysSubmissions
      );
      getBeforeIosDateAcceptedSubmission(
        getDaysBefore(30),
        before30DaysSubmissions
      );
      getBeforeIosDateAcceptedSubmission(
        new Date(1).toISOString(),
        overallAcceptedSubmissions
      );

      api
        .get(
          `users/search/getUserAttemptedProblems?userId=${userStore.loginUser?.id}`
        )
        .then((data) => {
          overallAttemptedProblems.value = data.data['_embedded'][
            'problems'
          ] as Array<Problem>;
        });
    });

    return {
      userStore,
      before24HoursSubmissions,
      before7DaysSubmissions,
      before30DaysSubmissions,
      overallAcceptedSubmissions,
      overallAttemptedProblems,
    };
  },
});
</script>

<style scoped lang="css">
.container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 20px;
  padding: 20px;
}

.sidebar {
  background-color: #f2f2f2;
  padding: 20px;
}

.username {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.nickname {
  font-size: 18px;
  margin-top: 5px;
}

.content {
  padding: 20px;
}

.info-container {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  margin-top: 20px;
}

.text-h6 {
  padding: 5px 0;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.text-h6:last-child {
  border-bottom: none;
}

.key {
  font-weight: bold;
  color: #333;
}

.value {
  font-size: 0.9em;
  color: #666;
}
</style>
