| Field | Value |
| -------- | -------- | 
| Repository URL | https://github.com/piagooo/cse134-hw5 | 
| Website | https://coruscating-cascaron-f0e805.netlify.app/ |
| SSG exercise | ssg-exercise/ |

### Design note

**What the visitor wants:** to see a random dog (and Laika). They can choose a compact or expanded view, and that choice is remembered.

**Tracing one action: "Surprise me with a dog"**

1. The visitor activates the button inside the component (click, Enter or Space).
2. `loadDog()` ignores the press if a request is already running. Otherwise it sets the `role="status"` area to "Fetching a random dog…".
3. It sends a GET request to `https://dog.ceo/api/breeds/image/random` with `fetch()`.
4. It checks `response.ok`, parses the JSON, and checks that `status` is `"success"` and `message` is a string. Then it checks that `message` is an HTTPS URL. Any failed check throws an error, which jumps to `catch`.
5. On success, it updates the `<img>` `src` and `alt`, plus the caption with the breed taken from the URL (set with `textContent`, so remote text is never treated as HTML). The status reads "Dog #_ loaded!".
6. On failure (offline, HTTP error, bad JSON or a bad URL), the previous dog stays. The status becomes a dashed error box saying "Sorry, couldn't load a dog…", and the button says "Try again". Pressing it sends a new request without reloading, and a success replaces the error.

**What the visitor sees**
- *While waiting:* "Fetching a random dog…" in the status area.
- *On success:* the new dog with its number and breed, plus a green-bordered status.
- *On failure:* the last dog stays, with a dashed red error message and a "Try again" button.

## Commands for ssg-exercise

Run these from inside the `ssg-exercise/` folder. 

**Install dependencies**

```bash
npm install
```

**Build the site** (writes the pages to `_site/`)

```bash
npx @11ty/eleventy
```

**Preview both pages locally**

```bash
npx @11ty/eleventy --serve
```

Then open:

- Home: http://localhost:8080/
- About: http://localhost:8080/about.html

**Notes
- I deleted the node modules as well as the _site folder so when it runs they should be rebuilt!