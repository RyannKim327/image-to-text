const { createWorker } = require("tesseract.js")
const cli_pro = require("cli-progress")
const colors = require("ansi-colors")

const ARABIC = 'ara'
const CEBUANO = 'ceb'
const CHINESE_SIMPLIFIED = 'chi_sim'
const CHINESE_TRADITIONAL = 'chi_tra'
const GERMAN = 'deu'
const GREEK = 'ell'
const FILIPINO = 'fil'
const HEBREW = 'heb'
const JAPANESE = 'jpn'
const KOREAN = 'kor'
const TAGALOG = 'tgl'


let lang = "eng+osd"
let addLanguage = (languageKey) => {
	lang = `${languageKey}+${lang}`
}

let scan = async (imgPath, ocr_engine_mode = 2, pageseg_mode = 3) => {
	const v_oem = 2 | ocr_engine_mode
	const v_psm = 3 | pageseg_mode
	try{
		let worker = createWorker({
			logger: m => {
				const bar1 = new cli_pro.SingleBar({
					format: `${colors.bgBlack('{bar}')} Log [${Math.round(m.progress * 100)}%]: ${m.status}`,
					barCompleteChar: "\u2588",
					barIncompleteChar: "\u2591",
					hideCursor: true
				}, cli_pro.Presets.legacy)
				bar1.start(100, 0)
				bar1.increment()
				bar1.update(m.progress * 100)
				bar1.stop()
			}
		})
		await worker.load()
		await worker.loadLanguage(lang)
		await worker.initialize(lang)
		await worker.setParameters({
			tessedit_ocr_engine_mode: v_oem,
            tessedit_pageseg_mode: v_psm,
		})
		const {
			data: {
				text
			}
		} = await worker.recognize(imgPath)
		await worker.terminate()
		let json = {
			result: text
		}
		return json
	}catch(e){
		console.log(`Error [Scan Text on image]: ${e}`)
		let json = {
			result: e
		}
		return json
	}
}

module.exports = {
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

	addLanguage,
	scan
}