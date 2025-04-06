document.getElementById('get-joke-btn').addEventListener('click', fetchRandomJoke);

async function fetchRandomJoke() {
    window.appCommon.showLoading();
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }
        const data = await response.json();
        displayJoke(data);
    } catch (error) {
        window.appCommon.displayError('joke-result', error);
    } finally {
        window.appCommon.hideLoading();
    }
}

function displayJoke(jokeData) {
    const resultDiv = document.getElementById('joke-result');
    resultDiv.innerHTML = `
        <div class="joke-container">
            <div class="joke-setup">${jokeData.setup}</div>
            <div class="joke-punchline">${jokeData.punchline}</div>
            <p class="joke-info">Type: ${jokeData.type} | ID: ${jokeData.id}</p>
        </div>
    `;
}