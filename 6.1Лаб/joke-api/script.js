document.addEventListener('DOMContentLoaded', () => {

    const jokeBtn = document.getElementById('get-joke-btn');
    if (jokeBtn) {
        jokeBtn.addEventListener('click', fetchRandomJoke);
        
        fetchRandomJoke();
    }
});

async function fetchRandomJoke() {
    window.appCommon.showLoading();
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        displayJoke(data);
        
    } catch (error) {
        console.error('Ошибка при получении шутки:', error);
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
            <div class="joke-punchline hidden">${jokeData.punchline}</div>
            <button class="reveal-btn">Показать ответ</button>
            <div class="joke-meta">
                <span class="joke-type">Тип: ${jokeData.type}</span>
                <span class="joke-id">ID: ${jokeData.id}</span>
            </div>
        </div>
    `;
    
    const revealBtn = resultDiv.querySelector('.reveal-btn');
    const punchline = resultDiv.querySelector('.joke-punchline');
    
    revealBtn.addEventListener('click', () => {
        punchline.classList.toggle('hidden');
        revealBtn.textContent = punchline.classList.contains('hidden') 
            ? 'Показать ответ' 
            : 'Скрыть ответ';
    });
}

const jokeBtn = document.getElementById('get-joke-btn');
if (jokeBtn) {
    jokeBtn.addEventListener('click', fetchRandomJoke);
}