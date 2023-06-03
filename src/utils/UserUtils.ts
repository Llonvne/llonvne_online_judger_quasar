import { UserLoginProjection, UserStore } from 'stores/example-store';
import { ApiType, publicApi } from 'src/utils/api';

const userStore = UserStore();

type UserCallback = (user: UserLoginProjection) => void;

export enum Show {
  All,
  Accepted,
  Attempted,
  Favorite,
}

export const UserUtils = {
  methods: {
    login: (
      username: string,
      password: string,
      callback: UserCallback | null = null
    ) => {
      publicApi
        .post(ApiType.LOGIN, {
          username: username,
          password: password,
        })
        .then((data: any) => {
          if (data.data == null) {
            alert('Login failed ...');
          } else {
            const user = data.data as UserLoginProjection;
            userStore.login(user);
            if (callback != null) {
              callback(user);
            }
          }
        });
    },
    logout: () => {
      userStore.logout();
    },
  },
};
