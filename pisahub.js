const os = require("os");
const fs = require("fs");
const mqtt = require("mqtt");
const path = require("path");
const homedir = os.homedir();
const appdir = path.resolve(homedir, ".pisahub");
const appfile = path.resolve(appdir, "uuid");
const uuid = require("uuid/v1");
const printer = require("printer");
if (!fs.existsSync(appdir)) {
	fs.mkdirSync(appdir);
}

if (!fs.existsSync(appfile)) {
	fs.writeFileSync(appfile, uuid());
}

const id = fs.readFileSync(appfile).toString();
console.log("printer id : " + id);
const client = mqtt.connect("tcp://mqtt.pisahub.com", {
	clientId: id,
	clean: false
});

client.subscribe("public/" + id + "/print", { qos: 2 });

client.on("message", function(topic, payload) {
	printer.printDirect({
		data: payload,
		printer: "usbprinter",
		type: "RAW",
		error: console.log,
		success: console.log
	});
});

client.on("connect", function() {
	printer.printDirect({
		data: "\nconnect ok\n",
		printer: "usbprinter",
		type: "TEXT",
		error: console.log,
		success: console.log
	});
});

console.log("listening");
