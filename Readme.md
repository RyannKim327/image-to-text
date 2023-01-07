# Image to Text
### MPOP Reverse II

### How to install
``` Bash
npm install pls-img-txt
```

### How to use (scan) .scan(imagePath [, ocr_engine_mode] [, pageseg_mode])
> The OCR (Optical Character Recognition) Engine Mode is one part of this project from its first release. [**According to IBM**](https://www.ibm.com/cloud/blog/optical-character-recognition), Optical character recognition (OCR) is sometimes referred to as text recognition. An OCR program extracts and repurposes data from scanned documents, camera images and image-only pdfs. OCR software singles out letters on the image, puts them into words and then puts the words into sentences, thus enabling access to and editing of the original content. It also eliminates the need for manual data entry. The Page segmentation mode defines how your text should be treated by Tesseract. For example, if your image contains a single character or a block of text, you want to specify the corresponding psm so that you can improve accuracy. [**According to David Sixela**](https://groups.google.com/g/tesseract-ocr/c/N-7-lLrx5bw). This two are now added as customized options in this project, it is still optional for developers to user with the default value of ocr_engine_mode = 2 and pageseg_mode = 3.

``` NodeJS
const { scan } = require("pls-img-txt")

let run = async () => {
	let output = await scan("./sampleimg.png")
	// await scan("./sampleimg.png", 2, 3)
	// This is just optional
	console.log(output)
}

run()
```

### Result
``` JSON
{
	"result": "Sample text"
}
```

### How to use (Add language) .addLanguage([language])
> This feature is just optional, this package has already default installed languages which are english and the orientation and script detection (osd).
``` NodeJS
const pls_img_txt = require("pls-img-txt")

let run = async () => {
	pls_img_txt.addLanguage(pls_img_txt.CEBUANO)
	pls_img_txt.addLanguage(pls_img_txt.FILIPINO)
	pls_img_txt.addLanguage(pls_img_txt.TAGALOG)
	let output = await pls_img_txt.scan("./sampleimg.png")
	console.log(output)
}

run()

```

> Add language is still in development, so that this feature might not be stable. Try to add some try catch to handle this kind of error and to avoid some crash on to your system.

### Language Lists
* ARABIC
* CEBUANO
* CHINESE_SIMPLIFIED
* CHINESE_TRADITIONAL
* GERMAN
* GREEK
* FILIPINO
* HEBREW
* JAPANESE
* KOREAN
* TAGALOG

> For more language, kindly visit [this link](https://tesseract-ocr.github.io/tessdoc/Data-Files-in-different-versions.html), and use the key language to add.

---
### Credits
1. Tesseract.js
2. [cli-progress](https://www.npmjs.com/package/cli-progress)
3. [ansi-colors](https://www.npmjs.com/package/ansi-colors)