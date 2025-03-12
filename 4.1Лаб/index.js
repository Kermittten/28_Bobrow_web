document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
  
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      themeToggle.textContent = body.classList.contains('dark-theme') ? 'Светлая тема' : 'Тёмная тема';
    });
  
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewForm = document.getElementById('review-form');
    const sortReviews = document.getElementById('sort-reviews');
    const filterRating = document.getElementById('filter-rating');
  
    let reviews = [
      { name: 'Иван', text: 'Ложка просто огонь!', rating: 5, date: new Date() },
      { name: 'Мария', text: 'Теперь суп — это наслаждение!', rating: 4, date: new Date() },
    ];
  
    function renderReviews() {
      reviewsContainer.innerHTML = '';
      const filteredReviews = filterRating.value === '0' ? reviews : reviews.filter(review => review.rating >= parseInt(filterRating.value));
      const sortedReviews = sortReviews.value === 'date' ? filteredReviews.sort((a, b) => b.date - a.date) : filteredReviews.sort((a, b) => b.rating - a.rating);
  
      sortedReviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');
        reviewElement.innerHTML = `
          <p>"${review.text}"</p>
          <span>— ${review.name} (${review.rating} звезд)</span>
        `;
        reviewsContainer.appendChild(reviewElement);
      });
    }
  
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('review-name').value;
      const text = document.getElementById('review-text').value;
      const rating = parseInt(document.getElementById('review-rating').value);
  
      if (name && text && rating >= 1 && rating <= 5) {
        reviews.push({ name, text, rating, date: new Date() });
        renderReviews();
        reviewForm.reset();
      } else {
        alert('Пожалуйста, заполните все поля корректно.');
      }
    });
  
    sortReviews.addEventListener('change', renderReviews);
    filterRating.addEventListener('change', renderReviews);
  
    renderReviews();
  });