const form = document.getElementById("search-container");
const input = document.getElementById("city-search");
const searchErrorText = document.getElementById("search-error");

form.addEventListener("submit", handleSearch);

async function handleSearch(e) {
    e.preventDefault();

    const city = input.value;

    try {
        const data = await fetchWeather(city);

    } catch (error) {
        searchErrorText.textContent = "Could not find city, try a nearby city."
    }
}

async function fetchWeather(city) {
    const apiKey = "0e745a0124c68a6e7e65e6f3eac0dc10";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();
    console.log(data);
    return data;
}