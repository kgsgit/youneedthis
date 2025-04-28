module.exports = function(eleventyConfig) {
  // 1) assets 폴더 통째로 복사
  eleventyConfig.addPassthroughCopy("assets");

  // 2) sitemap.xml을 생성한 직후 <script/> 태그를 지우는 트랜스폼
  eleventyConfig.addTransform("cleanSitemap", (content, outputPath) => {
    if (outputPath && outputPath.endsWith("/sitemap.xml")) {
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
