const form = document.getElementById("search-container");
const input = document.getElementById("city-search");
const searchErrorText = document.getElementById("search-error");
const adviceText = document.getElementById("advice-text");
const backButton = document.getElementById("back-button");

form.addEventListener("submit", handleSearch);

async function handleSearch(e) {
    e.preventDefault();

    const city = input.value;

    try {
        const data = await fetchWeather(city);
        updateUI(data);
        showView("city-view")

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

function showView(viewId) {
    const views = document.querySelectorAll("main section");

    views.forEach(view => {
        view.classList.add("hidden");
    });

    document.getElementById(viewId).classList.remove("hidden");

    if (viewId === "start-view") {
        backButton.classList.add("hidden");
    } else {
        backButton.classList.remove("hidden");
    }
}

function updateUI(data) {
    document.querySelector("#city-and-weather-info h2").textContent =
        data.name;

    document.querySelector("#city-and-weather-info p").textContent =
        data.sys.country;

    document.getElementById("degree-data-display").textContent =
        Math.round(data.main.temp) + "°C";

    document.getElementById("wind-data-display").textContent =
        Math.round(data.wind.speed) + " m/s";

    const result = getSkateAdvice(data);
    updateSkateUI(result);
}

function getSkateAdvice(data) {
    const temp = data.main.temp;
    const wind = data.wind.speed;
    const weather = data.weather[0].main.toLowerCase();

    let condition = "good";
    let text = "Perfect skate conditions, go skate!"

    if (weather.includes("rain")) {
        condition = "rain";
        text = "It seems to be a rainy day, we suggest you go skate your closest indoor skatepark.";
    } else if (wind > 8) {
        condition = "wind";
        text = "It's possible to skate but it might be a bit windy, you should give it a try or skate indoors."
    } else if (temp < 3) {
        condition = "cold";
        text = "Unfortunately it’s waaaaay to cold to go out and skate. Pray to god that there is an indoor skatepark open!";
    } else if (temp > 18) {
        condition = "warm";
        text = "It's a bit hot today, bring much water to the session!"
    }

    return {
        text: text,
        condition: condition,
        weather: weather
    };
}

function updateSkateUI(result) {
    adviceText.textContent = result.text;

    document.body.classList.remove("sunny", "rainy", "cloudy", "cold");
    document.documentElement.classList.remove("sunny", "rainy", "cloudy", "cold");

    if (result.weather.includes("rain")) {
        document.body.classList.add("rainy");
        document.documentElement.classList.add("rainy");
    } else if (result.weather.includes("cloud")) {
        document.body.classList.add("cloudy");
        document.documentElement.classList.add("cloudy");
    } else if (result.weather.includes("snow")) {
        document.body.classList.add("cold");
        document.documentElement.classList.add("cold");
    } else {
        document.body.classList.add("sunny");
        document.documentElement.classList.add("sunny");
    }
    updateIcon(result.weather);
}

function updateIcon(weather) {
    let type;

    if (weather.includes("rain")) type = "rain";
    else if (weather.includes("cloud")) type = "cloud";
    else if (weather.includes("snow")) type = "snow";
    else type = "sun";

    const icons = {
        rain: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M49.9996 12.5041C63.2021 12.5041 70.6912 21.2428 71.7804 31.7963H72.1137C80.61 31.7963 87.4975 38.6659 87.4975 47.14C87.4975 55.6142 80.61 62.4842 72.1137 62.4842L69.6854 62.4833L69.6746 62.5008H68.5754C68.4908 62.7404 68.3754 62.9733 68.2283 63.1942L64.0633 69.4442C63.1062 70.8804 61.1658 71.2688 59.7296 70.3117C58.2937 69.3546 57.905 67.4142 58.8621 65.9783L61.1912 62.4833H53.5687L53.5579 62.5008H51.9058C51.8212 62.7404 51.7062 62.9729 51.5587 63.1938L47.3937 69.4438C46.4366 70.88 44.4966 71.2683 43.0604 70.3113C41.6242 69.3542 41.2358 67.4138 42.1929 65.9775L44.5216 62.4833H37.4478L37.4372 62.5008H35.2401C35.1555 62.7404 35.0401 62.9733 34.8929 63.1942L30.7278 69.4442C29.7707 70.8804 27.8306 71.2688 26.3943 70.3117C24.9581 69.3546 24.5698 67.4142 25.5269 65.9783L27.8555 62.4842C19.3732 62.4675 12.502 55.6042 12.502 47.14C12.502 38.6659 19.3895 31.7963 27.8858 31.7963H28.2188C29.3144 21.1734 36.7975 12.5041 49.9996 12.5041ZM49.9996 18.744C41.3692 18.744 33.8467 25.5492 33.8467 34.9491C33.8467 36.4385 32.5178 37.6072 30.9961 37.6072L28.1188 37.6071C22.8646 37.6071 18.6053 41.7792 18.6053 46.9254C18.6053 52.0721 22.8646 56.2442 28.1188 56.2442H71.8808C77.135 56.2442 81.3941 52.0721 81.3941 46.9254C81.3941 41.7792 77.135 37.6071 71.8808 37.6071L69.0033 37.6072C67.4816 37.6072 66.1525 36.4385 66.1525 34.9491C66.1525 25.4286 58.6304 18.744 49.9996 18.744ZM29.692 78.4771C28.7349 79.9129 29.1233 81.8533 30.5595 82.8104C31.9956 83.7675 33.9358 83.3792 34.8929 81.9429L39.058 75.6929C40.0151 74.2567 39.6267 72.3167 38.1905 71.3596C36.7543 70.4025 34.8142 70.7908 33.8571 72.2271L29.692 78.4771ZM47.2262 82.8092C45.79 81.8521 45.4016 79.9121 46.3587 78.4758L50.5237 72.2258C51.4808 70.7896 53.4208 70.4013 54.8571 71.3583C56.2933 72.3154 56.6816 74.2558 55.7246 75.6921L51.5596 81.9417C50.6025 83.3779 48.6625 83.7663 47.2262 82.8092Z" fill="white"/>
</svg>
`,
        cloud: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M50 22.9167C39.9449 22.9167 31.7369 30.8331 31.271 40.7713C31.1928 42.4383 29.8184 43.75 28.1494 43.75H27.0834C20.1798 43.75 14.5834 49.3463 14.5834 56.25C14.5834 63.1538 20.1798 68.75 27.0834 68.75H72.9167C79.8205 68.75 85.4167 63.1538 85.4167 56.25C85.4167 49.3463 79.8205 43.75 72.9167 43.75H71.8509C70.1817 43.75 68.8071 42.4383 68.7292 40.7713C68.2634 30.8331 60.055 22.9167 50 22.9167ZM25.3326 37.5807C27.2837 25.7162 37.5843 16.6667 50 16.6667C62.4159 16.6667 72.7163 25.7162 74.6675 37.5807C84.2021 38.4635 91.6667 46.485 91.6667 56.25C91.6667 66.6054 83.2721 75 72.9167 75H27.0834C16.728 75 8.33337 66.6054 8.33337 56.25C8.33337 46.485 15.7982 38.4635 25.3326 37.5807Z" fill="white"/>
</svg>
`,
        snow: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M48.9584 8.33333C50.6842 8.33333 52.0834 9.73245 52.0834 11.4583V24.6036L60.973 15.7141C62.1934 14.4937 64.1717 14.4937 65.3921 15.7141C66.6125 16.9345 66.6125 18.9132 65.3921 20.1335L52.0834 33.4424V45.8333H64.4742L77.783 32.5245C79.0034 31.3041 80.9821 31.3041 82.2025 32.5245C83.423 33.7449 83.423 35.7235 82.2025 36.9439L73.313 45.8333H86.4584C88.1842 45.8333 89.5834 47.2325 89.5834 48.9583C89.5834 50.6842 88.1842 52.0833 86.4584 52.0833H73.313L82.2025 60.9729C83.423 62.1933 83.423 64.1717 82.2025 65.3921C80.9821 66.6125 79.0034 66.6125 77.783 65.3921L64.4742 52.0833H52.0834V64.4742L65.3921 77.7829C66.6125 79.0033 66.6125 80.9821 65.3921 82.2025C64.1717 83.4229 62.1934 83.4229 60.973 82.2025L52.0834 73.3129V86.4583C52.0834 88.1842 50.6842 89.5833 48.9584 89.5833C47.2325 89.5833 45.8334 88.1842 45.8334 86.4583V73.3129L36.944 82.2025C35.7235 83.4229 33.7449 83.4229 32.5245 82.2025C31.3041 80.9821 31.3041 79.0033 32.5245 77.7829L45.8334 64.4742V52.0833H33.4425L20.1336 65.3921C18.9132 66.6125 16.9346 66.6125 15.7142 65.3921C14.4938 64.1717 14.4938 62.1933 15.7142 60.9729L24.6036 52.0833H11.4584C9.7325 52.0833 8.33337 50.6842 8.33337 48.9583C8.33337 47.2325 9.7325 45.8333 11.4584 45.8333H24.6036L15.7142 36.9439C14.4938 35.7235 14.4938 33.7449 15.7142 32.5245C16.9346 31.3041 18.9132 31.3041 20.1336 32.5245L33.4425 45.8333H45.8334V33.4424L32.5245 20.1335C31.3041 18.9132 31.3041 16.9345 32.5245 15.7141C33.7449 14.4937 35.7235 14.4937 36.944 15.7141L45.8334 24.6036V11.4583C45.8334 9.73245 47.2325 8.33333 48.9584 8.33333Z" fill="white"/>
</svg>
`,
        sun: `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M50 8.33333C51.7258 8.33333 53.125 9.73245 53.125 11.4583V17.7083C53.125 19.4342 51.7258 20.8333 50 20.8333C48.2742 20.8333 46.875 19.4342 46.875 17.7083V11.4583C46.875 9.73245 48.2742 8.33333 50 8.33333ZM50 70.8333C61.5058 70.8333 70.8333 61.5058 70.8333 50C70.8333 38.4941 61.5058 29.1667 50 29.1667C38.4941 29.1667 29.1666 38.4941 29.1666 50C29.1666 61.5058 38.4941 70.8333 50 70.8333ZM50 64.5833C41.9458 64.5833 35.4166 58.0542 35.4166 50C35.4166 41.9458 41.9458 35.4167 50 35.4167C58.0541 35.4167 64.5833 41.9458 64.5833 50C64.5833 58.0542 58.0541 64.5833 50 64.5833ZM88.5416 53.125C90.2675 53.125 91.6667 51.7258 91.6667 50C91.6667 48.2742 90.2675 46.875 88.5416 46.875H82.2916C80.5658 46.875 79.1666 48.2742 79.1666 50C79.1666 51.7258 80.5658 53.125 82.2916 53.125H88.5416ZM50 79.1667C51.7258 79.1667 53.125 80.5658 53.125 82.2917V88.5417C53.125 90.2675 51.7258 91.6667 50 91.6667C48.2742 91.6667 46.875 90.2675 46.875 88.5417V82.2917C46.875 80.5658 48.2742 79.1667 50 79.1667ZM17.7083 53.125C19.4342 53.125 20.8333 51.7258 20.8333 50C20.8333 48.2742 19.4342 46.875 17.7083 46.875H11.4583C9.73244 46.875 8.33331 48.2742 8.33331 50C8.33331 51.7258 9.73244 53.125 11.4583 53.125H17.7083ZM17.5819 17.5835C18.8023 16.3631 20.781 16.3631 22.0014 17.5835L28.2514 23.8335C29.4717 25.0539 29.4717 27.0325 28.2514 28.2529C27.031 29.4733 25.0523 29.4733 23.8319 28.2529L17.5819 22.0029C16.3616 20.7825 16.3616 18.8039 17.5819 17.5835ZM22.0014 82.4196C20.781 83.64 18.8023 83.64 17.5819 82.4196C16.3616 81.1992 16.3616 79.2204 17.5819 78L23.8319 71.75C25.0523 70.5296 27.031 70.5296 28.2514 71.75C29.4717 72.9704 29.4717 74.9492 28.2514 76.1696L22.0014 82.4196ZM82.4179 17.5835C81.1975 16.3631 79.2192 16.3631 77.9987 17.5835L71.7487 23.8335C70.5283 25.0539 70.5283 27.0325 71.7487 28.2529C72.9692 29.4733 74.9475 29.4733 76.1679 28.2529L82.4179 22.0029C83.6383 20.7825 83.6383 18.8039 82.4179 17.5835ZM77.9987 82.4196C79.2192 83.64 81.1975 83.64 82.4179 82.4196C83.6383 81.1992 83.6383 79.2204 82.4179 78L76.1679 71.75C74.9475 70.5296 72.9692 70.5296 71.7487 71.75C70.5283 72.9704 70.5283 74.9492 71.7487 76.1696L77.9987 82.4196Z" fill="white"/>
</svg>`
    };

    document.getElementById("weather-icon").innerHTML = icons[type];
}

backButton.addEventListener("click", () => {
    showView("start-view");
    document.body.classList.remove("sunny", "rainy", "cloudy", "cold");
    document.documentElement.classList.remove("sunny", "rainy", "cloudy", "cold");
});