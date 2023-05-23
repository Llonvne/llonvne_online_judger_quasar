<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="register-title">Sign Up</h2>
      <q-form class="register-form" @submit="submitForm">
        <div class="input-container">
          <q-input
            outlined
            v-model="form.username"
            label="Username"
            clearable
            :rules="[(val) => !!val || 'Username is required']"
            hint="Enter your username"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="input-container">
          <q-input
            outlined
            v-model="form.password"
            label="Password"
            type="password"
            clearable
            :rules="[
              (val) => !!val || 'Password is required',
              (val) =>
                val.length >= 6 || 'Password should be at least 6 characters',
            ]"
            hint="Enter your password"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="lock"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="input-container">
          <q-input
            outlined
            v-model="form.nickname"
            label="Nickname"
            clearable
            dense
            hint="Enter your nickname"
          >
            <template v-slot:prepend>
              <q-icon name="person_pin"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="input-container">
          <q-input
            outlined
            v-model="form.realname"
            label="Real Name"
            clearable
            dense
            hint="Enter your real name"
          >
            <template v-slot:prepend>
              <q-icon name="badge"></q-icon>
            </template>
          </q-input>
        </div>
        <div class="input-container">
          <q-select
            outlined
            v-model="form.gender"
            label="Gender"
            :options="[
              'Agender',
              'Androgyne',
              'Androgynous',
              'Bigender',
              'Cisgender',
              'Cis Female',
              'Cis Male',
              'Cis Man',
              'Cis Woman',
              'Cisgender Female',
              'Cisgender Male',
              'Cisgender Man',
              'Cisgender Woman',
              'Female to Male',
              'FTM',
              'Gender Fluid',
              'Gender Nonconforming',
              'Gender Questioning',
              'Gender Variant',
              'Genderqueer',
              'Intersex',
              'Male to Female',
              'MTF',
              'Neither',
              'Neutrois',
              'Non-binary',
              'Other',
              'Pangender',
              'Trans',
              'Trans Female',
              'Trans Male',
              'Trans Man',
              'Trans Person',
              'Trans Woman',
              'Transfeminine',
              'Transgender',
              'Transgender Female',
              'Transgender Male',
              'Transgender Man',
              'Transgender Person',
              'Transgender Woman',
              'Transmasculine',
              'Two-Spirit',
              'Agenderflux',
              'Alexigender',
              'Aliusgender',
              'Amaregender',
              'Ambigender',
              'Ambonec',
              'Amicagender',
              'Androgyflux',
              'Anesigender',
              'Aporagender',
              'Astergender',
              'Astralgender',
              'Autogender',
              'Axigender',
              'Bi-gendered',
              'Blurgender',
              'Boyflux',
              'Burstgender',
              'Caelgender',
              'Cassgender',
              'Cavusgender',
              'Cendgender',
              'Ceterofluid',
              'Ceterogender',
              'Deliciagender',
              'Demifluid',
              'Demigender',
              'Domgender',
              'Demiagender',
              'Duragender',
              'Egogender',
              'Epicene',
              'Espigender',
              'Exgender',
              'Femfluid',
              'Fluidflux',
              'Gemigender',
              'Genderblank',
              'Genderflow',
              'Genderflux',
              'Genderfuzz',
              'Gender Neutral',
              'Genderpixel',
              'Gendervague',
              'Girlflux',
              'Graygender',
              'Gyragender',
              'Heliogender',
              'Hemigender',
              'Horogender',
              'Hydrogender',
              'Imperigender',
              'Intergender',
              'Juxera',
              'Libragender',
              'Magigender',
              'Mascfluid',
              'Maverique',
              'Mirrorgender',
              'Molligender',
              'Multigender',
              'Nanogender',
              'Nobifluid',
              'Nongender',
              'Novigender',
              'Nullgender',
              'Omnigender',
              'Oneirogender',
              'Pangenderfluid',
              'Paragender',
              'Polygender',
              'Polygenderflux',
              'Proxvir',
              'Quoigender',
              'Subgender',
              'Surgender',
              'Systemgender',
              'Tragender',
              'Transneutral',
              'Transpangender',
              'Transgenderqueer',
              'Transgender Neutral',
              'Trigender',
              'Ungender',
              'Vapogender',
              'Venngender',
              'Verangender',
              'Vertigender',
              'Vocigender',
              'Xenogender',
              'Xumgender',
              'Zerogender',
              // 继续添加你想要支持的性别身份
            ]"
            clearable
            hint="Select your gender"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="wc"></q-icon>
            </template>
          </q-select>
        </div>
        <div class="submit-container">
          <q-btn
            type="submit"
            label="Sign Up"
            class="submit-btn"
            text-color="black"
            shadow
            unelevated
          ></q-btn>
        </div>
      </q-form>
      <div class="register-shadow"></div>
    </div>
    <div
      v-if="registrationStatus"
      class="registration-notification"
      :class="registrationStatus"
    >
      <p class="notification-message" v-if="registrationStatus === 'success'">
        Registration successful!
      </p>
      <p
        class="notification-message"
        v-else-if="registrationStatus === 'failure'"
      >
        Registration failed. Please try again.
      </p>
      <p class="notification-message" v-else>Registering...</p>
    </div>
  </div>
</template>

<style>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.register-box {
  width: 400px;
  max-width: 90%;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.register-title {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.register-form {
  margin-bottom: 30px;
}

.input-container {
  margin-bottom: 20px;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.submit-btn {
  background-color: white;
  color: black;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.submit-btn:hover {
  transform: scale(1.05);
}

.register-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>

<script>
import axios from 'axios';
import { UserStore } from 'stores/example-store';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        nickname: '',
        realname: '',
        gender: null,
      },
      registrationStatus: null,
      newUser: null,
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post(
          'http://localhost:9003/signup',
          this.form
        );
        const { success, newUser } = response.data;

        if (success) {
          this.registrationStatus = 'success';
          this.newUser = newUser;
          const userStore = UserStore();
          userStore.login(newUser);
          this.$router.push('/');
        } else {
          this.registrationStatus = 'failure';
          this.newUser = null;
        }
      } catch (error) {
        this.registrationStatus = 'failure';
        this.newUser = null;
        console.error('Registration failed:', error);
      }
    },
  },
};
</script>
