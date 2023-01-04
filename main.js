const API = "https://api.github.com/users/";
const requestMaxTimeMs = 3000;

const app = Vue.createApp({
  data() {
    return {
      search: null,
      result: null,
      error: null,
      favorites: new Map(),
    };
  },
  created() {
    const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"));
    /*
    Nos aseguramos de que efectivamente hay algo guardado en favorites.
    Recorreremos lo+s favoritos que nostrajimos (y transformamos) del navegador 
    y crearemos un nuevo mapa, usando la key y el value.
    */
    if (savedFavorites?.length) {
      const favorites = new Map(
        savedFavorites.map((favorite) => [favorite.login, favorite])
      );
      this.favorites = favorites;
    }
  },
  computed: {
    isFavorite() {
      return this.favorites.has(this.result.login);
    },
    allFavorites() {
      return Array.from(this.favorites.values());
    },
  },
  methods: {
    async doSearch() {
      this.result = this.error = null;

      const foundInFavorites = this.favorites.get(this.search);
      /* 
      Cada vez que lancemos doSearch comprobaremos, 
      si el objeto está en Favoritos, cuándo se añadió.
      Si hace más de X tiempo, lanzaremos de nuevo la petición
      */
      const shouldRequestAgain = (() => {
        if (!!foundInFavorites) {
          const { lastRequestTime } = foundInFavorites;
          const now = Date.now();
          return now - lastRequestTime > requestMaxTimeMs;
        }
        return false;
      })();

      console.log(foundInFavorites);
      /*
      Usamos la doble admiración para convertir el objeto Favorite en false 
      y después a true.
      */
      if (!!foundInFavorites && !shouldRequestAgain) {
        console.log("Found, logged version can be used");
        return (this.result = foundInFavorites);
      }
      try {
        console.log("Not found or cached version is too old, requesting again");
        const response = await fetch(API + this.search);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        this.result = data;
        //Actualizamos cuándo se pidió la información por última vez
        foundInFavorites.lastRequestTime = Date.now();
      } catch (error) {
        this.error = error;
      } finally {
        this.search = null;
      }
    },
    addFavorite() {
      console.log("Guardando favorito...");
      this.result.lastRequestTime = Date.now();
      this.favorites.set(this.result.login, this.result);
      this.updateStorage();
    },
    removeFavorite() {
      console.log("Borrando favorito...");
      this.favorites.delete(this.result.login);
      this.updateStorage();
    },
    showFavorite(favorite) {
      this.result = favorite;
    },
    checkFavorite(id) {
      return this.result?.login === id;
    },
    updateStorage() {
      window.localStorage.setItem(
        "favorites",
        JSON.stringify(this.allFavorites)
      );
    },
  },
});
