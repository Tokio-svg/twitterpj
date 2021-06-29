<template>
  <div class="container">
    <h1>コメント画面</h1>
    <!-- <p>{{postId}}{{postUrl}}</p> -->
    <div v-if="errored">
      <p>エラーデス！</p>
    </div>
    <div v-else-if="loading">
      Loading...
    </div>
    <div v-else>
      <div class="post_wrap">
        <div class="post_title">
          <p>User: {{ postUserName(info) }}</p>
          <img v-bind:src="goodImage" v-on:click="addGood(postId)"
          v-bind:class="{ red_heart: checkGood(postId), blue_heart: userId===-1 }">
          <p>{{ goodSum }}</p>
          <img v-bind:src="crossImage" v-on:click="deletePost(postId)" v-if="deleteAble">
          <p class="post_date">{{ postDate(info) }}</p>
        </div>
        <div class="post_content">
          <p>{{ postContent(info) }}</p>
        </div>
      </div>
      <div class="comments_wrap">
        <h2>コメント一覧</h2>
        <div class="comment_list" v-for="item in info.comments" v-bind:key="item.id">
          <div class="comment_title">
            <p>User: {{ commentUserName(item) }}</p>
            <p class="post_date">{{ commentDate(item) }}</p>
          </div>
          <p>{{ commentContent(item) }}</p>
        </div>
      </div>
      <validation-observer ref="obs" v-slot="ObserverProps">
        <div class="comment_form">
          <validation-provider v-slot="ProviderProps" rules="max:120">
            <div class="error">{{ ProviderProps.errors[0] }}</div>
            <textarea v-model="commentMessage" class="comment_input" name="コメント"></textarea>
          </validation-provider>
        <button v-on:click="sendComment" class="comment_button"
        :disabled="ObserverProps.invalid || !ObserverProps.validated"
        v-bind:class="{ disabled_button: ObserverProps.invalid || !ObserverProps.validated || !commentMessage }">コメント</button>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase';
