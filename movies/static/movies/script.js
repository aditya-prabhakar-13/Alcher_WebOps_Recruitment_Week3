
const apiUrl = "https://jsonfakery.com/movies/paginated";
const container = document.querySelector("main");
let allMovies = [];

async function fetchMovies(sectionTitle) {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    allMovies = allMovies.concat(data.data || []);
    displayMovies(data.data || [], sectionTitle);
  } catch (err) {
    console.error("Failed to fetch movies:", err);
  }
}

function displayMovies(movies, title) {
  const section = document.createElement("section");
  section.classList.add("section");
  section.innerHTML = `<h2>${title}</h2><div class="scroll-container"></div>`;

  const scrollContainer = section.querySelector(".scroll-container");

  movies.forEach((movie) => {
    const movieTitle = movie.original_title || "Untitled";
    const poster = movie.poster_path || "https://via.placeholder.com/150x220?text=No+Image";

    const card = document.createElement("div");
    card.className = "card clickable";
    card.style.backgroundImage = `url(${poster})`;
    card.innerHTML = `<div class="overlay">${movieTitle}</div>`;
    card.addEventListener("click", () => showPopup(movie));
    scrollContainer.appendChild(card);
  });

  container.appendChild(section);
  enableHorizontalDrag(scrollContainer);
}

function showPopup(movie) {
  const title = movie.original_title || "Untitled";
  const poster = movie.poster_path || "https://via.placeholder.com/300x450?text=No+Image";
  const description = movie.overview || "No description available.";
  const cast = movie.casts || [];

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.style.backgroundImage = `url(${poster})`;
  popup.style.backgroundSize = "cover";
  popup.style.backgroundPosition = "center";
  popup.style.backdropFilter = "blur(10px)";

  popup.innerHTML = `
    <div class="popup-content" style="background-color: rgba(0, 0, 0, 0.75); width: 100%; max-width: none; height: 100vh; overflow-y: auto; padding: 2rem;">
      <button class="close">&times;</button>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
        <img src="${poster}" alt="${title}" style="max-width: 200px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.6);" />
        <div style="flex: 1; min-width: 250px;">
          <h2>${title}</h2>
          <p>${description}</p>
        </div>
      </div>
      <h3 style="margin-top: 2rem;">Cast of ${title}</h3>
      <div class="cast-list" style="display: flex; gap: 1.5rem; overflow-x: auto; padding-top: 1rem;">
        ${cast.map(actor => {
          const photo = actor?.photo?.startsWith('http') ? actor.photo : 'https://via.placeholder.com/100?text=No+Photo';
          return `
            <div class="cast-member" style="text-align: center;">
              <img 
                src="${photo}"
                alt="${actor?.name || 'Unknown'}"
                style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 0.5rem;"
              />
              <p style="font-size: 0.9rem; color: #fff;">${actor?.name || 'Unknown'}</p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(popup);
  popup.querySelector(".close").addEventListener("click", () => popup.remove());
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const results = allMovies.filter(m => m.original_title?.toLowerCase().includes(term));
    container.innerHTML = "";
    displayMovies(results, `Search Results for "${term}"`);
  });
}

function enableHorizontalDrag(container) {
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener('mousedown', (e) => {
    isDown = true;
    container.classList.add('dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.classList.remove('dragging');
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // scroll speed
    container.scrollLeft = scrollLeft - walk;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("nav button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  fetchMovies("Binge-Worthy Shows");
  fetchMovies("Most Popular in India");
  fetchMovies("Featured Movies");
  setupSearch();
});