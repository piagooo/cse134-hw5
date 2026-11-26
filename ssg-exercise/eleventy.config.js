export default function (eleventyConfig) {
    
    eleventyConfig.addPassthroughCopy("main.css");
    eleventyConfig.addPassthroughCopy("theme.js");
    eleventyConfig.addPassthroughCopy("dog-panel.js");
    eleventyConfig.addPassthroughCopy("laika.jpg");

    
}
