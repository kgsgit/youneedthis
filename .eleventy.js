module.exports = function(eleventyConfig) {
  // 1) assets 폴더 그대로 복사
  eleventyConfig.addPassthroughCopy("assets");
  // robots.txt, ads.txt가 루트에 있으면 그대로 복사됩니다.
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("ads.txt");

  // 2) 빌드 후 sitemap.xml에서 <script/> 태그를 제거하는 트랜스폼
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
