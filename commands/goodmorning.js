const { SlashCommandBuilder } = require('@discordjs/builders');
const seedrandom = require('seedrandom');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodmorning')
        .setDescription('Wishes a homie goodmorning : )'),
    async execute(interaction, msgEmbed) {
        const MORNINGS = [
            "https://c.tenor.com/NdzzTkkCvB4AAAAC/peepo-wiadro.gif",
            "https://i.imgur.com/u2IfXac.png",
            "https://c.tenor.com/_uvamdwOdV8AAAAd/yae-genshin.gif",
            "https://c.tenor.com/uCq8oxh_qQ4AAAAd/hasan-abi.gif",
            "https://media.tenor.com/JYdLzHJk9qUAAAAC/kiryu-coco-picmix.gif"
        ]
        let now = new Date();
        let rng = seedrandom(interaction.user.id + now.getDate() + now.getMonth() + now.getFullYear());
        const img = MORNINGS[Math.floor(rng() * MORNINGS.length)]

        msgEmbed
            .setColor("#ffffff")
            .setDescription('Good morning homie! : ) :sun_with_face:')
            .setImage(img)
        await interaction.reply({ embeds: [msgEmbed] })
    }
};
