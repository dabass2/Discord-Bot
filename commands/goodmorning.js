const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodmorning')
        .setDescription('Wishes a homie goodmorning : )'),
    async execute(interaction, msgEmbed) {
        a = Math.floor(Math.random() * 11);

        let img
        if (a >= 8) {   // 20% chance
            img = "https://c.tenor.com/NdzzTkkCvB4AAAAC/peepo-wiadro.gif"
        } else {        // 80% chance
            img = "https://i.imgur.com/u2IfXac.png"
        }

        msgEmbed    
            .setColor("#ffffff")
            .setDescription('Good morning homie! : ) :sun_with_face:')
            .setImage(img)
        await interaction.reply({ embeds: [msgEmbed] })
    }
  };
  