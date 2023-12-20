const apiKey = "fca8d2b31399dd1b21fac6cbcb65e3cc";
const baseUrl = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original/";

const apiPaths = {
    fetchAllCategories: `${baseUrl}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${baseUrl}/trending/all/day?api_key=${apiKey}&language=en-US`
};

function init() {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    })
    .catch(err => {
        console.error(err);
    });
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
    <h2 class="banner-title">${movie.title && movie.title.length > 22 ? movie.title.slice(0,22).trim()+ '...':movie.title}</h2>
    <p class="banner-info">Trending Now | Released - ${movie.release_date}</p>
    <p class="banner-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview}</p>
    <div class="action-btn-cont">
        <button class="action-btn"><img src="/images/play-icon.png"> Play</button>
        <button class="action-btn">More Info</button>
    </div>
    `
    div.className = "banner-content";
    bannerCont.append(div);
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length) {
            categories.forEach(category => {
                fetchAndBuildMovieSection(
                    apiPaths.fetchMoviesList(category.id), 
                    category.name
                );
            });
        }
        // console.table(movies);
    })
    .catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results)
        const movies = res.results;
        if(Array.isArray(movies) && movies.length) {
            buildMovieSection(movies, categoryName);
        }
        return movies;
    })
    .catch(err => console.error(err))
}

function buildMovieSection(list, categoryName) {
    // console.log(list, categoryName);

    const moviesCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item => {
        return `
        <img src="${imgPath}${item.backdrop_path}" alt="${item.title}" class="movie-item">
        `;
    }).join('');

    const moviesSectionHTML = `
    <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All ></span></h2>
    <div class="movies-row">
        ${moviesListHTML}
    </div>
    `

    // console.log(moviesSectionHTML);

    const div = document.createElement('div');

    div.className = "movies-section";
    div.innerHTML = moviesSectionHTML;

    moviesCont.append(div);
}

window.addEventListener('load', function() {
    init();
    window.addEventListener('scroll', function(){
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('bg-dark')
        else header.classList.remove('bg-dark');
    })
})