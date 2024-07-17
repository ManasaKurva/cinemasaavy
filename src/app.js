const baseurl = "https://api.themoviedb.org/3";
const api_key = "b8d79da4a9edc6a843abd0e1ad21bb9c";
const image_url = "https://image.tmdb.org/t/p/original";
const movieByGenreBaseURL = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}`;
const genre = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 80,
    name: "Crime",
  },

  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },

  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];
const movieList = [
  {
    name: "now_playing",
    display: "Now Playing",
  },
  {
    name: "popular",
    display: "Popular Movies",
  },
  {
    name: "upcoming",
    display: "Upcoming Movies",
  },
  {
    name: "top_rated",
    display: "Top Rated Movies",
  },
];
document.addEventListener("DOMContentLoaded", () => {
  //trending videos
  const trendingVideos = `${baseurl}/trending/all/day?api_key=${api_key}`;
  fetch(trendingVideos)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("data" + data.results);
      sliderSection(data.results);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  //get movies Lisyt popular , upcoming and top_rated and now playing
  const getMoviesList = (name) => {
    return fetch(`${baseurl}/movie/${name}?api_key=${api_key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.results);
        return data.results;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  //get movies by genre
  const getMovieByGenreId = (id) => {
    return fetch(`${movieByGenreBaseURL}&with_genres=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  //slider
  const sliderDiv = document.querySelector(".sliderDiv");

  function sliderSection(results) {
    // Create the HTML for the images
    const imagesHTML = results
      .slice(0, 10)
      .map(element => {
        return `
          <div class="relative min-w-full h-[510px] slider-img" ">
            <img src="${image_url}${element.backdrop_path}" class="w-full h-full object-cover object-left-top rounded-xl hover:border-[4px] border-gray-400"/>
            <div class="absolute bottom-10 left-0 w-full p-6 rounded-b-xl flex flex-col gap-2">
              <div class="text-white text-5xl font-bold">${element.title != null ? element.title : element.name}</div>
              <div class="flex gap-5">
                <span class="px-4 py-1 glass-effect rounded-lg">${element.release_date != null ? element.release_date.slice(0, 4) : element.first_air_date.slice(0, 4)}</span>
                <span class="px-4 py-1 glass-effect rounded-lg">${element.vote_average.toFixed(1)}</span>
              </div>
              <div class="w-3/5 text-wrap">${element.overview}</div>
              <span class="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold search-btn flex gap-3 w-44 justify-center items-center data-movie-id="${element.id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd"/>
                </svg>
                Watch Now
              </span>
            </div>
          </div>`;
      })
      .join("");


    // Insert the images HTML before the first SVG element
    const firstSvg = sliderDiv.querySelector("svg");
    if (firstSvg) {
      firstSvg.insertAdjacentHTML("beforebegin", imagesHTML);
    } else {
      // If no SVG is found, simply append the images
      sliderDiv.innerHTML += imagesHTML;
    }
    // Setup the slider once images are fully loaded
    const images = sliderDiv.querySelectorAll("img");
    let loadedImages = 0;

    images.forEach(img => {
      img.addEventListener("load", () => {
        loadedImages++;
        if (loadedImages === images.length) {
          setupSlider();
        }
      });
    });
  }
  
//top-slider
  function setupSlider() {
    const sliderImg = document.querySelector(".slider-img");
    const sliderImgs = document.querySelectorAll(".slider-img");
    const leftArrow = document.querySelector(".slideLeft");
    const rightArrow = document.querySelector(".slideRight");
    const imageElement = sliderImg.querySelector("img");
    if (imageElement) {
      const imageWidth = imageElement.offsetWidth;
      const gap = parseInt(getComputedStyle(sliderDiv).gap) || 0;
      const scrollAmount = imageWidth + gap;

      leftArrow.addEventListener("click", () => {
        sliderDiv.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      });

      rightArrow.addEventListener("click", () => {
        sliderDiv.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      });

      setInterval(() => {
          if (sliderDiv.scrollLeft + sliderDiv.clientWidth >= sliderDiv.scrollWidth) {
              sliderDiv.scrollTo({
                  left: 0,
                  behavior: 'smooth'
              });
          } else {
              sliderDiv.scrollBy({
                  left: scrollAmount,
                  behavior: 'smooth'
              });
          }
      }, 2000);
      // Add click event listener to fetch and display the trailer
      sliderImgs.forEach(imgDiv => {
        imgDiv.addEventListener("click", () => {
          const movieId = imgDiv.getAttribute("data-movie-id");
          fetchMovieTrailer(movieId);
        });
      });
    }
  }
  //movies list -> popular, upcoming, top rated and now playing
  const moviesList = document.querySelector(".moviesList");
  async function generateMoviesList() {
    const moviesHTML = await Promise.all(
      movieList.map(async (item) => {
        const listofmovies = await getMoviesList(item.name);
        const moviesListHTML = listofmovies
          .map(
            (movie) => `
                      <div class="movie-item  flex-shrink-0">
                <img src="${image_url}${
              movie.backdrop_path
            }" class="w-full h-48 object-cover rounded-lg hover:border-[4px] border-gray-400 hover:scale-110 transition-all duration-100 ease-in cursor-pointer" alt="${
              movie.title
            }">
                <div class="movie-info rounded-lg p-2  text-white  mt-2">
                    <div class="movie-year"><span class="bg-black bg-opacity-60 px-3 py-1 rounded-lg mr-2">${movie.release_date.slice(
                      0,
                      4
                    )}</span>${movie.title}</div>

                </div>
            </div>

      `
          )
          .join("");
        return `<div class="genre-section px-8 md:px-10 ">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="hidden md:block size-9 text-white text-[30px] absolute mt-[120px] cursor-pointer font-bold slideLeft z-50">
                      <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="hidden md:block size-9 text-white text-[30px] absolute mx-16 mt-[120px] cursor-pointer right-0 font-bold slideRight z-50">
                      <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-bold text-[25px] text-white ">${item.display}</p> 
                  <div class="movie-slider flex gap-4 overflow-x-auto scrollbar-none py-5 px-10">
                      ${moviesListHTML}
                  </div>
              </div>`;
      })
    );
    moviesList.innerHTML = moviesHTML.join("");
    setupSliders();
  }
  generateMoviesList();
  // Movies by genre
  const moviesByGenre = document.querySelector(".moviesByGenre");

  async function genereMovieList() {
    const genreHTML = await Promise.all(
      genre.slice(0, 6).map(async (item) => {
        const listofmovies = await getMovieByGenreId(item.id);
        const moviesListHTML = listofmovies.results
          .map(
            (movie) => `
            <div class="movie-item  flex-shrink-0">
            <img src="${image_url}${
              movie.poster_path
            }" class="w-full h-[310px] object-cover rounded-lg hover:border-[4px] border-gray-400 hover:scale-110 transition-all duration-100 ease-in cursor-pointer" alt="${
              movie.title
            }">
                <div class="movie-info rounded-lg p-2  text-white  mt-2">
                    <div class="movie-year flex gap-2"><span class="bg-black bg-opacity-60 px-3 py-1 rounded-lg mr-2">${movie.release_date.slice(
                      0,
                      4
                    )}</span><div class="px-2 py-1 glass-effect rounded-lg flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-yellow-400">
                      <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                    </svg>

                    ${movie.vote_average.toFixed(1)}
                    </div>
</div>

                </div>
            </div>
            `
          )
          .join("");
        return `<div class="genre-section px-8 md:px-10 ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="hidden md:block size-9 text-white text-[30px] absolute mt-[220px] cursor-pointer font-bold slideLeft z-50">
                        <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="hidden md:block size-9 text-white text-[30px] absolute mx-16 mt-[220px] cursor-pointer right-0 font-bold slideRight z-50">
                        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-bold text-[25px] text-white py-4">${item.name}</p> 
                    <div class="movie-slider flex gap-4 overflow-x-auto scrollbar-none py-5 px-10 glass-effect rounded-lg">
                        ${moviesListHTML}
                    </div>
                </div>`;
      })
    );
    moviesByGenre.innerHTML = genreHTML.join("");
    setupSliders();
  }

  function setupSliders() {
    const genreSections = document.querySelectorAll(".genre-section");

    genreSections.forEach((section) => {
      const sliderDiv = section.querySelector(".movie-slider");
      const leftArrow = section.querySelector(".slideLeft");
      const rightArrow = section.querySelector(".slideRight");

      const imageElement = sliderDiv.querySelector("img");
      if (imageElement) {
        const imageWidth = 500;
        // const imageWidth = imageElement.offsetWidth;
        const scrollAmount = imageWidth;

        leftArrow.addEventListener("click", () => {
          sliderDiv.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
        });

        rightArrow.addEventListener("click", () => {
          sliderDiv.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        });
      }
    });
  }

  genereMovieList();
});
const searchButton = document.querySelector(".search-btn");
  const searchInput = document.querySelector(".search");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
    searchInput.innerHTML="";
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
      }
    }
  });
