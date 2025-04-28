module.exports = function(eleventyConfig) {
  // 1) assets 폴더 그대로 복사
  eleventyConfig.addPassthroughCopy("assets");

  // 2) sitemap.xml이 나올 때만, <script/> 태그를 모두 제거하는 트랜스폼
  eleventyConfig.addTransform("cleanSitemap", (content, outputPath) => {
    if (outputPath && outputPath.endsWith("sitemap.xml")) {
      return content.replace(/<script\/>\s*/g, "");
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    }
  };
};
