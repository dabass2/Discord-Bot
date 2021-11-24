const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('praise')
        .setDescription('Praises user'),
    async execute(interaction, msgEmbed) {
        const praiseArray = ["You're the best!", "Everything you do is great!",
            "You're so funny!", "I love being around you!", "ur cute ; )", "im not real and you're alone.",
            "Ben only says mean things because he loves you!", "You're a great person!",
            "People love you!", "i bet you like playing riven lmfao", "You light up the room!",
            "You have a great sense of humor!", "Being around you is like a happy little vacation!"
        ]
        
        let randPraise = praiseArray[Math.floor(Math.random() * praiseArray.length)];
        msgEmbed
            .setColor('#ff8e92')
            .setDescription(`Hey, <@!` + interaction.user.id + `> did you know that...` + `**` + randPraise + `**`)
        await interaction.reply({ embeds: [msgEmbed] })
    },
};
