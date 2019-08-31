class PinStorage {
  constructor(guildID, channelID, msgID)
  {
    this.guildID = guildID;
    this.channelID = channelID;
    this.msgID = msgID;
    console.log(`'Created PinStore with ID's: ${guildID}, ${channelID}, ${msgID}'`)
  }
}
