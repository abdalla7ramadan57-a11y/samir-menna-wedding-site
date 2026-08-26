const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const wedding = window.WEDDING;
const opening = $('#opening');
const invitation = $('#invitation');
const envelope = $('#openInvitation');
const audio = $('#weddingMusic');
const musicToggle = $('#musicToggle');

function applyWeddingData() {
  const { personOne, personTwo } = wedding.couple;
  $('#openingNameOne').textContent = personOne;
  $('#openingNameTwo').textContent = personTwo;
  $$('[data-name="one"]').forEach((el) => { el.textContent = personOne; });
  $$('[data-name="two"]').forEach((el) => { el.textContent = personTwo; });
  $('#ceremonyTime').textContent = wedding.ceremony.time;
  $('#venueName').textContent = wedding.ceremony.venue;
  $('#venueAddress').textContent = wedding.ceremony.address;
  $('#mapsLink').href = wedding.ceremony.mapsUrl;
  $('#songTitle').textContent = wedding.song.title;
  audio.src = wedding.song.audioSrc;
  $('#dressCode').textContent = wedding.dressCode;
  $('#giftMessage').textContent = wedding.giftMessage;
  $('#adultsMessage').textContent = wedding.adultsOnly;
  $('#timeline').innerHTML = wedding.itinerary.map((item, index) =>
    `<div class="timeline-row" style="transition-delay:${index * 90 + 300}ms"><time>${item.time}</time><i aria-hidden="true">${item.icon}</i><span>${item.label}</span></div>`
  ).join('');
}

function revealSite() {
  opening.classList.add('opened');
  invitation.classList.add('active');
  invitation.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('is-locked');
  requestAnimationFrame(() => $$('.reveal').forEach((el) => observer.observe(el)));
}

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  setTimeout(revealSite, 1450);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

async function toggleMusic() {
  if (audio.paused) {
    try {
      await audio.play();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.querySelector('span').textContent = 'Ⅱ';
    } catch { /* playback remains user-controlled */ }
  } else {
    audio.pause();
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.querySelector('span').textContent = '▶';
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
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  $('#days').textContent = String(days).padStart(3, '0');
  $('#hours').textContent = String(hours).padStart(2, '0');
  $('#minutes').textContent = String(minutes).padStart(2, '0');
  $('#seconds').textContent = String(seconds).padStart(2, '0');
}

const rsvpForm = $('#rsvpForm');
$('#showRsvp').addEventListener('click', () => {
  rsvpForm.hidden = false;
  rsvpForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  rsvpForm.querySelector('input').focus({ preventScroll: true });
});
$('#closeRsvp').addEventListener('click', () => { rsvpForm.hidden = true; });
rsvpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(rsvpForm));
  const clean = (value = '') => String(value).trim().replace(/\s+/g, ' ');
  const record = { name: clean(data.name), attendance: data.attendance, message: clean(data.message), savedAt: new Date().toISOString() };
  try {
    const rows = JSON.parse(localStorage.getItem(wedding.rsvp.storageKey) || '[]');
    rows.push(record);
    localStorage.setItem(wedding.rsvp.storageKey, JSON.stringify(rows));
    $('#rsvpStatus').textContent = 'Your reply has been saved on this device. Thank you.';
    rsvpForm.reset();
  } catch {
    $('#rsvpStatus').textContent = 'Please contact the couple directly with your reply.';
  }
});

applyWeddingData();
updateCountdown();
setInterval(updateCountdown, 1000);
