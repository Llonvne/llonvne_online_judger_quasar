import { defineStore } from 'pinia';

function getFormLocal(): UserLoginProjection | null {
  console.log(localStorage.getItem('user'));
  const userJson = localStorage.getItem('user');
  if (userJson == null) {
    return null;
  }
  {
    return JSON.parse(userJson) as UserLoginProjection;
  }
}

export class UserLoginProjection {
  username: string;
  id: number;
  gender: string;
  nickname: string;
  realname: string;
  description: string;
  registerDate: string;
  school: string;
  qq: string;
  email: string;
  role: string;

  constructor(data: any) {
    this.username = data.username;
    this.id = data.id;
    this.gender = data.gender;
    this.nickname = data.nickname;
    this.realname = data.realname;
    this.description = data.description;
    this.registerDate = data.registerDate;
    this.school = data.school;
    this.qq = data.qq;
    this.email = data.email;
    this.role = data.role;
  }
}

export const UserStore = defineStore('user', {
  state: () => ({
    loginUser: getFormLocal() as UserLoginProjection | null,
  }),
  actions: {
    login(user: any) {
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.loginUser = new UserLoginProjection(user);
    },
    logout() {
      this.loginUser = null;
      localStorage.setItem('user', JSON.stringify(null));
    },
    isLogin() {
      return this.loginUser != null;
    },
  },
});
