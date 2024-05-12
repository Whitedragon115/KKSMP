const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { AdminRoleId } = require('../../config.json')
const { GiveUserMoney, TakeUserMoney, SetUserMoney, GetUserMoney } = require('../../function/economy.js')
const { GetUUID, GetIGN } = require('../../function/minecraft.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('eco')
        .setDescription('從使用者帳戶中增加金錢')
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('增加金錢')
            .addUserOption(option => option
                .setName('user')
                .setDescription('想要增加金錢的使用者')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('money')
                .setDescription('想要增加的金錢數量')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('take')
            .setDescription('從使用者帳戶中移除金錢')
            .addUserOption(option => option
                .setName('user')
                .setDescription('想要移除金錢的使用者')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('money')
                .setDescription('想要移除的金錢數量')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('設定使用者帳戶金錢')
            .addUserOption(option => option
                .setName('user')
                .setDescription('想要設定金錢的使用者')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('money')
                .setDescription('想要設定的金錢數量')
                .setRequired(true))
        ),

    async execute(interaction, client) {

        if (!interaction.member.roles.cache.some((rl) => rl.id == AdminRoleId)) {
            return interaction.reply({ content: `**你沒有權限**`, ephemeral: true })
        }

        const targetuser = interaction.options.getUser('user');
        const money = parseFloat(interaction.options.getNumber('money'))
        const subcommand = interaction.options.getSubcommand()

        const useraccount = await client.db.get('economy').then(res => { return res.find(arr => arr.id == targetuser.id) })

        if (!useraccount) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('找不到使用者')
                .setDescription(`**錯誤資訊：**找不到使用者的遊戲帳號`)
                .addFields()
                .setTimestamp()
            return interaction.reply({ embeds: [embed] })
        } else if (money < 0.01 && subcommand != 'set') {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('錯誤')
                .setDescription(`**錯誤資訊：**金額必須大於\`0.00\``)
                .setTimestamp()
            return interaction.reply({ embeds: [embed] })
        }

        const ign = await GetIGN(useraccount.ign)
        await interaction.deferReply()

        switch (subcommand) {
            case 'add':
                await adduser()
                break;
            case 'take':
                await takeuser()
                break;
            case 'set':
                await setuser()
                break;
            default:
                break;
        }


        async function adduser() {
            const sendcmd = await GiveUserMoney(ign, money)
            if (sendcmd.includes('不存在')) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('錯誤')
                    .setDescription(`**錯誤資訊：**你輸入的使用者沒有遊戲帳號\n(或者還未登入過伺服器)`)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed] })
            }

            const embed = new EmbedBuilder()
                .setColor(0x34ebe5)
                .setTitle('成功執行')
                .setDescription(`現在 ${ign} 的帳戶餘額為\`${await GetUserMoney(ign)}\`元`)
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] })
        }

        async function takeuser() {
            const sendcmd = await TakeUserMoney(ign, money)
            if (sendcmd.includes('不存在')) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('錯誤')
                    .setDescription(`**錯誤資訊：**你輸入的使用者沒有遊戲帳號\n(或者還未登入過伺服器)`)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed] })
            }else if (sendcmd.includes('資金不足')) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('錯誤')
                    .setDescription(`**錯誤資訊：**你輸入的使用者的帳戶餘額不足
                    > 目前餘額：\`${await GetUserMoney(ign)}\`元
                    `)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed] })
            }

            const embed = new EmbedBuilder()
                .setColor(0x34ebe5)
                .setTitle('成功執行')
                .setDescription(`現在 ${ign} 的帳戶餘額為\`${await GetUserMoney(ign)}\`元`)
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] })
        }

        async function setuser() {
            const sendcmd = await SetUserMoney(ign, money)
            if (sendcmd.includes('不存在')) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('錯誤')
                    .setDescription(`**錯誤資訊：**你輸入的使用者沒有遊戲帳號\n(或者還未登入過伺服器)`)
                    .setTimestamp()
                return interaction.editReply({ embeds: [embed] })
            }

            const embed = new EmbedBuilder()
                .setColor(0x34ebe5)
                .setTitle('成功執行')
                .setDescription(`現在 ${ign} 的帳戶餘額為\`${await GetUserMoney(ign)}\`元`)
                .setTimestamp()

            await interaction.editReply({ embeds: [embed] })
        }

    },
};