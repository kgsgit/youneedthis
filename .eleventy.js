module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("ads.txt");

  eleventyConfig.addTransform("cleanSitemap", (content, outputPath) => {
    if (outputPath && outputPath.endsWith("/sitemap.xml")) {
      return content.replace(/<script\/>\s*/g, "");
    }
    return content;
  });

  return {
    dir: {
-      input:    "src",
+      input:    ".",
      includes: "_includes",
      layouts:   "_layouts",
      output:    "_site"
    }
  };
};
