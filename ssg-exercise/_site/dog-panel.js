let apiURL = "https://dog.ceo/api/breeds/image/random";
let modeKey = "hw5-dog-panel-mode";

class DogPanel extends HTMLElement {
    
    static observedAttributes = ["compact"];

    connectedCallback() {
        
        this.replaceChildren();

        let heading = document.createElement("h2");
        heading.textContent = "Surprise Dog Generator";

        this.details = document.createElement("p");
        this.details.className = "details";
        this.details.textContent = "Laika says hi! Say hello to more dogs!";

        this.image = document.createElement("img");
        this.image.src = "laika.jpg";
        this.image.alt = "Laika, my black-and-white border collie, looking up at the camera with her tongue out.";

        this.caption = document.createElement("p");
        this.caption.className = "caption";
        this.caption.textContent = "Laika: border collie";

        this.button = document.createElement("button");
        this.button.type = "button";
        this.button.textContent = "Surprise me with a dog";
        this.button.addEventListener("click", () => this.loadDog());

       
        this.status = document.createElement("p");
        this.status.className = "status";
        this.status.setAttribute("role", "status");
        this.status.textContent = "Showing my baby Laika. Press the button to fetch a random dog.";

        this.dogCount = 0;
        this.loading = false;

        this.append(heading, this.details, this.image, this.caption, this.button, this.status);
        this.updateMode();
    }

    attributeChangedCallback() {
        this.updateMode();
    }

    updateMode() {
        
        if (this.details) {
            this.details.hidden = this.hasAttribute("compact");
        }
    }

    async loadDog() {
        
        if (this.loading) {
            return;
        }
        this.loading = true;
        this.status.dataset.state = "loading";
        this.status.textContent = "Fetching a random dog…";

        try {
            let response = await fetch(apiURL);

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            
            let data = await response.json();

            if (data?.status !== "success" || typeof data?.message !== "string") {
                throw new Error("Unexpected response from the API.");
            }

            
            let url = new URL(data.message);
            if (url.protocol !== "https:") {
                throw new Error("The image URL isn't HTTPS.");
            }

            let breed = (url.pathname.split("/")[2] || "unknown breed").replaceAll("-", " ");

            this.dogCount++;
            this.image.src = url.href;
            this.image.alt = `A random dog from the Dog CEO API, listed as ${breed}.`;
            this.caption.textContent = `Dog #${this.dogCount}: ${breed}`;  

            this.status.dataset.state = "success";
            this.status.textContent = `Dog #${this.dogCount} loaded!`;
            this.button.textContent = "Surprise me with another dog";
        } catch (error) {
            console.error("Could not load a dog.", error);

            this.status.dataset.state = "error";
            this.status.textContent = "Sorry, couldn't load a dog. Check your connection and try again.";
            this.button.textContent = "Try again";
        } finally {
            this.loading = false;
        }
    }
}

customElements.define("dog-panel", DogPanel);


let panel = document.querySelector("dog-panel");
let toggle = document.getElementById("dog-mode-toggle");

function applyMode(mode) {
    panel.toggleAttribute("compact", mode === "compact");
    toggle.textContent = mode === "compact" ? "Switch to expanded view" : "Switch to compact view";
}


let savedMode = null;
try {
    savedMode = localStorage.getItem(modeKey);
} catch (error) {
    
}
applyMode(savedMode === "compact" ? "compact" : "expanded");

toggle.hidden = false;   

toggle.addEventListener("click", () => {
    let next = panel.hasAttribute("compact") ? "expanded" : "compact";
    applyMode(next);     

    try {
        localStorage.setItem(modeKey, next);
    } catch (error) {
        console.warn("Couldn't save the view preference.");
    }
});
