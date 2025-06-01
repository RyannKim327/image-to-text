import { createWorker, OEM, PSM } from "tesseract.js";
import { Presets, SingleBar } from "cli-progress";
import { bgBlack } from "ansi-colors";
import { LANGUAGE, XTRACT } from "./types";
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
  debugging?: boolean | string,
  ocr_engine_mode?: OEM | string,
  pageseg_mode?: PSM | string,
  save_image_path?: `${string}.${string}`,
): Promise<XTRACT> {
  if (typeof debugging === "string") {
    save_image_path = debugging;
    debugging = false;
  }

  if (typeof ocr_engine_mode === "string") {
    save_image_path = ocr_engine_mode;
    ocr_engine_mode = OEM.DEFAULT;
  }

  if (typeof pageseg_mode === "string") {
    save_image_path = pageseg_mode;
    pageseg_mode = PSM.AUTO;
  }

  if (!ocr_engine_mode) {
    ocr_engine_mode = OEM.DEFAULT;
  }
  if (!pageseg_mode) {
    pageseg_mode = PSM.AUTO;
  }

  const worker = createWorker({
    logger: (m) => {
      if (debugging) {
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
    if (!existsSync(image_path)) {
      throw Error("Image doesn't exists");
    }
    const img = await Jimp.read(image_path);
    img.greyscale();
    img.contrast(1);
    img.normalize();
    img.posterize(2);
    if (save_image_path) {
      img.write(save_image_path);
    }
    const buff = await img.getBuffer(JimpMime.png);

    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    await worker.setParameters({
      tessedit_ocr_engine_mode: ocr_engine_mode,
      tessedit_pageseg_mode: pageseg_mode,
    });

    const {
      data: { text },
    } = await worker.recognize(buff);

    return {
      result: text,
    };
  } catch (error) {
    if (debugging) {
      console.log(error);
    }
    return {
      result: `There's a problem, please try again.`,
      error: error,
    };
  } finally {
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
};
