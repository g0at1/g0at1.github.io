function toggleDetails(headerElement) {
  const details = headerElement.nextElementSibling;
  const toggleArrow = headerElement.querySelector('.card__toggle');

  if (!details) return;

  if (details.style.display === 'block') {
    details.style.display = 'none';
    toggleArrow.style.transform = 'rotate(0deg)';
  } else {
    details.style.display = 'block';
    toggleArrow.style.transform = 'rotate(180deg)';
  }
}

