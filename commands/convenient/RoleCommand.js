const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Give role to a user')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add role to a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('User you want to add')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Role you want to add')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove role to a user')
            .addUserOption(option => option
                .setName('user')
                .setDescription('User you want to remove')
                .setRequired(true)
            )
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Role you want to remove')
                .setRequired(true)
            )
        )
    ,

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: `**You don't have permission**`, ephemeral: true })
        }

        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const subcommand = interaction.options.getSubcommand()
        const member = interaction.guild.members.cache.get(user.id)

        switch (subcommand) {
            case 'add':
                AddRole()
                break;
            case 'remove':
                RemoveRole()
                break;
        }

        async function AddRole() {
            try {
                if (member.roles.cache.some((rl) => rl.id == role.id)) {
                    return interaction.reply({ content: `使用者已經有這個身分組了`, ephemeral: true })
                }
                const embed = new EmbedBuilder()
                    .setTitle(`加入身分組成功`)
                    .setDescription(`> 身分組 ${role} 已經加入到 ${user}`)

                await member.roles.add(role)
                interaction.reply({ embeds: [embed] })
            } catch (error) {
                console.log(error)
                return interaction.reply({ content: `something went wrong adding role ${role}`, ephemeral: true })
            }
        }

        async function RemoveRole() {
            try {
                if (!member.roles.cache.some((rl) => rl.id == role.id)) {
                    return interaction.reply({ content: `使用者已經沒有這個身分組了`, ephemeral: true })
                }
                const embed = new EmbedBuilder()
                    .setTitle(`移除身分組成功`)
                    .setDescription(`> 身分組 ${role} 已經從 ${user} 移除了`)

                await member.roles.remove(role)
                interaction.reply({ embeds: [embed] })
            } catch (error) {
                console.log(error)
                return interaction.reply({ content: `something went wrong removing role ${role}`, ephemeral: true })
            }
        }



    },
}