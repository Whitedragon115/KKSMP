const { Rcon } = require('rcon-client');
const { ServerRconIp, ServerPort, ServerRconPassword } = require('../config.json')

const rcon = new Rcon({
    port: ServerPort,
    host: ServerRconIp,
    password: ServerRconPassword
})


async function SendCommand(command) {
    const connecterr = await rcon.connect().catch(er => { if (er) console.log(er); return true })
    if (connecterr == true) {
        await rcon.end();
        return "Rcon連接失敗"
    }
    await rcon.send(command)
    await rcon.end();
    return true
}

async function SendResponseCommand(command) {
    const connecterr = await rcon.connect().catch(er => { if (er) console.log(er); return true })
    if (connecterr == true) {
        await rcon.end();
        return "Rcon連接失敗"
    }
    const res = await rcon.send(command)
    await rcon.end();
    return res
}

module.exports = {
    SendCommand,
    SendResponseCommand
}