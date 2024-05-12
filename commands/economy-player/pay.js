const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders')
const { CheckUserAvailable, GiveUserMoney, TakeUserMoney, GetUserMoney } = require('../../function/economy.js')
const { getCurrentDateTime } = require('../../function/usefull.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mc-pay')
        .setDescription('Pay money to another player!')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user you want to pay')
            .setRequired(true))
        .addNumberOption(option => option
            .setName('money')
            .setDescription('The amount of money you want to pay')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const finduser = await CheckUserAvailable(interaction, client)//轉的人
        if (!finduser) return

        const targetuser = interaction.options.getUser('user');
        const payuser = await client.db.get('economy').then(res => { return res.find(arr => arr.id == targetuser.id) })//轉錢的對象
        const payuseraccount = await client.db.get('Account').then(res => { return res.find(arr => arr.id == targetuser.id) })

        if (!payuser) return interaction.editReply({ content: `你要pay的對象沒有經濟帳號`, ephemeral: true })
        if (payuseraccount.ban) return interaction.editReply({ content: `你要給已經被ban的人轉錢我是沒意見啦...`, ephemeral: true })
        if(interaction.user.id == targetuser.id) return interaction.editReply({ content: `轉給自己...?`, ephemeral: true })

        const money = parseFloat(interaction.options.getNumber('money'))
        if (money <= 0) return interaction.reply({ content: `金額不得小於0`, ephemeral: true })

        const payee = await GetUserMoney(payuser.ign)
        const payer = await GetUserMoney(finduser.ign)
        if (payer === '玩家沒有註冊帳號' || payee === '玩家沒有註冊帳號') return interaction.editReply({ content: `你或對方沒有註冊帳號(或還沒登入過伺服器)`, ephemeral: true })
        if(payer < money) return interaction.editReply({ content: `你的餘額不足`, ephemeral: true })

        await TakeUserMoney(finduser.ign, money)
        await GiveUserMoney(payuser.ign, money)

        const embed = new EmbedBuilder()
            .setTitle('轉帳成功')
            .setDescription(`以成功將 \`${money}\` 元轉帳給 \`${targetuser.username} [${payuser.ign}]\``)
            .addFields(
                { name: '你的餘額 - ' + money, value: `\`${payer - money}\``, inline: true },
                { name: '對方的餘額 + ' + money, value: `\`${payee + money}\``, inline: true }
            )
            .setTimestamp()

        const payeeembed = new EmbedBuilder()
            .setTitle('收到轉帳')
            .setDescription(`你已經收到 \`${money}\` 元來自 \`${interaction.user.tag} [${finduser.ign}]\``)
            .addFields(
                { name: '你的餘額 - ' + money, value: `\`${payer - money}\``, inline: true },
                { name: '對方的餘額 + ' + money, value: `\`${payee + money}\``, inline: true }
            )
            .setTimestamp()

        const logdata = {
            payer: finduser.ign,
            payee: payuser.ign,
            amount: money,
            time: getCurrentDateTime()
        }

        await client.db.push('paylog', logdata)
        await interaction.editReply({ embeds: [embed] })
        await targetuser.send({ embeds: [payeeembed] })

    }
}