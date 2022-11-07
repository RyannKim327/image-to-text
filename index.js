const { createWorker } = require("tesseract.js")

module.exports = async (img, oem, psm) => {
	const v_oem = 2
	const v_psm = 3
	try{
		let worker = createWorker()
			//logger: m => console.log(`Log: ${m}`)
		//})
		await worker.load()
		await worker.loadLanguage("eng")
		await worker.initialize("eng")
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
		return text
	}catch(e){
		console.log(`Error [Scan Text on image]: ${e}`)
		return e
	}
}
