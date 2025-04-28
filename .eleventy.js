module.exports = function(eleventyConfig) {
  // Copy static assets directory
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
