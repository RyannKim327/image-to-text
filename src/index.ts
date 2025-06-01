import { createWorker, OEM, PSM } from "tesseract.js";
import { Presets, SingleBar } from "cli-progress";
import { bgBlack } from "ansi-colors";
import { LANGUAGE, XTRACT, XTRACT_OPTIONS } from "./types";
import { existsSync } from "fs";
import { Jimp, JimpMime } from "jimp";

const ARABIC: LANGUAGE = "ara";
const CEBUANO: LANGUAGE = "ceb";
const CHINESE_SIMPLIFIED: LANGUAGE = "chi_sim";
const CHINESE_TRADITIONAL: LANGUAGE = "chi_tra";
const GERMAN: LANGUAGE = "deu";
const GREEK: LANGUAGE = "ell";
const FILIPINO: LANGUAGE = "fil";
const HEBREW: LANGUAGE = "heb";
const JAPANESE: LANGUAGE = "jpn";
const KOREAN: LANGUAGE = "kor";
const TAGALOG: LANGUAGE = "tgl";

let lang: string = "eng+osd";

const addLanguage: Function = (language: LANGUAGE) => {
  lang = `${language}+${lang}`;
};

export default async function extractText(
  image_path: string,
  options?: XTRACT_OPTIONS,
): Promise<XTRACT> {
  if (!options) {
    options = {
      ocr_engine_mode: OEM.DEFAULT,
      pageseg_mode: PSM.AUTO,
    };
  }
  if (!options.ocr_engine_mode) {
    options.ocr_engine_mode = OEM.DEFAULT;
  }
  if (!options.pageseg_mode) {
    options.pageseg_mode = PSM.AUTO;
  }

  const worker = createWorker({
    logger: (m) => {
      if (options.debugging) {
        const progress = Math.round(m.progress * 100);
        const bar = new SingleBar(
          {
            format: `${bgBlack("{bar}")} Log [${progress}%]: ${m.status}`,
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
            hideCursor: true,
          },
          Presets.shades_classic,
        );
        bar.start(100, 0);
        bar.increment(1);
        bar.update(progress);
        bar.stop();
      }
    },
  });

  try {
    // INFO: Image file existence checker
    if (!existsSync(image_path)) throw Error("Image doesn't exists");

    // TODO: Image modifier based on the user preference
    const img = await Jimp.read(image_path);
    if (options.grayscale) img.greyscale();
    if (options.contrast) img.contrast(options.contrast);
    if (options.normalized) img.normalize();
    if (options.posterized) img.posterize(options.posterized);
    if (options.save_image_path) img.write(options.save_image_path);

    // TODO: To extract the image as new and use for scanning.
    const buff = await img.getBuffer(JimpMime.png);

    // TODO: A task for a worker to do his work
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    await worker.setParameters({
      tessedit_ocr_engine_mode: options.ocr_engine_mode,
      tessedit_pageseg_mode: options.pageseg_mode,
    });

    const {
      data: { text },
    } = await worker.recognize(buff);

    return {
      result: text,
    };
  } catch (error) {
    if (options.debugging) console.log(error);

    return {
      result: `There's a problem, please try again.`,
      error: error,
    };
  } finally {
    // TODO: To terminate the worker whatever happens.
    await worker.terminate();
  }
}

export {
  // INFO: Functions
  addLanguage,
  // INFO: Languages
  ARABIC,
  CEBUANO,
  CHINESE_SIMPLIFIED,
  CHINESE_TRADITIONAL,
  GERMAN,
  GREEK,
  FILIPINO,
  HEBREW,
  JAPANESE,
  KOREAN,
  TAGALOG,
  OEM,
  PSM,
  // // INFO: OEM
  // OEM.DEFAULT,
  // OEM.LSTM_ONLY,
  // OEM.TESSERACT_ONLY,
  // OEM.TESSERACT_LSTM_COMBINED,
  // // INFO: PSM
  // PSM.AUTO,
  // PSM.AUTO_OSD,
  // PSM.OSD_ONLY,
  // PSM.RAW_LINE,
  // PSM.AUTO_ONLY,
  // PSM.CIRCLE_WORD,
  // PSM.SINGLE_CHAR;,
  // PSM.SINGLE_LINE,
  // PSM.SINGLE_WORD,
  // PSM.SPARSE_TEXT,
  // PSM.SINGLE_BLOCK,
  // PSM.SINGLE_COLUMN,
  // PSM.SPARSE_TEXT_OSD,
  // PSM.SINGLE_BLOCK_VERT_TEXT,
};
