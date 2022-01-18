const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodmorning')
        .setDescription('Wishes a homie goodmorning : )'),
    async execute(interaction, msgEmbed) {
        let mornings = ["https://c.tenor.com/NdzzTkkCvB4AAAAC/peepo-wiadro.gif", "https://i.imgur.com/u2IfXac.png", "https://c.tenor.com/_uvamdwOdV8AAAAd/yae-genshin.gif"]
        img = mornings[Math.floor(Math.random() * mornings.length)]

        msgEmbed    
            .setColor("#ffffff")
            .setDescription('Good morning homie! : ) :sun_with_face:')
            .setImage(img)
        await interaction.reply({ embeds: [msgEmbed] })
    }
  };
  