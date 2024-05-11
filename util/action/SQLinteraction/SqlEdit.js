const { ModalBuilder, ActionRowBuilder, TextInputBuilder } = require('@discordjs/builders')
const { TextInputStyle, InteractionCollector } = require('discord.js')
const { get } = require('sourcebin');

module.exports = {
    customId: 'sql-edit-done',
    async execute(interaction, client) {

        const modal = new ModalBuilder()
            .setTitle('SQL EDIT')
            .setCustomId('sql-edit-modal')

        const editedData = new TextInputBuilder()
            .setCustomId('sql-edit-data')
            .setPlaceholder('sourceb.in')
            .setStyle(TextInputStyle.Short)
            .setLabel('link here')

        const inputdata = new ActionRowBuilder().addComponents(editedData)
        modal.addComponents(inputdata)

        await interaction.showModal(modal)

        const colloctorFilter = i => i.customId === 'sql-edit-data' && i.user.id === interaction.user.id;
        const modalinter = await interaction.awaitModalSubmit({ time: 30000, colloctorFilter })
        const binlink = modalinter.fields.getTextInputValue('sql-edit-data').replace('https://sourceb.in/', '')

        modalinter.reply({ content: `Uploading [**\`sourceb.in/${binlink}\`**](<https://sourceb.in/${binlink}>) ....`, ephemeral: true })
        const data = await get({ key: binlink }).then(res => { return res.files[0].rawUrl});
        const raw = await fetch(data).then((res) => { return res.json() })

        raw.forEach(async arr => {
            await client.db.set(arr.id, arr.value)
        });

        return await modalinter.editReply({ content: `Uploaded!`, ephemeral: true })

    }
}