import { publicApi, restServerApi } from 'src/utils/request';
import { Ref } from 'vue';
import { User } from 'src/entities/Submission';
import { UserLoginProjection } from 'stores/example-store';

class LoginRequest {
  public username: string;
  public password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export const UserRepo = {
  requests: {
    publicApi,
    restServerApi,
  },

  methods: {
    login: (
      username: string,
      password: string,
      userRef: Ref<UserLoginProjection>
    ) => {
      publicApi
        .post('signin', new LoginRequest(username, password))
        .then((data: any) => {
          if (data.data == null) {
            alert('Login failed ...');
          } else {
            userRef.value = data.data;
          }
        });
    },
  },
};
