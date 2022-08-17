const { SlashCommandBuilder } = require('@discordjs/builders');
const curse = require("./daddy")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodnight')
        .setDescription('Wishes a homie goodnight : )'),
    async execute(interaction, msgEmbed) {
        const NIGHTS = ["https://c.tenor.com/6l7lYskHVDQAAAAC/baal-genshin-baal.gif", "https://i.imgur.com/Hy0cpR2.png",
            "https://c.tenor.com/pEykNQWTaKIAAAAC/pepe-pepo.gif",
            "https://cdn.discordapp.com/attachments/110419059232780288/974151832433741884/original.jpg",
            "https://c.tenor.com/ZDF0F9Ehj0IAAAAC/hasanabi-hasan-piker.gif", "curse"]
        const img = NIGHTS[Math.floor(Math.random() * NIGHTS.length)]
        if (img === "curse") {
            await curse.execute(interaction, msgEmbed)
            return
        }

        msgEmbed
            .setColor("#000000")
            .setDescription('Good night homie! : ) :new_moon_with_face:')
            .setImage(img)
        await interaction.reply({ embeds: [msgEmbed] })
    }
};