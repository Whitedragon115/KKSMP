const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js')
const { GetUUID, GetIGN } = require('../../function/minecraft.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('尋找一個遊戲帳號的所有者')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('byign')
            .setDescription('尋找一個遊戲帳號的Discord所有者')
            .addStringOption(option => option
                .setName('ign')
                .setDescription('遊戲帳號')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('bydiscord')
            .setDescription('尋找一個Discord帳號的所有遊戲帳號')
            .addUserOption(option => option
                .setName('user')
                .setDescription('使用者')
                .setRequired(true)
            )
        )
    ,

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case 'byign':
                FindByIGN()
                break;
            case 'bydiscord':
                FindByDiscord()
                break;
            default:
                break;
        }

        async function FindByDiscord() {
            const user = interaction.options.getUser('user');

            const finduserac = await client.db.get('Account').then(res => { return res.find(arr => arr.id == user.id) })
            if (!finduserac) return interaction.reply({ content: `使用者未註冊`, ephemeral: true })

            const embed = new EmbedBuilder()
                .setTitle('使用者查詢')
                .setDescription(`使用者${user}的帳號資訊為以下`)
                .addFields(
                    { name: '狀態', value: finduserac.ban ? ':red_circle: 封鎖' : ':green_circle: 正常', inline: true },
                    { name: 'ID', value: `\`${user.id}\``, inline: true },
                    { name: '帳號號列表', value: '~~-------------------~~', inline: false }
                )

            for (let i = 0; i < finduserac.ign.length; i++) {
                embed.addFields({ name: `帳號 \`< ${i + 1} >\``, value: `> \`${await GetIGN(finduserac.ign[i])}\``, inline: true })
            }

            await interaction.reply({ embeds: [embed] })
        }

        async function FindByIGN() {
            const ign = interaction.options.getString('ign')?.replace(/\s/g, '').toLowerCase();
            const ignuuid = await GetUUID(ign)

            const findignowner = await client.db.get('Account').then(res => { return res.find(arr => arr.ign.some(id => id == ignuuid) == true) })
            if (!/^[a-zA-Z0-9_]+$/.test(ign)) return interaction.reply({ content: `遊戲id只能包含英文數字和底線`, ephemeral: true })
            if (!findignowner) return interaction.reply({ content: `使用者未註冊`, ephemeral: true })

            const user = interaction.guild.members.cache.get(findignowner.id)

            const embed = new EmbedBuilder()
                .setTitle('帳號查詢')
                .setDescription(`遊戲帳號 \`${ign}\` 的所有者為 ${user}`)
                .addFields(
                    { name: '狀態', value: findignowner.ban ? ':red_circle: 封鎖' : ':green_circle: 正常', inline: true },
                    { name: 'ID', value: `\`${findignowner.id}\``, inline: true },
                )

            await interaction.reply({ embeds: [embed] })
        }

    },
}