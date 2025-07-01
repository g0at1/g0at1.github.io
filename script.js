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

function calculateDuration(startText, endText) {
  const [startMonthStr, startYearStr] = startText.split('.');
  const startMonth = parseInt(startMonthStr, 10) - 1;
  const startYear = parseInt(startYearStr, 10);

  let endMonth, endYear;
  if (endText.toLowerCase() === 'present') {
    const now = new Date();
    endMonth = now.getMonth() + 1;
    endYear = now.getFullYear();
    if (endMonth > 11) {
      endMonth = 0;
      endYear += 1;
    }
  } else {
    const [endMonthStr, endYearStr] = endText.split('.');
    endMonth = parseInt(endMonthStr, 10) - 1;
    endYear = parseInt(endYearStr, 10);
  }

  const dateStart = new Date(startYear, startMonth, 1);
  const dateEnd = new Date(endYear, endMonth, 1);

  let years = dateEnd.getFullYear() - dateStart.getFullYear();
  let months = dateEnd.getMonth() - dateStart.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
}

function formatDuration({ years, months }) {
  let parts = [];
  if (years > 0) {
    if (years === 1) {
      parts.push('1 year');
    } else if (years < 5) {
      parts.push(years + ' years');
    } else {
      parts.push(years + ' year');
    }
  }
  if (months > 0) {
    parts.push(months + ' months');
  }
  if (parts.length === 0) {
    return 'lower than month';
  }
  return parts.join(' ');
}

function appendDurationsToPeriods() {
  const periodElements = document.querySelectorAll('.card__period');

  periodElements.forEach((el) => {
    const fullText = el.textContent.trim();

    const [rawStart, rawEnd] = fullText.split('–').map((s) => s.trim());

    if (!rawStart || !rawEnd) return;

    const duration = calculateDuration(rawStart, rawEnd);
    const durationText = formatDuration(duration);

    const span = document.createElement('span');
    span.classList.add('card__duration');
    span.textContent = '· ' + durationText;

    el.style.position = 'relative';
    span.style.position = 'absolute';
    span.style.right = '0';
    span.style.top = '0';
    span.style.color = '#888';
    span.style.fontStyle = 'italic';
    el.appendChild(span);
  });
}

async function loadProjects() {
  try {
    const res = await fetch('./public/projects.json');
    const projects = await res.json();

    const container = document.getElementById('projects-container');

    projects.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('project-card');

      card.innerHTML = `
        <div class="project-card__header">
          <strong>${p.title}</strong>
        </div>
        <p class="project-card__desc">
          ${p.description}
        </p>
        <div class="project-card__footer">
          <span class="project-card__tech">
            <i class="${p.techIconClass}"></i>
          </span>
          <a href="${p.repoUrl}" target="_blank" class="project-card__link">
            GitHub Repo
          </a>
        </div>
      `.trim();

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading projects:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  appendDurationsToPeriods();
  loadProjects();
});
