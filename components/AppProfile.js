app.component("app-profile", {
  props: ["result", "isFavorite"],
  methods: {
    addFavorite() {
      this.$emit("add-favorite");
    },
    removeFavorite() {
      this.$emit("remove-favorite");
    },
  },
  template:
    /* html */
    `
      <div class="result">
      <a
        v-if="isFavorite"
        href="#"
        class="result__toggle-favorite"
        @click="removeFavorite"
        >Remove Favorite ⭐</a
      >
      <a
        v-else
        href="#"
        class="result__toggle-favorite"
        @click="addFavorite"
        >Add Favorite ⭐</a
      >
  
      <h2 class="result__name">{{ result.login }}</h2>
      <img
        v-bind:src="result.avatar_url"
        v-bind:alt="result.name"
        class="result__avatar"
      />
      <p class="result_bio">Bio: {{ result.bio }}</p>
      <p>
        Blog:
        <a :href="result.blog" target="_blank" class="result_blog">{{
          result.blog
        }}</a>
      </p>
      <p>
        Github profile:
        <a
          :href="result.html_url"
          target="_blank"
          href="{{ result.html_url }}"
          class="result_html_url"
          >{{ result.html_url }}</a
        >
      </p>
    </div>`,
});
