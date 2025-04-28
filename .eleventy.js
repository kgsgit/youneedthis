// .eleventy.js
module.exports = function(eleventyConfig) {
  // ① 기존 코드…
  eleventyConfig.addPassthroughCopy("src/robots.txt");  // ← 이 줄 추가
  eleventyConfig.addPassthroughCopy("assets");         // 이미 있으실 거예요

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    passthroughFileCopy: true
  };
};
