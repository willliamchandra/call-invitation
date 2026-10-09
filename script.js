// ---- Edit these details ----
const CONFIG = {
  date: "2026-10-09T23:00:00", // local time of the call
  where: "Wherever you are —<br />we'll meet you online",
  joinUrl: "#", // video-call link
  attire: "Something you love,<br />and your warmest smile",
  videoId: "S-1qyBWxLLQ", // Sade – Kiss of Life
};

const eventDate = new Date(CONFIG.date);

// ---- Fill in details ----
const dateFmt = eventDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeFmt = eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
document.getElementById("date-text").textContent = dateFmt;
document.getElementById("time-text").textContent = `at ${timeFmt}`;
document.getElementById("detail-when").innerHTML = `${dateFmt}<br />${timeFmt}`;
document.getElementById("detail-where").innerHTML = CONFIG.where;
document.getElementById("detail-attire").innerHTML = CONFIG.attire;
const joinLink = document.getElementById("join-link");
if (CONFIG.joinUrl && CONFIG.joinUrl !== "#") joinLink.href = CONFIG.joinUrl;
else joinLink.hidden = true;

// ---- Background music (YouTube, audio only) ----
let player;
let playerReady = false;
let wantPlay = false;
const musicBtn = document.getElementById("music-btn");

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("yt-player", {
    width: 1,
    height: 1,
    videoId: CONFIG.videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      loop: 1,
      playlist: CONFIG.videoId, // required for loop
      playsinline: 1,
      disablekb: 1,
      modestbranding: 1,
    },
    events: {
      onReady: (e) => {
        playerReady = true;
        e.target.setVolume(70);
        // Try autoplay; browsers may block until the user interacts.
        e.target.playVideo();
        if (wantPlay) startMusic();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) musicBtn.classList.remove("paused");
        if (e.data === YT.PlayerState.PAUSED) musicBtn.classList.add("paused");
      },
    },
  });
};

function startMusic() {
  wantPlay = true;
  if (!playerReady) return;
  player.unMute();
  player.playVideo();
}

musicBtn.addEventListener("click", () => {
  if (!playerReady) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else startMusic();
});

// ---- Envelope opening ----
const cover = document.getElementById("cover");
const envelope = document.getElementById("envelope");
const invitation = document.getElementById("invitation");
document.body.classList.add("locked");

function openInvitation() {
  if (envelope.classList.contains("open")) return;
  startMusic(); // user gesture unlocks audio
  envelope.classList.add("open");
  setTimeout(() => {
    invitation.hidden = false;
    musicBtn.hidden = false;
    cover.classList.add("gone");
    document.body.classList.remove("locked");
    observeReveals();
    startPetals();
  }, 1800);
}
document.getElementById("open-btn").addEventListener("click", openInvitation);
cover.addEventListener("click", openInvitation);

// ---- Reveal on scroll ----
function observeReveals() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// ---- Countdown ----
const cd = {
  days: document.getElementById("cd-days"),
  hours: document.getElementById("cd-hours"),
  mins: document.getElementById("cd-mins"),
  secs: document.getElementById("cd-secs"),
};
function tick() {
  const diff = Math.max(0, eventDate - new Date());
  cd.days.textContent = Math.floor(diff / 86400000);
  cd.hours.textContent = String(Math.floor(diff / 3600000) % 24).padStart(2, "0");
  cd.mins.textContent = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
  cd.secs.textContent = String(Math.floor(diff / 1000) % 60).padStart(2, "0");
}
tick();
setInterval(tick, 1000);

// ---- Falling petals ----
function startPetals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.querySelector(".petals");
  setInterval(() => {
    if (box.childElementCount > 25) return;
    const p = document.createElement("span");
    p.className = "petal";
    const size = 8 + Math.random() * 10;
    p.style.left = Math.random() * 100 + "vw";
    p.style.width = size + "px";
    p.style.height = size * 0.85 + "px";
    p.style.setProperty("--drift", (Math.random() * 200 - 100) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
    p.style.animationDuration = 8 + Math.random() * 7 + "s";
    p.addEventListener("animationend", () => p.remove());
    box.appendChild(p);
  }, 700);
}

// ---- RSVP ----
document.getElementById("rsvp-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = (data.get("name") || "").toString().trim();
  const yes = data.get("attending") === "yes";
  const thanks = document.getElementById("rsvp-thanks");
  thanks.textContent = yes ? `Thank you, ${name}! See you there.` : `We'll miss you, ${name}.`;
  thanks.hidden = false;
  e.target.querySelectorAll("input, textarea, button").forEach((el) => (el.disabled = true));
});
