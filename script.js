document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Toggle
    const toggleButton = document.querySelector(".toggle-darkmode");
    function setDarkMode(isDark) {
        document.body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("darkMode", isDark);
    }
    toggleButton.addEventListener("click", () => {
        setDarkMode(!document.body.classList.contains("dark-mode"));
    });
    setDarkMode(localStorage.getItem("darkMode") === "true");
    
    // Handle displaying form data on page2.html
    if (document.getElementById("output")) {
        const params = new URLSearchParams(location.search);
        let outputHTML = "";
        params.forEach((value, key) => {
            outputHTML += `<div><strong>${key}:</strong> ${value}</div>`;
        });
        document.getElementById("output").innerHTML = outputHTML;
    }
});
