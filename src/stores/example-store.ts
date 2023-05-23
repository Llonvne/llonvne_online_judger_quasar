import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});

export const ProblemStore = defineStore('problem', {
  state: () => ({
    problems: [],
    initialized: false,
  }),
  getters: {
    getProblems: (state) => state.problems,
  },
  actions: {
    syncProblems() {
      return api
        .get('http://localhost:9003/api/problems?size=5')
        .then((data) => {
          this.initialized = true;
          this.problems = data.data['_embedded']['problems'];
        });
    },
  },
});

function getFormLocal() {
  console.log(localStorage.getItem('user'));
  if (localStorage.getItem('user') == 'null') {
    return null;
  } else {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export const UserStore = defineStore('user', {
  state: () => ({
    loginUser: getFormLocal(),
  }),
  actions: {
    login(user: any) {
      localStorage.setItem('user', JSON.stringify(user));
      this.loginUser = user;
    },
    logout() {
      this.loginUser = null;
      localStorage.setItem('user', JSON.stringify(null));
    },
    isLogin() {
      return this.loginUser == null;
    },
  },
});
