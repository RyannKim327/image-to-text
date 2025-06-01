import { OEM, PSM } from "tesseract.js";

type FILE_PATH = string;
type EXTENSION = string;
export type LANGUAGE = string;

export interface XTRACT_OPTIONS {
  debugging?: boolean;
  grayscale?: boolean;
  contrast?: number;
  normalized?: boolean;
  posterized?: number;
  ocr_engine_mode?: OEM;
  pageseg_mode?: PSM;
  save_image_path?: `${FILE_PATH}.${EXTENSION}`;
}

export interface XTRACT {
  result: string;
  error?: string | unknown;
}
