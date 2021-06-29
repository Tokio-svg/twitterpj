<template>
  <div class="container">
    <!-- <p>{{info}}</p> -->
    <h1>ホーム画面</h1>
    <div v-if="errored">
      <p>エラーデス！</p>
    </div>
    <div v-else-if="loading">
      Loading...
    </div>
    <div v-else>
      <!-- 投稿情報を出力 -->
      <div class="post_wrap" v-for="item in info.data" v-bind:key="item.id">
        <div class="post_title">
          <p>User: {{ item.user_name }}</p>
          <img v-bind:src="goodImage" v-on:click="addGood(item)"
          v-bind:class="{ red_heart: checkGood(item), blue_heart: userId===-1 }">
          <p>{{ putGoodsNum(item) }}</p>
          <img v-bind:src="crossImage" v-on:click="deletePost(item.id)" v-if="item.user_id === userId">
          <img v-bind:src="detailImage" v-on:click="putCommentLink(item.id)">
          <p class="post_date">{{ item.created_at }}</p>
        </div>
        <div class="post_content">
          <p>{{ item.content }}</p>
        </div>
      </div>
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
      info: {},
      goodImage: require('@/assets/img/heart.png'),
      crossImage: require('@/assets/img/cross.png'),
      detailImage: require('@/assets/img/detail.png'),
      userName: "ゲスト",
      userId: -1,
      // ApiのURL
      apiUrl: "https://mighty-temple-79105.herokuapp.com/api/v1/",
      // ローカルサーバーの場合は
      // apiUrl: "http://127.0.0.1:8000/api/v1/",
    }
  },
  // Apiから投稿情報を取得
  async mounted() {
    await axios
      // .get("http://127.0.0.1:8000/api/v1/post")
      .get(`${this.apiUrl}post`)
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
        this.userName = user.displayName;
        this.userId = user.uid;
      }
    })
  },
  methods: {
    // 投稿したユーザー名を出力
    putName(user) {
      if (user) return user.name;
      return "ゲスト";
    },
    // コメントへのリンクを出力
    putCommentLink(id) {
      const url = "/comment/"+ id;
      this.$router.push(url);
    },
    // 各投稿のいいね数を出力
    putGoodsNum(info) {
      if (!info.goods) return null;
      return info.goods.length;
    },
    // いいね済かどうかチェック
    checkGood(info) {
      let check = false;
      if (!info.goods) return check;
      info.goods.forEach(element => {
        if (element.user_id == this.userId) {
          check = true;
        };
      });
      return check;
    },
    // 該当する投稿のいいねを加算もしくは減算
    async addGood(info) {
      if (this.userId === -1) return;
      let id = null;
      // userId(ログイン中のユーザーID)とuser_idが一致するいいねがある場合は
      // 該当のIDを格納して抜ける
      info.goods.forEach(element => {
        if (element.user_id === this.userId) {
          id = element.id;
        };
      });
      // すでにいいねしている場合はレコードを削除
      // まだしていない場合はレコードを作成
      if (id) {
        const url = `${this.apiUrl}good/${id}`
        await axios.delete(url)
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
      }
      else {
        await axios.post(`${this.apiUrl}good`,{
          user_id: this.userId,
          post_id: info.id,
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
      }
      await axios
      .get(`${this.apiUrl}post`)
      .then((response) => (this.info = response.data))
      .catch((error) => {
          console.log(error);
          this.errored = true;
      });
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

        await axios
        .get(`${this.apiUrl}post`)
        .then((response) => (this.info = response.data))
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
      }
    }
  }
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
  .red_heart {
    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(265deg) brightness(95%) contrast(112%);
  }
  .blue_heart {
    filter: invert(15%) sepia(95%) saturate(6932%) hue-rotate(100deg) brightness(40%) contrast(112%);
  }
  .post_date {
    color: rgb(151, 151, 151);
    margin-left: auto;
  }
  p {
    word-wrap: break-word;
  }
</style>