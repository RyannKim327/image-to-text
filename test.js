const a = require("./index")

let b = async () => {
	let c = await a("./b.png")
	console.log(c)
}

b()
