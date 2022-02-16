const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daddy')
        .setDescription('help me'),
    async execute(interaction, msgEmbed) {
        msgEmbed
            .setColor("#000000")
            .setTitle("<a:eggplantmedaddy:536970338085634098>")
            .setDescription('<a:eggplantmedaddy:536970338085634098> <a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098>😳<a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098><a:eggplantmedaddy:536970338085634098> <a:eggplantmedaddy:536970338085634098> <a:eggplantmedaddy:536970338085634098>')
            .setThumbnail("https://i.imgur.com/miGCppP.gif")
            .setImage("https://i.imgur.com/miGCppP.gif")
            .setAuthor("Daddy", "https://i.imgur.com/miGCppP.gif")
            .setFooter("🥺", "https://i.imgur.com/miGCppP.gif")
        await interaction.reply({ embeds: [msgEmbed] })
    }
};