import axios from "axios";
export default {
  layout: 'pattern_sidebar',
  data() {
    return {
      errored: false,
      loading: true,
      postId: this.$route.params.postID,  // string型
      info: {}, // Apiから取得した投稿、コメントと関連付けられたユーザー情報を格納する
      commentMessage:"",
      goodImage: require('@/assets/img/heart.png'),
      crossImage: require('@/assets/img/cross.png'),
      userId: -1,
      userName: "ゲスト",
      // ApiのURL
      apiUrl: "https://mighty-temple-79105.herokuapp.com/api/v1/",
      // 投稿情報を取得するApiのURL
      postUrl: `https://mighty-temple-79105.herokuapp.com/api/v1/post/${this.$route.params.postID}`,
      // ローカルサーバーの場合は以下を使用する
      // apiUrl: "http://127.0.0.1:8000/api/v1/",
      // postUrl: `http://127.0.0.1:8000/api/v1/post/${this.$route.params.postID}`,
    }
  },
  computed: {
    deleteAble: function() {
      if (this.userId === -1) return false;
      if (this.info.data) {
        if (this.info.data[0].user_id === this.userId) {
          return true;
        }
      }
      return false;
    },
    goodSum: function() {
      if (!this.info.goods) return null;
      let count = 0;
      this.info.goods.forEach(element => {
        if (element.post_id == this.postId) count++;
      });
      return count;
    },
  },
  methods: {
    // 投稿とコメントのユーザー名と内容を出力する（存在しない場合はunknownか空を返す）
    postUserName(info) {
      if (info.data) return info.data[0].user_name;
      return "";
    },
    postContent(info) {
      if (info.data) return info.data[0].content;
      return "";
    },
    postDate(info) {
      if (info.data) return info.data[0].created_at;
      return "";
    },
    commentUserName(info) {
      if (info.user_name) return info.user_name;
      return "";
    },
    commentDate(info) {
      if (info.created_at) return info.created_at;
      return "";
    },
    commentContent(info) {
      if (info.content) return info.content;
      return "";
    },
    // フォーム内の情報をApiに送信する（user_idはログイン中のユーザーに変更すること）
    async sendComment() {
      if (!this.commentMessage) return;
      await axios.post(`${this.apiUrl}comment`,{
        content: this.commentMessage,
        user_id: this.userId,
        post_id: this.$route.params.postID,
        user_name: this.userName,
      })
      .catch((error) => {
          console.log(error);
          this.errored = true;
      });;
      this.commentMessage = "";
      await axios
        .get(this.postUrl)
        .then((response) => (this.info = response.data))
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
    },
      // 該当する投稿のいいねを加算もしくは減算
    async addGood(postId) {
      if (this.userId === -1) return;
      let id = null;
      // userId(ログイン中のユーザーID)とuser_idが一致するいいねがある場合は
      // 該当のIDを格納して抜ける
      this.info.goods.forEach(element => {
        if (element.user_id == this.userId && element.post_id == postId) {
          id = element.id;
        };
      });
      // すでにいいねしている場合はレコードを削除
      // まだしていない場合はレコードを作成
      if (id) {
        const url = `${this.apiUrl}good/${id}`;
        await axios.delete(url)
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
      }
      else {
        await axios.post(`${this.apiUrl}good`,{
          user_id: this.userId,
          post_id: postId,
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
      }
      await axios
      .get(this.postUrl)
      .then((response) => (this.info = response.data))
      .catch((error) => {
          console.log(error);
          this.errored = true;
      });
    },
    checkGood(postId) {
      if (!this.info.goods) return false;
      let check = false;
      this.info.goods.forEach(element => {
        if (element.user_id == this.userId && element.post_id == postId) {
          check = true;
        };
      });
      return check;
    },
    // 該当する投稿を削除
    async deletePost(postId) {
      let check = confirm('投稿を削除します');
      if (check) {
        const url = `${this.apiUrl}post/${postId}`;
        await axios.delete(url)
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });

        this.$router.push('/');
      }
    },
  },
  // Apiから投稿情報を取得
  async mounted() {
    await axios
      .get(this.postUrl)
      .then((response) => (this.info = response.data))
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));
  },
  // ログイン状態の確認
  async created() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loginState = 'ログイン済みです';
        this.userName = user.displayName;
        this.userId = user.uid;
      }
    })
  },
}
</script>

<style scoped>
  .container {
    background: rgb(8, 26, 23);
    color: white;
    min-height: 100%;
    width: 100%;
    padding-left: 20px;
  }
  .post_wrap, h1 {
    width: 90%;
    padding: 20px;
    border: 1px solid white;
  }
  .post_title {
    display: flex;
    line-height: 25px;
    margin-bottom: 10px;
  }
  .post_title p {
    margin-right: 20px;
  }
  .post_title img {
    width: 25px;
    cursor: pointer;
    margin: 0 10px;
  }
  .comments_wrap {
    width: 90%;
    padding: 20px;
    border: 1px solid white;
  }
  .comments_wrap h2 {
    margin-bottom: 20px;
  }
  .comment_list {
    width: 90%;
    padding: 20px;
    border: 1px solid white;
  }
  .comment_title {
    display: flex;
    margin-bottom: 10px;
  }
  .comment_form {
    width: 90%;
    margin-top: 10px;
  }
  .comment_button {
    padding: 10px 50px;
    background: rgb(0, 68, 255);
    border: none;
    color: white;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: block;
    margin-left: auto;
  }
  .disabled_button {
    background: rgb(200, 206, 221);
  }
  .comment_input {
    width: 100%;
    height: 60px;
    padding: 10px;
    background: transparent;
    border: 1px solid white;
    border-radius: 10px;
    margin: 10px auto;
    color: white;
    font-size: 16px;
  }
  .red_heart {
    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(265deg) brightness(95%) contrast(112%);
  }
  .blue_heart {
    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(100deg) brightness(40%) contrast(112%);
  }
  .error {
    color: red;
  }
  .post_date {
    color: rgb(151, 151, 151);
    margin-left: auto;
  }
  p {
    word-wrap: break-word;
  }
</style>