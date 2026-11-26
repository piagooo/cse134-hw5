
const theme_key = "theme";

function readSavedTheme() {
    try {
        let saved = localStorage.getItem(theme_key);

        return saved === "dark" || saved === "light" ? saved : null;
    } catch (error) {
        return null;                       
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(theme_key, theme);
    } catch (error) {
        console.warn("The theme preference could not be saved.");
    }
}

let currentTheme = readSavedTheme() || "light";
document.documentElement.dataset.theme = currentTheme;

document.addEventListener("DOMContentLoaded", () => {
    const item = document.getElementById("theme-item");
    const button = document.getElementById("theme-toggle");
    if (!item || !button) {
        return;
    }

    function updateButton() {
        button.textContent = currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }

    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.dataset.theme = theme;
        updateButton();
    }

    item.hidden = false; 

    updateButton();

    button.addEventListener("click", () => {
        const next = currentTheme === "dark" ? "light" : "dark";
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(() => applyTheme(next));
        } else {
            applyTheme(next);
        }
        saveTheme(next);                    // applied even if saving fails
    });
});
