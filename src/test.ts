import extractText from ".";

(async () => {
  const test = await extractText("./test.png", true, "a.png");
  console.log(test);
})();
