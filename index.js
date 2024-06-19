 const generateCard = async (movieId, parentEle) => {
    const res = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
    const data = await res.json();
  
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    cardContainer.style.position = "relative"
  
    parentEle.append(cardContainer);
  
    const cardContainerImg = document.createElement("img");
    cardContainerImg.src= data.image.medium;
    cardContainer.append(cardContainerImg);
   
    const cardContainerContent = document.createElement("div");
    cardContainerContent.style.position = "absolute"
    cardContainerContent.style.bottom = "1px";
    cardContainerContent.style.left = "10px";
    cardContainer.append(cardContainerContent);
  
    const cardHeading = document.createElement("h3");
    cardHeading.textContent = data.name.split(" ").slice(0, 3).join(" ");
    cardHeading.style.color = "white";
    cardContainerContent.append(cardHeading);
  
    const cardGenres = document.createElement("p");
    cardGenres.textContent = data.genres.slice(0, 2)?.join(" | ");
    cardGenres.style.color = "white";
    cardContainerContent.append(cardGenres);
  
    const cardAverageRating = document.createElement("p");
    cardAverageRating.textContent = data.rating.average || "No Info";
    cardAverageRating.style.color = "white";
    cardContainerContent.append(cardAverageRating);
  
    
  
    cardContainer.addEventListener("click", () => {
      window.location.href = `./episodes.html?id=${data.id}`;
    });
  }
   
  
  const cardsSection = document.querySelector("#episode-container");
  const initialMoviesIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  for (let i = 0; i < initialMoviesIds.length; i++) {
    generateCard(initialMoviesIds[i], cardsSection);
  }
  
  
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm) {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
      const searchData = await res.json();
  
      cardsSection.innerHTML = "";
      searchData.forEach((result) => generateCard(result.show.id, cardsSection));
    } else {
      location.reload();
    }
  });
    