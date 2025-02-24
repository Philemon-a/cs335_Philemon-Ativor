document.addEventListener("DOMContentLoaded", async () => {
    const breedInput = document.getElementById("breed");
    const dataList = document.getElementById("breedsList");
    const message = document.getElementById("message");
    const imageContainer = document.getElementById("image-container");
    let interval;
    
    const toggleButton = document.querySelector(".toggle-darkmode");
    function setDarkMode(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("darkMode", isDark);
    }
    toggleButton.addEventListener("click", () => {
        setDarkMode(!document.body.classList.contains("dark-mode"));
    });
    setDarkMode(localStorage.getItem("darkMode") === "true");
    
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    const breeds = Object.keys(data.message);
    breeds.forEach(breed => {
        let option = document.createElement("option");
        option.value = breed;
        dataList.appendChild(option);
    });

    document.getElementById("showImages").addEventListener("click", async () => {
        clearInterval(interval);
        imageContainer.innerHTML = "";
        message.textContent = "";
        
        const breed = breedInput.value.toLowerCase();
        if (!breeds.includes(breed)) {
            message.textContent = "No such breed";
            return;
        }

        async function fetchImage() {
            const res = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
            const imgData = await res.json();
            if (imgData.status === "success") {
                imageContainer.innerHTML = `<img src="${imgData.message}" alt="${breed}">`;
            }
        }

        fetchImage(); // Fetch first image immediately
        interval = setInterval(fetchImage, 5000); // Fetch every 5 seconds
    });
});
