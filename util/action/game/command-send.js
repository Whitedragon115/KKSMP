const { SlashCommandBuilder, TextInputStyle, PermissionsBitField } = require('discord.js');
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, EmbedBuilder } = require('@discordjs/builders')
const { ServerPort, ServerRconIp, ServerRconPassword, GameConsoleChannel, GameConsolePassword } = require('../../../config.json')
const { Rcon } = require('rcon-client');

const rcon = new Rcon({
    port: ServerPort,
    host: ServerRconIp,
    password: ServerRconPassword
})

module.exports = {
    customId: 'minecraft-console',
    async execute(interaction, client) {
        const command = interaction.fields.getTextInputValue('command');
        const password = interaction.fields.getTextInputValue('password');
        await interaction.deferReply({ ephemeral: true })

        if(password !== GameConsolePassword) return interaction.reply({ content: '密碼錯誤!', ephemeral: true });

        const channel = interaction.guild.channels.cache.get(GameConsoleChannel)

        await rcon.connect()
        let returncmd = await rcon.send(command)
        await rcon.end()
        if(returncmd === '') returncmd = '無回傳'

        const embed = new EmbedBuilder()
            .setTitle('Minecraft Console')
            .setDescription(`指令執行者 \`${interaction.user.tag}\``)
            .addFields(
                { name: '指令', value: `\`${command}\`` },
                { name: '回傳', value: `\`${returncmd}\`` }
            )
            .setTimestamp()

        await interaction.editReply({ content: `已經執行指令! \`${command}\``, ephemeral: true })

        await channel.send({ embeds: [embed] })
    }
}