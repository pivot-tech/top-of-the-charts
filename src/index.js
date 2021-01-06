(function ($) {
  "use strict";

  /* -------------------------------- Constants ------------------------------- */
  const API_KEY = "1845536b07fabf25ec247db4a3ffefb7";
  const BASE_URL =
    "https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists";

  /* --------------------------------- Library -------------------------------- */
  function fetchTopArtists(genre) {
    return fetch(
      `${BASE_URL}&api_key=${API_KEY}&tag=${genre}&format=json`
    ).then((resp) => resp.json());
  }

  function createArtistCard(artist) {
    return `<article class="artist-card">
        <h3 class="artist-card__title">
            <a class="artist-card__link" 
               href="${artist.url}"
               target="_blank">${artist.name}</a>
        </h3>
    </article>`;
  }

  /* ---------------------------------- Utils --------------------------------- */
  function withLocalStorage(fn) {
    return (...args) => {
      const fromLocalStorage = localStorage.getItem(args);
      if (!fromLocalStorage) {
        return fn(...args).then((result) => {
          localStorage.setItem(args, JSON.stringify(result));
          return Promise.resolve(result);
        });
      }
      return Promise.resolve(JSON.parse(fromLocalStorage));
    };
  }

  const fetchCachedTopArtist = withLocalStorage(fetchTopArtists);

  /* -------------------------------- Handlers -------------------------------- */
  function onWindowLoad() {
    const $genreButtons = [...$.querySelectorAll(".genre-button")];
    const $topArtistList = document.getElementById("topArtistsList");
    $genreButtons.forEach(($button) => {
      $button.addEventListener("click", onGenreButtonClicked($topArtistList));
    });
  }

  function onGenreButtonClicked(listElement) {
    return (event) => {
      const { genre } = event.target.dataset;
      fetchCachedTopArtist(genre).then(({ topartists: { artist } }) => {
        listElement.classList.remove("list--empty");
        listElement.innerHTML = artist.map(createArtistCard).join("");
      });
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              Start Application                             */
  /* -------------------------------------------------------------------------- */
  window.onload = onWindowLoad;
})(document);
