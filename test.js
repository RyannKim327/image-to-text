const a = require("./index")

let test1 = async () => {
	a.addLanguage(a.FILIPINO)
	let c = await a.scan("./Untitled.png")
	console.log(c)
}
let test2 = async () => {
	a.addLanguage(a.FILIPINO)
	let c = await a.scan("./Untitled.png", 10, 10)
	console.log(c)
} 
test1()
test2()
