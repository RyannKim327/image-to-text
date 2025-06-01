import extractText from ".";

(async () => {
  const test = await extractText("./test.png", true);
  console.log(test);
})();
