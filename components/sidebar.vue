<template>
  <aside>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <img v-bind:src="logoImage" class="aside_logo">
      <div v-on:click="putHomeLink" class="go_home">
        <img v-bind:src="homeImage" class="home_icon">
        <p>ホーム</p>
      </div>
      <div v-on:click="putLogoutLink" class="go_logout">
        <img v-bind:src="logoutImage" class="logout_icon">
        <p v-if="userId === -1">ログイン画面へ</p>
        <p v-else>ログアウト</p>
        <!-- <p><NuxtLink to="/login">ログイン画面へ</NuxtLink></p> -->
      </div>
      <div class="form_wrap">
        <p class="share">シェア</p>
        <p v-show="errored" class="error">エラーが発生しました</p>
        <validation-observer ref="obs" v-slot="ObserverProps">
          <div class="post_form">
            <validation-provider v-slot="ProviderProps" rules="max:120">
              <div class="error">{{ ProviderProps.errors[0] }}</div>
              <textarea v-model="postMessage" cols="30" rows="10" class="post_input" name="投稿"></textarea>
            </validation-provider>
          </div>
          <button v-on:click="sendMessage" class="send_button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
          v-bind:class="{ disabled_button: ObserverProps.invalid || !ObserverProps.validated || !postMessage }">シェアする</button>
        </validation-observer>
      </div>
      <!-- <p><NuxtLink to="/comment/1">コメント画面へ</NuxtLink></p> -->
      <div class="user_profile">
        <p>{{ loginState }}</p>
        <p>ユーザー名：{{ userName }}</p>
      </div>
    </div>
  </aside>
</template>

<script>
import firebase from '~/plugins/firebase'
import axios from "axios";
export default {
  data() {
    return {
      errored: false,
      loading: true,
      postMessage: "",
      logoImage: require('@/assets/img/logo.png'),
      homeImage: require('@/assets/img/home.png'),
      logoutImage: require('@/assets/img/logout.png'),
      userName: "ゲスト",
      loginState: "ログインしていません",
      userId: -1,
      // ApiのURL
      apiUrl: "https://mighty-temple-79105.herokuapp.com/api/v1/",
      // ローカルサーバーの場合は
      // apiUrl: "http://127.0.0.1:8000/api/v1/",
    }
  },
  methods: {
    // ホーム画面へのリンク
    putHomeLink() {
      this.$router.push('/');
    },
    // ログイン画面へ移動もしくはログアウト後にログイン画面に移動
    async putLogoutLink() {
      if (this.userId === -1) {
        this.$router.push('/login');
      }
      else {
        await firebase
          .auth()
          .signOut()
          .then(() => {
            alert('ログアウトが完了しました')
          this.$router.push('/login');
          })
      }
    },
    // 投稿処理
    async sendMessage() {
      if (!this.postMessage) return;
      await axios.post(`${this.apiUrl}post`,{
        content: this.postMessage,
        user_id: this.userId,
        user_name: this.userName,
      })
      .then(()=>this.postMessage="")
      .catch((error) => {
          console.log(error);
          this.errored = true;
          return;
      });
      if (this.$route.path === '/') {
        location.reload(true);
      }
      else {
        this.$router.push('/');
      }
    },
  },
  // ログイン状態の確認
  async created() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loginState = 'ログイン済みです';
        this.userName = user.displayName;
        this.userId = user.uid;
      }
        this.loading=false;
    })
  },
}
</script>

<style scoped>
aside {
  min-height: 100%;
  width: 25%;
  background: rgba(0, 0, 0, 1);
  color: white;
  padding: 20px;
  /* position: fixed; */
}
.aside_logo {
  width: 50%;
}
.go_home, .go_logout {
  display: flex;
  line-height: 25px;
  cursor: pointer;
  width: fit-content;
  margin: 10px 0;
}
.home_icon, .logout_icon {
  height: 25px;
  margin-right: 20px;
}
.post_input {
  width: 90%;
  height: 120px;
  padding: 10px;
  background: transparent;
  border: 1px solid white;
  border-radius: 10px;
  color: white;
  font-size: 16px;
}
.send_button {
  padding: 10px 20px;
  background: rgb(0, 68, 255);
  border: none;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: block;
  margin: 10px 10px 20px auto;
}
.disabled_button {
  background: rgb(200, 206, 221);
}
.user_profile {
  padding: 20px;
  border: 1px solid white;
  border-radius: 10px;
  line-height: 1.5em;
}
.error {
  color: red;
}
.share {
  margin: 30px 10px 10px;
  font-weight: bold;
}
</style>