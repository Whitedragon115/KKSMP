const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { GetUserMoney } = require('../../function/economy.js')
const { GetIGN, GetUUID } = require('../../function/minecraft.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findeconomy')
        .setDescription('查詢一個使用者的經濟資訊')
        .setDMPermission(false)
        .addUserOption(option => option
            .setName('user')
            .setDescription('使用者')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('ign')
            .setDescription('遊戲帳號')
            .setRequired(false)
        ),

    async execute(interaction, client) {

        const user = interaction.options.getUser('user');
        const ign = interaction.options.getString('ign')?.replace(/\s/g, '').toLowerCase();

        const economy = await client.db.get('economy').then(res => { return res?.find(arr => arr.id == user?.id) }) || await client.db.get('economy').then(res => { return res?.find(arr => arr.ign == ign) })
        if (!economy) return interaction.reply({ content: `找不到這個使用者或遊戲帳號的經濟帳號`, ephemeral: true })

        const findaccountowner = await client.db.get('Account').then(res => { return res.find(arr => arr.id == economy.id) })
        const getign = await GetIGN(economy.ign)

        const embed = new EmbedBuilder()
            .setTitle('經濟資訊')
            .setDescription(`使用者 ${user || `\`${ign}\``} 的經濟帳號查詢結果`)
            .addFields(
                { name: '使用者', value: `<@${economy.id}>`, inline: true },
                { name: '遊戲帳號', value: `\`${getign}\``, inline: true },
                { name: '關於帳號資訊', value: '~~-------------------~~', inline: false },
                { name: '金錢', value: `\`${await GetUserMoney(getign)}\``, inline: true },
                { name: '註冊時間', value: new Date(economy.time).toLocaleString(), inline: true },
                { name: '狀態', value: findaccountowner.ban ? ':red_circle: 封鎖' : ':green_circle: 正常', inline: true }
            )

        await interaction.reply({ embeds: [embed] })

    }
}