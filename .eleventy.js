module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("assets");
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    }
  };
};
