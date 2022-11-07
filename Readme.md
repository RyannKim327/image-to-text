# Image to Text
### MPOP Reverse II

### How to install
``` Bash
npm install pls-img-txt
```

### How to use
``` NodeJS
const scan = require("pls-img-txt")

let run = async () => {
	let output = await a("./sampleimg.png")
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