const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tara')
        .setDescription('Sends a picture of the biggest idiot ever'),
    async execute(interaction, msgEmbed) {
        const directory = '/var/www/leinad/html/images/tara/';
        const fs = require('fs');
        let imgArray = []

        fs.readdirSync(directory).forEach(file => {
            imgArray.push(file)
        });
        var num = Math.floor(Math.random() * imgArray.length)
        let link = "https://leinad.pw/images/tara/" + imgArray[num]
        if (link.includes('.mp4')) {
            await interaction.reply({ content: `The Idiot\n${link}` })
            return
        }
        msgEmbed
            .setColor(0x000000)
            .setDescription("The Idiot")
            .setImage(link)
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
