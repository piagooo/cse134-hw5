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