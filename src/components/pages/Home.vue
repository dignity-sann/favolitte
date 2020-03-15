<template>
  <v-parallax
    dark
    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    height=""
  >
    <v-row class="mx-1"
      v-for="(v, i) in descriptions"
      :key="i"
    >
      <v-col>
        <v-card class="mx-auto">
          <v-card-actions class="ma-0 pa-0">
            <v-list-item class="grow px-3">
              <v-list-item-avatar color="grey darken-3 mx-1">
                <v-img
                  src="https://pbs.twimg.com/profile_images/759372673411485696/_2Krk93__normal.jpg"
                >
                </v-img>
              </v-list-item-avatar>
              <v-list-item-content class="ml-2">
                <v-list-item-title class="caption text-truncate font-weight-bold">
                  <span>
                    でぃくと
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle class="caption font-weight-regular">
                  <span>
                    @dignity_sann
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>  
          </v-card-actions>
          <v-card-text class="subtitle-2 mt-0 pt-0" v-html="v">
          </v-card-text>
          <v-divider/>

          <v-card-actions>
            <v-list-item class="grow">
              <v-row align="center" justify="end">
                <v-btn icon color="yellow">
                  <v-icon small>
                    mdi-star
                  </v-icon>
                </v-btn>
                <span class="caption mr-2" v-text="1"></span>
                <span class="mr-1"></span>
                <v-btn icon>
                  <v-icon
                    small
                  >
                    mdi-twitter-retweet
                  </v-icon>
                </v-btn>
                <span class="caption" v-text="0"></span>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-parallax>
</template>

<script>
export default {
  name: "home",
  components: {},
  data: () => ({
    descriptions: [
      `
      このサイトは良いファボするユーザ達をリスト化してまとめてみるサイトになります。<br/>
      PWAにも対応しているので以下の手順で試してみてください。<br/>
      1.パソコン：URLバーの＋マークでインストール<br/>
      2.スマホ（Android）：Chromeブラウザから右上のボタンからインストール<br/>
      3.スマホ（iPhone）：Safariブラウザからホームに追加<br/>
      身内用なので細々とやる（予定）<br/>
      バグやら何やらがいろいろありますが許してください&#x1f64f;
      `,
      `
      使い方は<br/>
      ①リスト作成、②アクティブリスト設定、③リストをみる</br>
      の３ステップになります。<br/>
      使用に当たってTwitter連携が必要になります。<br/>
      `,
      `
      リスト作成時に公開設定にすると、サイト利用者全体がアクティブリストに設定ができるようになります。<br/>
      リストウォッチでは直接イイねすることもできるので是非使ってください&#x1F680;<br/>
      `
    ],
    window: 0,
  }),
};
</script>

<style scoped>
.home {
  width: 100%;
}
.link-list {
  margin-top: 20px;
}
</style>