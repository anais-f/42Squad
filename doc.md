## DB 
3 tables :
- [X] une de channels : channelID - msg ID
- [X] une de student : login (string et non nullable) - host (null ou string)
- [] une chan/user : ChannelID - loginID !! DB relationnel

Requete sur tous les users de la DB, MAJ la DB et ensuite on envoit dans les messages dans chaque channel (et non les chan qui requete l'api)

## Commands
- [X] /addChannel
- [X] /deleteChannel
- [] /addLogin
- [] /deleteLogin

## See
foreign key en SQL -> champ != string mais lien entre tables de DB (DB relationnelle)
