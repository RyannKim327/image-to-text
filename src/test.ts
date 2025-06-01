// @ts-nocheck
import extractText, { OEM, PSM } from ".";

(async () => {
  const test = await extractText("./test.png", {
    debugging: true,
    ocr_engine_mode: OEM.LSTM_ONLY,
    pageseg_mode: PSM.RAW_LINE,
  });
  console.log(test);
})();
