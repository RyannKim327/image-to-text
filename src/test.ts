import extractText from ".";

(async () => {
  const test = await extractText("./test.png");
  console.log(test);
})();
