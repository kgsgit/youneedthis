const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // 1) assets 폴더 그대로 복사
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("ads.txt");

  // 2) 빌드 후 sitemap.xml에서 <script/> 태그 제거
  eleventyConfig.addTransform("cleanSitemap", (content, outputPath) => {
    if (outputPath && outputPath.endsWith("/sitemap.xml")) {
      return content.replace(/<script\/>\s*/g, "");
    }
    return content;
  });

  // ✅ 3) Nunjucks용 날짜 필터 추가
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-LL-dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
