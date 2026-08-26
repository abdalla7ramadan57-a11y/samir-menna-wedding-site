const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const wedding = window.WEDDING;
const opening = $('#opening');
const invitation = $('#invitation');
const frame = $('#openInvitation');
const audio = $('#weddingMusic');
const musicToggle = $('#musicToggle');

function applyWeddingData() {
  const { personOne, personTwo } = wedding.couple;
  $('#openingNameOne').textContent = personOne;
  $('#openingNameTwo').textContent = personTwo;
  $$('[data-name="one"]').forEach((el) => { el.textContent = personOne; });
  $$('[data-name="two"]').forEach((el) => { el.textContent = personTwo; });
  const ceremony = wedding.venues.ceremony;
  const reception = wedding.venues.reception;
  $('#ceremonyName').textContent = ceremony.name;
  $('#ceremonyAddress').textContent = ceremony.address;
  $('#ceremonyMap').href = ceremony.mapsUrl;
  $('#receptionName').textContent = reception.name;
  $('#receptionAddress').textContent = reception.address;
  $('#receptionMap').href = reception.mapsUrl;
  $('#dressWomen').textContent = wedding.dressCode.women;
  $('#dressMen').textContent = wedding.dressCode.men;
  $('#giftMessage').textContent = wedding.giftMessage;
  $('#coordinatorName').textContent = wedding.coordinator.name;
  $('#songTitle').textContent = wedding.music.title;
  audio.src = wedding.music.src;
  $('#timeline').innerHTML = wedding.schedule.map((item, index) =>
    `<div class="timeline-row" style="transition-delay:${index * 100 + 180}ms"><time>${item.time}</time><i aria-hidden="true">♥</i><span>${item.title}</span></div>`
  ).join('');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    if (entry.target.closest('#program')) $('#timeline').classList.add('drawn');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

function enterInvitation() {
  opening.classList.add('opened');
  invitation.classList.add('active');
  invitation.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('is-locked');
  requestAnimationFrame(() => $$('.reveal').forEach((el) => observer.observe(el)));
}

frame.addEventListener('click', () => {
  if (frame.classList.contains('open')) return;
  frame.classList.add('open');
  setTimeout(enterInvitation, 950);
});

async function toggleMusic() {
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.textContent = 'Ⅱ';
      musicToggle.setAttribute('aria-pressed', 'true');
    } catch { /* user-controlled playback */ }
  } else {
    audio.pause();
    musicToggle.textContent = '▶';
    musicToggle.setAttribute('aria-pressed', 'false');
  }
}
musicToggle.addEventListener('click', toggleMusic);
$$('[data-skip]').forEach((button) => button.addEventListener('click', () => {
  audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + Number(button.dataset.skip)));
}));
audio.addEventListener('timeupdate', () => {
  $('#musicProgress').style.width = audio.duration ? `${(audio.currentTime / audio.duration) * 100}%` : '0%';
});

function updateCountdown() {
  const remaining = Math.max(0, new Date(wedding.date).getTime() - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60)
  };
  Object.entries(values).forEach(([key, value]) => {
    $(`#${key}`).textContent = String(value).padStart(key === 'days' ? 3 : 2, '0');
  });
}

const rsvpForm = $('#rsvpForm');
$('#showRsvp').addEventListener('click', () => {
  if (wedding.rsvp.url) {
    window.open(wedding.rsvp.url, '_blank', 'noopener');
    return;
  }
  rsvpForm.hidden = false;
  rsvpForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  rsvpForm.querySelector('input').focus({ preventScroll: true });
});
$('#closeRsvp').addEventListener('click', () => { rsvpForm.hidden = true; });
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const raw = Object.fromEntries(new FormData(rsvpForm));
  const clean = (value = '') => String(value).trim().replace(/\s+/g, ' ');
  const record = { name: clean(raw.name), attendance: raw.attendance, guests: Number(raw.guests || 1), dietary: clean(raw.dietary), message: clean(raw.message), savedAt: new Date().toISOString() };
  try {
    const rows = JSON.parse(localStorage.getItem(wedding.rsvp.storageKey) || '[]');
    rows.push(record);
    localStorage.setItem(wedding.rsvp.storageKey, JSON.stringify(rows));
    $('#rsvpStatus').textContent = 'Saved on this device. Please also confirm directly with the couple.';
    rsvpForm.reset();
  } catch {
    $('#rsvpStatus').textContent = 'Please contact the couple directly with your reply.';
  }
});

$('#contactButton').addEventListener('click', () => {
  if (wedding.coordinator.contactUrl) {
    window.open(wedding.coordinator.contactUrl, '_blank', 'noopener');
  } else {
    $('#contactStatus').textContent = 'Contact details will be shared shortly.';
  }
});

applyWeddingData();
updateCountdown();
setInterval(updateCountdown, 1000);
