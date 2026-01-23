# 🎵 Spotify Dashboard

This is a fun project displaying my spotify stats using [React](https://react.dev/), the [Spotify API](https://developer.spotify.com/documentation/web-api), [Github Actions](https://github.com/features/actions), and [Render](https://render.com).

- Every 6 hours, Github actions fetches new data from the Spotify API, refreshing the data saved in this repository under [src/data/spotify-data.json](https://github.com/citrigos/spotify-dash/blob/main/src/data/spotify-data.json).
- New data can also be manually fetched anytime via the refresh button on the dashboard (triggers the Github Actions workflow via a [Render](https://render.com)-hosted backend API).
- The project re-deploys (with the new data) via github pages [here](https://citrigos.github.io/spotify-dash/). The 6-hour data refresh enables using a very simple web deployment (i.e. github pages) that is static.

- A guide on setting up Spotify API Credentials can be found under [SETUP.md](https://github.com/citrigos/spotify-dash/blob/main/SETUP.md)
- A guide on setting up the refresh button functionality can be found under [REFRESH_SETUP.md](https://github.com/citrigos/spotify-dash/blob/main/REFRESH_SETUP.md)
---

Made with 💜 by [citrigos](https://github.com/citrigos)
