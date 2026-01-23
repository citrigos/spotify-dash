# 🎵 Spotify Dashboard

This is a fun project displaying my spotify stats using [React](https://react.dev/), the [Spotify API](https://developer.spotify.com/documentation/web-api), and [github actions](https://github.com/features/actions). 

- Every 6 hours, Github actions enables fetching new data from the Spotify API, refreshing the data saved in this repository under [src/data/spotify-data.json](https://github.com/citrigos/spotify-dash/blob/main/src/data/spotify-data.json). 
- New data can also be manually fetched at anytime from the Actions tab > Update Spotify Data (on the left) > Redeploy
- The project then re-deploys (with the new data) via github pages [here](https://citrigos.github.io/spotify-dash/). The 6-hour data refresh enables using a very simple web deployment (i.e. github pages) that is static. 

- A guide on setting up Spotify API Credentials can be found under [SETUP.md](https://github.com/citrigos/spotify-dash/blob/main/SETUP.md)
---

Made with 💜 by [citrigos](https://github.com/citrigos)
