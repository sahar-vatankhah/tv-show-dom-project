

const showId = new URLSearchParams(window.location.search).get("id");

const cardsContainer = document.querySelector(".cards-container"); 
const dropDownMenu = document.querySelector("#select");

const getEpisodesData = async (showId) => {
  try {
    const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

const generateItems = async (showId) => {
  const episodesData = await getEpisodesData(showId);

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Episodes";
  dropDownMenu.append(allOption);

  episodesData.forEach((episode) => {
    const dropDownItem = document.createElement("option");
    dropDownItem.value = episode.id;
    dropDownItem.textContent = `S${episode.season}-E${episode.number} ${episode.name}`;
    dropDownMenu.append(dropDownItem);
  });

  dropDownMenu.addEventListener("change", (e) => {
    const selectedEpisodeId = e.target.value;
    cardsContainer.innerHTML = "";

    if (selectedEpisodeId === "all") {
      generateEpisode(showId);
    } else {
      const selectedEpisode = episodesData.find(
        (episode) => episode.id === parseInt(selectedEpisodeId)
      );
      generateEpisode(null, [selectedEpisode]);
    }
  });
}

async function generateEpisode(showId, data = null) {
  const episodesData = data || await getEpisodesData(showId);

  episodesData.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card", "col-6", "col-sm-4", "col-lg-3", "p-0", "text-white");
    cardsContainer.append(episodeCard);

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("h-176");
    episodeCard.append(imgContainer);

    const img = document.createElement("img");
    if (episode.image && episode.image.medium) {
      img.src = episode.image.medium;
    } else {
      img.src = '';
    }
    img.classList.add("w-100");
    imgContainer.append(img);

    const content = document.createElement("div");
    content.classList.add("p-3", "pb-5", "position-relative");
    episodeCard.append(content);

    const title = document.createElement("h3");
    title.classList.add("text-white", "fs-6");
    title.textContent = `S${episode.season}-E${episode.number} ${episode.name}`;
    content.append(title);

    const link = document.createElement("a");
    link.href = episode.url;
    link.classList.add("position-absolute", "bottom-0", "end-0", "px-3", "py-1");
    content.append(link);

    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-play-circle-fill", "text-success", "fs-2");
    link.append(icon);
  });

  // Event listeners for episode summaries
  const episodeMouse = document.querySelectorAll(".episode-card h3");
  episodeMouse.forEach((title) => {
    title.addEventListener("mouseover", (e) => {
      const episode = episodesData.find((ep) => title.innerText.includes(ep.name));
      if (episode) {
        const prevElement = title.parentElement.previousElementSibling;
        if (prevElement) {
          prevElement.innerHTML = episode.summary;
          prevElement.classList.add("overflow-hidden", "fs-7", "p-3");
        }
      }
    });

    title.addEventListener("mouseout", (e) => {
      const episode = episodesData.find((ep) => title.innerText.includes(ep.name));
      if (episode) {
        let imageUrl = '';
        if (episode.image && episode.image.medium) {
          imageUrl = episode.image.medium;
        }
        const prevElement = title.parentElement.previousElementSibling;
        if (prevElement) {
          prevElement.innerHTML = `<img src="${imageUrl}" class="w-100"/>`;
          prevElement.classList.remove("overflow-hidden", "fs-7", "p-3");
        }
      }
    });
  });
}


generateItems(showId);
generateEpisode(showId);
