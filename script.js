// Theme persistence & toggles (fix: respect saved "light" and override system preference)
(function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Clear any stale class first
    document.documentElement.classList.remove('dark');

    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
        // Explicit light choice overrides system preference
        document.documentElement.classList.remove('dark');
    } else if (prefersDark) {
        document.documentElement.classList.add('dark');
    }
})();

function setTheme(mode) {
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
const previews = {
    "video-1": [
        "https://www.youtube.com/embed/4xQCs_ZiP5Q",
        "https://www.youtube.com/embed/4xQCs_ZiP5Q"
       
    ],
    "video-2": [
        "https://www.youtube.com/embed/IWpml6bwoxI",
        "https://www.youtube.com/embed/IWpml6bwoxI"
    ],
    "video-3": [
        "https://www.youtube.com/embed/a2gdxl-VHik",
        "https://www.youtube.com/embed/a2gdxl-VHik"
    ],
    "video-4": [
        "https://www.youtube.com/embed/JhTLDkxr62Y?si=WfxUITbSgoIr5_E-",
        "https://www.youtube.com/embed/JhTLDkxr62Y?si=WfxUITbSgoIr5_E-"
    ],
    "video-5": [
        "https://www.youtube.com/embed/_aosXFYaFH8?si=aAWGyyWmrtLjpbC3",
        "https://www.youtube.com/embed/_aosXFYaFH8?si=aAWGyyWmrtLjpbC3"
    ]
};

// Set random preview for each video iframe
Object.keys(previews).forEach(id => {
    const list = previews[id];
    const chosen = list[Math.floor(Math.random() * list.length)];
    const iframe = document.getElementById(id);
    if (iframe) iframe.src = chosen;
});
// List of hero videos: YouTube and local assets
const heroVideos = [
    // YouTube embeds (use embed URLs)
    "https://www.youtube.com/embed/4xQCs_ZiP5Q",
    "https://www.youtube.be/IWpml6bwoxI",
    "https://www.youtube.com/embed/VIDEO_ID_3",
    // Local MP4s (relative path)
    "assets/videos/preview1.mp4",
    "assets/videos/preview2.mp4"
];

// Pick a random video
const chosenHero = heroVideos[Math.floor(Math.random() * heroVideos.length)];
const heroContainer = document.getElementById("hero-video-container");

if (heroContainer) {
    if (chosenHero.startsWith("https://www.youtube.com/embed/")) {
        // YouTube embed
        heroContainer.innerHTML = `
      <iframe
        class="w-full h-full"
        src="${chosenHero}?autoplay=1&loop=1&mute=1&controls=0&disablekb=1&showinfo=0&modestbranding=1&rel=0"
        title="Hero Preview"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    `;
    } else {
        // Local video
        heroContainer.innerHTML = `
      <video
        class="w-full h-full object-cover"
        src="${chosenHero}"
        autoplay
        muted
        loop
        playsinline
      ></video>
    `;
    }
}

// Hook up buttons & tabs
window.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggle');
    const themeBtnMobile = document.getElementById('themeToggleMobile');
    const menuBtn = document.getElementById('menuToggle');
    const mnav = document.getElementById('mnav');

    themeBtn?.addEventListener('click', toggleTheme);
    themeBtnMobile?.addEventListener('click', toggleTheme);
    menuBtn?.addEventListener('click', () => mnav?.classList.toggle('hidden'));

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

    // Tabs logic
    document.querySelectorAll('.tabs').forEach((tabsRoot) => {
        const tablist = tabsRoot.querySelector('[role="tablist"]');
        const panels = tabsRoot.querySelectorAll('[role="tabpanel"]');
        if (!tablist) return;

        function activateTab(button) {
            tablist.querySelectorAll('[role="tab"]').forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
                btn.tabIndex = -1;
            });
            panels.forEach(p => p.classList.add('hidden'));

            const target = button.getAttribute('data-tab');
            const panel = tabsRoot.querySelector(`[data-panel="${target}"]`);
            button.setAttribute('aria-selected', 'true');
            button.tabIndex = 0;
            panel?.classList.remove('hidden');
        }

        const firstTab = tablist.querySelector('[role="tab"]');
        if (firstTab) activateTab(firstTab);

        tablist.addEventListener('click', (e) => {
            const btn = e.target.closest('[role="tab"]');
            if (!btn) return;
            activateTab(btn);
        });

        tablist.addEventListener('keydown', (e) => {
            const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
            const currentIndex = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const next = tabs[(currentIndex + dir + tabs.length) % tabs.length];
                next.focus();
                activateTab(next);
            }
        });
    });
});
