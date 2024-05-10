const uuidlink = "https://api.ashcon.app/mojang/v2/user/"


async function GetUUID(ign) {
    const res = await fetch(uuidlink + ign)
    const json = await res.json()
    if(json.error == "Not Found") return undefined
    return json?.uuid
}

async function GetIGN(uuid) {
    const res = await fetch(uuidlink + uuid)
    const json = await res.json()
    if(json.error == "Not Found") return undefined
    return json?.username
}

module.exports = {
    GetUUID,
    GetIGN
}