const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edward')
        .setDescription('Sends a picture of our lord'),
    async execute(interaction, msgEmbed) {
        const directory = '/var/www/leinad/html/images/edward/';
        const fs = require('fs');
        let imgArray = []

        fs.readdirSync(directory).forEach(file => {
            imgArray.push(file)
        });
        var num = Math.floor(Math.random() * imgArray.length)
        let link = "https://leinad.pw/images/edward/" + imgArray[num]

        msgEmbed
            .setColor(0xf4b042)
            .setDescription("King")
            .setImage(link)
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
