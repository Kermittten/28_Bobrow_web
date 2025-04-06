document.addEventListener('DOMContentLoaded', () => {
    const getBtn = document.getElementById('json-get-btn');
    const postBtn = document.getElementById('json-post-btn');
    const putBtn = document.getElementById('json-put-btn');
    const patchBtn = document.getElementById('json-patch-btn');
    const deleteBtn = document.getElementById('json-delete-btn');
    const resultDiv = document.getElementById('json-result');

    const API_URL = 'https://jsonplaceholder.typicode.com/posts';

    getBtn?.addEventListener('click', fetchRandomPost);
    postBtn?.addEventListener('click', createPost);
    putBtn?.addEventListener('click', updatePost);
    patchBtn?.addEventListener('click', partialUpdatePost);
    deleteBtn?.addEventListener('click', deletePost);

    async function fetchRandomPost() {
        window.appCommon.showLoading();
        try {
            const randomId = Math.floor(Math.random() * 100) + 1;
            const response = await fetch(`${API_URL}/${randomId}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            displayPost(data);
        } catch (error) {
            console.error('Ошибка при получении поста:', error);
            window.appCommon.displayError('json-result', error);
        } finally {
            window.appCommon.hideLoading();
        }
    }

    async function createPost() {
        window.appCommon.showLoading();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Новый пост',
                    body: 'Этот пост был создан через JSONPlaceholder API',
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            displayMessage(`Пост успешно создан! ID: ${data.id}`, 'success');
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            window.appCommon.displayError('json-result', error);
        } finally {
            window.appCommon.hideLoading();
        }
    }

    async function updatePost() {
        window.appCommon.showLoading();
        try {
            const randomId = Math.floor(Math.random() * 100) + 1;
            const response = await fetch(`${API_URL}/${randomId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: randomId,
                    title: 'Обновленный пост',
                    body: 'Этот пост был полностью обновлен через PUT запрос',
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            displayMessage(`Пост ${data.id} успешно обновлен (PUT)`, 'success');
            displayPost(data);
        } catch (error) {
            console.error('Ошибка при обновлении поста:', error);
            window.appCommon.displayError('json-result', error);
        } finally {
            window.appCommon.hideLoading();
        }
    }

    async function partialUpdatePost() {
        window.appCommon.showLoading();
        try {
            const randomId = Math.floor(Math.random() * 100) + 1;
            const response = await fetch(`${API_URL}/${randomId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    title: 'Частично обновленный пост',
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            displayMessage(
                `Пост ${data.id} частично обновлен (PATCH). Новый заголовок: "${data.title}"`,
                'success'
            );
            displayPost(data);
        } catch (error) {
            console.error('Ошибка при частичном обновлении поста:', error);
            window.appCommon.displayError('json-result', error);
        } finally {
            window.appCommon.hideLoading();
        }
    }

    async function deletePost() {
        window.appCommon.showLoading();
        try {
            const randomId = Math.floor(Math.random() * 100) + 1;
            const response = await fetch(`${API_URL}/${randomId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            displayMessage(`Пост ${randomId} успешно удален`, 'success');
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
            window.appCommon.displayError('json-result', error);
        } finally {
            window.appCommon.hideLoading();
        }
    }

    function displayPost(post) {
        resultDiv.innerHTML = `
            <div class="post-item">
                <div class="post-title">${post.title}</div>
                <div class="post-body">${post.body}</div>
                <p class="post-id">ID: ${post.id} | UserID: ${post.userId}</p>
            </div>
        `;
    }

    function displayMessage(message, type = 'info') {
        resultDiv.innerHTML = `
            <div class="${type === 'success' ? 'success-message' : 'error'}">
                ${message}
            </div>
        `;
    }

    fetchRandomPost();
});