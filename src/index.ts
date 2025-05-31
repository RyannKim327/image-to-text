import { createWorker, OEM, PSM } from "tesseract.js";
import { Presets, SingleBar } from "cli-progress";
import { bgBlack } from "ansi-colors";
import { LANGUAGE, PLS } from "./types";
import { existsSync } from "fs";

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

const addLanguage: Function = (languageKey: LANGUAGE) => {
  lang = `${languageKey}+${lang}`;
};

export default async function extractText(
  image_path: string,
  debugging?: boolean,
  ocr_engine_mode?: OEM,
  pageseg_mode?: PSM,
): Promise<PLS> {
  if (!ocr_engine_mode) {
    ocr_engine_mode = OEM.DEFAULT;
  }
  if (!pageseg_mode) {
    pageseg_mode = PSM.AUTO;
  }
  if (!existsSync(image_path)) {
    return {
      result: "Image doesn't exists",
    };
  }
  try {
    const worker = createWorker({
      logger: (m) => {
        if (debugging) {
          const bar = new SingleBar(
            {
              format: `${bgBlack("{bar}")} Log [${Math.round(m.progress * 100)}%]: ${m.status}`,
              barCompleteChar: "\u2588",
              barIncompleteChar: "\u2591",
              hideCursor: true,
            },
            Presets.legacy,
          );
          bar.start(100, 0);
          bar.update(0);
          bar.stop();
        }
      },
    });
    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);
    await worker.setParameters({
      tessedit_ocr_engine_mode: ocr_engine_mode,
      tessedit_pageseg_mode: pageseg_mode,
    });
    const {
      data: { text },
    } = await worker.recognize(image_path);
    await worker.terminate();
    return {
      result: text,
    };
  } catch (error) {
    if (debugging) {
      console.log(error);
    }
    return {
      result: `There's a problem, please try again. ${error}`,
    };
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
