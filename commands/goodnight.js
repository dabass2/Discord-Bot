const { SlashCommandBuilder } = require('@discordjs/builders');
const curse = require("./daddy")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodnight')
        .setDescription('Wishes a homie goodnight : )'),
    async execute(interaction, msgEmbed) {
        a = Math.floor(Math.random() * 11);

        let img
        if (a >= 8) {
            await curse.execute(interaction, msgEmbed)
            return
        } else if (a == 3) {
            img = "https://c.tenor.com/6l7lYskHVDQAAAAC/baal-genshin-baal.gif"
        } else {
            img = "https://i.imgur.com/Hy0cpR2.png"
        }

        msgEmbed
            .setColor("#000000")
            .setDescription('Goodnight homie! : ) :heart:')
            .setImage(img)
        await interaction.reply({ embeds: [msgEmbed] })
    }
};
