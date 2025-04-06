document.getElementById('get-cat-btn').addEventListener('click', fetchRandomCat);

async function fetchRandomCat() {
    window.appCommon.showLoading();
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        if (!response.ok) {
            throw new Error('Failed to fetch cat image');
        }
        const data = await response.json();
        displayCat(data[0]);
    } catch (error) {
        window.appCommon.displayError('cat-result', error);
    } finally {
        window.appCommon.hideLoading();
    }
}

function displayCat(catData) {
    const resultDiv = document.getElementById('cat-result');
    resultDiv.innerHTML = `
        <div class="cat-container">
            <img src="${catData.url}" alt="Random Cat" class="cat-image">
            <p>Image ID: ${catData.id}</p>
            <p>Width: ${catData.width}px, Height: ${catData.height}px</p>
        </div>
    `;
}