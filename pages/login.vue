<template>
  <div class="container">
    <div class="register_wrap">
      <h1>ログイン</h1>
      <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="register_form">
          <validation-provider v-slot="ProviderProps" rules="required">
            <div class="error">{{ ProviderProps.errors[0] }}</div>
            <input type="text" v-model="emailInput" class="email_input" name="メールアドレス" placeholder="メールアドレス">
          </validation-provider>
        </div>
        <div class="register_form">
          <validation-provider v-slot="ProviderProps" rules="required">
            <div class="error">{{ ProviderProps.errors[0] }}</div>
            <input type="text" v-model="passwordInput" class="password_input" name="パスワード" placeholder="パスワード">
          </validation-provider>
        </div>
        <button v-on:click="login" class="regist_button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
        v-bind:class="{ disabled_button: ObserverProps.invalid || !ObserverProps.validated }">ログイン</button>
        <div class="guest_button">
          <button v-on:click="sendRegistData" class="regist_button">ゲストとして参加</button>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  layout: 'default',
  data() {
    return {
      emailInput: "",
      passwordInput: ""
    }
  },
  methods: {
    sendRegistData() {
      // テスト用にホーム画面に移動
      this.$router.push("/");
    },
    // ログイン処理
    login() {
      if (!this.emailInput || !this.passwordInput) {
        alert('項目が入力されていません。')
        return
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.emailInput, this.passwordInput)
        .then(() => {
          alert('ログインが完了しました')
          this.$router.push('/')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/user-disabled':
              alert('ユーザーが無効になっています。')
              break
            case 'auth/user-not-found':
              alert('ユーザーが存在しません。')
              break
            case 'auth/wrong-password':
              alert('パスワードが間違っております。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
  }
}
</script>

<style scoped>
.container {
  background: rgb(8, 26, 23);
  color: white;
  height: 90%;
  position: relative;
}
.register_wrap {
  min-width: 400px;
  padding: 30px 10px;
  background: white;
  border-radius: 10px;
  margin: auto;
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-70%);
  text-align: center;
}
.register_wrap h1 {
  font-size: 20px;
}
.regist_button {
  padding: 10px 25px;
  background: rgb(0, 68, 255);
  border: none;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.disabled_button {
  background: rgb(200, 206, 221);
}
.regist_button:last-child {
  background: rgb(139, 0, 53);
}
.register_form {
  width: 80%;
  margin: 15px auto;
}
input {
  width: 90%;
  height: 40px;
  border: 1.5px solid black;
  border-radius: 5px;
  padding: 0 10px;
}
.error {
  color: red;
}
</style>