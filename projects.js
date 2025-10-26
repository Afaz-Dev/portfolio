async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    const projects = await response.json();

    generateDesktopCarousel(projects);
    generateMobileCarousel(projects);

    return Promise.resolve();
  } catch (error) {
    console.error('Error loading projects:', error);
    return Promise.reject(error);
  }
}

function generateDesktopCarousel(projects) {
  const carouselIndicators = document.querySelector('#customCarousel .carousel-indicators');
  const carouselInner = document.querySelector('#customCarousel .carousel-inner');

  carouselIndicators.innerHTML = '';
  carouselInner.innerHTML = '';

  projects.forEach((project, index) => {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.setAttribute('data-bs-target', '#customCarousel');
    indicator.setAttribute('data-bs-slide-to', index);
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    if (index === 0) {
      indicator.classList.add('active');
      indicator.setAttribute('aria-current', 'true');
    }
    carouselIndicators.appendChild(indicator);

    const carouselItem = document.createElement('div');
    carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';

    const mediaElement = createMediaElement(project);

    carouselItem.innerHTML = `
      <div class="carousel-content">
        <div class="project-layout">
          <div class="project-video">
            ${mediaElement}
          </div>
          <div class="project-info">
            <h3 class="project-title">
              <strong><span class="text-${project.highlightColor}">${project.titleHighlight}</span> ${project.title.replace(project.titleHighlight, '')}</strong>
            </h3>
            <p class="project-description">
              ${project.description}
            </p>
            <a href="${project.projectLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              View Project
            </a>
          </div>
        </div>
      </div>
    `;

    carouselInner.appendChild(carouselItem);
  });
}

function generateMobileCarousel(projects) {
  const cardCarousel = document.querySelector('.mobile-carousel .card-carousel');

  cardCarousel.innerHTML = '';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'carousel-card';

    const mediaElement = createMediaElement(project);

    card.innerHTML = `
      ${mediaElement}
      <h5><span class="text-${project.highlightColor}">${project.titleHighlight}</span> ${project.title.replace(project.titleHighlight, '')}</h5>
      <p>${project.description}</p>
      <a href="${project.projectLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        View Project
      </a>
    `;

    cardCarousel.appendChild(card);
  });
}

//The media stuff
function createMediaElement(project) {
  if (project.mediaType === 'youtube') {
    return `<iframe src="${project.mediaUrl}" allowfullscreen title="${project.title}"></iframe>`;
  } else if (project.mediaType === 'image') {
    return `<img src="${project.mediaUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">`;
  }
  return '';
}

function initializeSwipeHint() {
  const container = document.getElementById('projectCarouselContainer');
  const hint = document.getElementById('swipeHint');
  const hintText = hint?.querySelector('.swipe-text');

  if (!container || !hint || !hintText) return;

  container.addEventListener('scroll', () => {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (scrollLeft >= maxScroll - 10) {
      hintText.textContent = '← swipe left';
      hintText.style.animation = 'swipeAnimationLeft 2s ease-in-out infinite';
    } else {
      hintText.textContent = 'swipe right →';
      hintText.style.animation = 'swipeAnimation 2s ease-in-out infinite';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProjects().then(() => {
    initializeSwipeHint();
  });
});
