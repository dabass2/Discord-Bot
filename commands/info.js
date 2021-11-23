const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Gives info about a user'),
    async execute(interaction, msgEmbed) {
        let user = interaction.user

        msgEmbed
            .setDescription(`User Information for ${user.username}`)
            .setColor(0x0a2b63)
            .setThumbnail(user.displayAvatarURL())
            .addField('Username', user.username)
            .addField('Tag', user.tag)
            .addField('ID', user.id)
            .addField('User Created on', new Date(user.createdAt).toString())
        await interaction.reply({ embeds: [msgEmbed] })
    }
};
