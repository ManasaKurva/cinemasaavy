const baseurl = "https://api.themoviedb.org/3";
const api_key = "b8d79da4a9edc6a843abd0e1ad21bb9c";
const image_url = "https://image.tmdb.org/t/p/original";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("query");

  if (query) {
    searchMovies(query);
  }

  document.getElementById("back-button").addEventListener("click", () => {
    window.location.href = "index.html";  // Navigate back to the main search page
  });
});

const getSearchResults = (moviename) => {
  return fetch(`${baseurl}/search/multi?query=${moviename}&api_key=${api_key}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
        console.log("results");
    console.log(data.results);
      return data.results;  // Return the results array directly
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

function searchMovies(query) {
    const searchTitle = document.querySelector(".search-title");
    searchTitle.innerHTML = `Search Results for "${query}"`
  getSearchResults(query).then((movieResults) => {
    const resultsContainer = document.querySelector(".container");
    const moviesResultHTML = movieResults.filter(movie => movie.poster_path && movie.overview && movie.release_date)
      .map(
        (movie) => `
        <div class="movie-item flex-shrink-0 flex gap-10 items-center justify-center mb-10 ml-20">
          <img src="${image_url}${movie.poster_path}" class="w-64 h-[400px] object-cover rounded-lg hover:border-[4px] border-gray-400 hover:scale-110 transition-all duration-100 ease-in cursor-pointer" alt="${movie.title}">
          <div class="content-container bottom-10 left-0 w-full h-[400px] p-6 rounded-lg flex flex-col gap-4 glass-effect p-10 mr-10">
            <div class="text-white text-5xl font-bold">${movie.title != null ? movie.title : movie.name}</div>
            <div class="flex gap-5">
              <span class="px-4 py-1 bg-black bg-opacity-60 rounded-lg">${movie.release_date != null ? movie.release_date.slice(0, 4) : movie.first_air_date.slice(0, 4)}</span>
              <span class="px-4 py-1 glass-effect rounded-lg">${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="w-3/4 text-wrap overflow-y-auto">${movie.overview}</div>
            <span class="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold search-btn flex gap-3 w-44 justify-center items-center" data-movie-id="${movie.id}">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd"/>
              </svg>
              Watch Now
            </span>
          </div>
        </div>
          `
      )
      .join("");
    if(movieResults.length > 0)
        resultsContainer.innerHTML = moviesResultHTML;
    else
        resultsContainer.innerHTML ="<p class='text-center text-white text-2xl mt-10'>No results found</p>";
  });
}
