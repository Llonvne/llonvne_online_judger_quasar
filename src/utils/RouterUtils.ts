import { Router } from 'vue-router';

export function routeToProblemDetailPage(router: Router, problemId: number) {
  return router.push({
    path: '/detail',
    query: { problemId: problemId },
  });
}

export function routeToSubDetailPage(router: Router, subId: number) {
  return router.push({
    path: '/sub',
    query: { id: subId },
  });
}
