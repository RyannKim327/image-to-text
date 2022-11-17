# Image to Text
### MPOP Reverse II

### How to install
``` Bash
npm install pls-img-txt
```

### How to use (scan)
``` NodeJS
const { scan } = require("pls-img-txt")

let run = async () => {
	let output = await scan("./sampleimg.png")
	console.log(output)
}

run()
```

### Result
``` JSON
{
	result: "Sample text"
}
```

### How to use (Add language)
``` NodeJS
const pls_img_txt = require("pls-img-txt")

et run = async () => {
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