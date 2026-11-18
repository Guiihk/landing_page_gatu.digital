const revealItems = document.querySelectorAll('.reveal');
const phoneInput = document.querySelector('input[name="phone"]');
const testimonialGallery = document.querySelector('#testimonial-gallery');
const testimonialControls = document.querySelector('.testimonial-controls');
const [previousTestimonial, nextTestimonial] = testimonialControls.querySelectorAll('button');

function updateTestimonialControls() {
  previousTestimonial.disabled = testimonialGallery.scrollLeft <= 1;
  nextTestimonial.disabled = testimonialGallery.scrollLeft >= testimonialGallery.scrollWidth - testimonialGallery.clientWidth - 1;
}

testimonialControls.hidden = false;
testimonialControls.querySelectorAll('button').forEach((button, index) => {
  button.addEventListener('click', () => {
    const step = testimonialGallery.children[1].offsetLeft - testimonialGallery.children[0].offsetLeft;
    testimonialGallery.scrollBy({
      left: index === 0 ? -step : step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
});
testimonialGallery.addEventListener('scroll', updateTestimonialControls);
window.addEventListener('resize', updateTestimonialControls);
updateTestimonialControls();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

phoneInput.addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if (digits.length > 2) formatted = `(${digits.slice(0, 2)})${digits.slice(2)}`;
  if (digits.length > 7) formatted = `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
  event.target.value = formatted;
});

document.querySelector('#lead-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const name = formData.get('name').trim();
  const service = formData.get('service');
  const message = `Oi meu nome é ${name} e queria saber mais sobre ${service}`;
  window.location.href = `https://wa.me/5531975625629?text=${encodeURIComponent(message)}`;
});
