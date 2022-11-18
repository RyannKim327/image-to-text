const { createWorker } = require("tesseract.js")

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

let scan = async (img, oem, psm) => {
	const v_oem = 2
	const v_psm = 3
	try{
		let worker = createWorker()
			//logger: m => console.log(`Log: ${m}`)
		//})
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
		} = await worker.recognize(img)
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