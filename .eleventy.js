// .eleventy.js (프로젝트 루트에 위치)
module.exports = function(eleventyConfig) {
  // *assets* 폴더를 그대로 _site/assets 로 복사
  eleventyConfig.addPassthroughCopy("assets");
  
  // 필요시 추가 설정(예: watchPatterns, shortcodes 등) 여기에…
  
  return {
    dir: {
      input: "src",     // 소스 파일들이 있는 폴더
      includes: "_includes",
      layouts: "_layouts",
      output: "_site"
    },
    passthroughFileCopy: true
  };
};
