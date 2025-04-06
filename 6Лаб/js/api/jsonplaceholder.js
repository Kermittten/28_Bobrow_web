const getBtn = document.getElementById('json-get-btn');
const postBtn = document.getElementById('json-post-btn');
const putBtn = document.getElementById('json-put-btn');
const patchBtn = document.getElementById('json-patch-btn');
const deleteBtn = document.getElementById('json-delete-btn');
const resultDiv = document.getElementById('json-result');

getBtn.addEventListener('click', fetchPost);
postBtn.addEventListener('click', createPost);
putBtn.addEventListener('click', updatePost);
patchBtn.addEventListener('click', partialUpdatePost);
deleteBtn.addEventListener('click', deletePost);

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function displayPosts(posts) {
    resultDiv.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-title">${post.title}</div>
            <div class="post-body">${post.body}</div>
            <p class="post-id">ID: ${post.id}</p>
        </div>
    `).join('');
}

function displayPost(post) {
    resultDiv.innerHTML = `
        <div class="post-item">
            <div class="post-title">${post.title}</div>
            <div class="post-body">${post.body}</div>
            <p class="post-id">ID: ${post.id}</p>
        </div>
    `;
}

function displayMessage(message) {
    resultDiv.innerHTML = `<div class="post-item">${message}</div>`;
}

async function fetchPost() {
    window.appCommon.showLoading();
    
    try {
        const randomId = Math.floor(Math.random() * 100) + 1;
        const response = await fetch(`${API_URL}/${randomId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        const data = await response.json();
        displayPost(data);
    } catch (error) {
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
                title: 'New Post',
                body: 'This is a newly created post.',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.status}`);
        }
        
        const data = await response.json();
        displayMessage(`Post created successfully with ID: ${data.id}`);
    } catch (error) {
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
                title: 'Updated Post',
                body: 'This post has been fully updated.',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update post: ${response.status}`);
        }
        
        const data = await response.json();
        displayMessage(`Post ${data.id} updated successfully`);
    } catch (error) {
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
                title: 'Partially Updated Post',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        if (!response.ok) {
            throw new Error(`Failed to partially update post: ${response.status}`);
        }
        
        const data = await response.json();
        displayMessage(`Post ${data.id} partially updated. New title: "${data.title}"`);
    } catch (error) {
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
            throw new Error(`Failed to delete post: ${response.status}`);
        }
        
        displayMessage(`Post ${randomId} deleted successfully`);
    } catch (error) {
        window.appCommon.displayError('json-result', error);
    } finally {
        window.appCommon.hideLoading();
    }
}