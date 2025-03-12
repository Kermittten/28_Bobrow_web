document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    themeToggle.textContent = body.classList.contains('dark-theme') ? 'Светлая тема' : 'Тёмная тема';
  });

  const reviewsContainer = document.getElementById('reviews-container');
  const reviewForm = document.getElementById('review-form');

  let reviews = [
    { name: 'Данил Андреев', text: 'Серёжаааа сбрил брови сыну!', rating: 5, date: new Date() },
    { name: 'Рахат Лукум', text: 'Ваше пушка!', rating: 4, date: new Date() },
    { name: 'Витя АК-47', text: 'Чувствую как становлюсь выше!', rating: 5, date: new Date() },
  ];

  function renderReviews() {
    reviewsContainer.innerHTML = '';
    reviews.forEach(review => {
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

  renderReviews();
});