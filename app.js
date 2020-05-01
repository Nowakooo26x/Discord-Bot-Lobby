const Discord = require('discord.js');
const client = new Discord.Client();
const {token, prefix} = require('./config.json')

let TabUsers = [];
//Start bota
client.once('ready', () => {
	console.log('Start bot działa...');
});

//show - funkcja - emot
function showEmotStan(zmienna){
    let msg;

    switch(zmienna){
        case 0:{
            msg = ":red_circle:" 
        }break;
        case 1:{
            msg = ":green_circle:" 
        }break;
        case 2:{
            msg = ":blue_circle:" 
        }break;
    }
    return msg;
}

//show - funkcja
function showLiga(){
    let msg ="**Lobby: **\n";
    if(TabUsers.length < 1){
        msg = "**Lobby jest puste**";
    }else{
        let i = 0;
        for (const user of TabUsers) {
            msg = msg + `${showEmotStan(user[1])} [${i+1}] ${user[0]}\n`;
            i++
        }
    }

    return `${msg}`;
}

//show
client.on('message', message => {
    if (message.content === `${prefix}show`){
        message.channel.send(showLiga());
    } 
}
);

//liga msg
function sendMsgLol(message, args) {
    if (!args.length) {
        message.channel.send(`.\n\n\n\n**Użytkownik ${message.author} zaprasza na grę w LoL'a !** \n\n${showLiga()}\n\n\n\n.`);
        return;
    }
    message.channel.send(`.\n\n\n\n**Użytkownik ${message.author} zaprasza grę w LoL'a o godzinie: ${args[0]}** \n\n${showLiga()}\n\n\n\n.`);
}

//Komenda [/liga (czas)]
let setI;
let startNumerLiga = 0;
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'liga') {
        startNumerLiga++;
        if(startNumerLiga == 2){
            message.channel.send(showLiga());
            stop();
            startNumerLiga = 1;      
        }
            addUserToTabUsers(message, 1);
            sendMsgLol(message, args);
        setI = setInterval(sendMsgLol, 1000*20, message, args);
        }
});
//Stop liga - funkcja
function stop(){
    clearInterval(setI);
    startNumerLiga = 0;
    TabUsers = [];  
}

//Stop liga
client.on('message', message => {
    if (message.content === `${prefix}stop`){
        message.channel.send(showLiga());
        stop();
    }
}
);

//dodaj
function addUserToTabUsers(message, vote){
    let user = message.author;
    let userVote = vote;

    TabUsers.push([user, userVote]);
}

//zmien
function changeStanOnTabUsers(i, wartosc_testUserOnTabUsers){
    userX = TabUsers[i];
    userX[1] = wartosc_testUserOnTabUsers;
}

//TEST
function testUserOnTabUsers(message, wartosc_testUserOnTabUsers){
    let TabLength = TabUsers.length;

    for(i=0; i<TabLength;i++){
        let userX = TabUsers[i];
        if(userX[0] === message.author){

            if(userX[1] == wartosc_testUserOnTabUsers){
                return 1;  
            }else{
                if(wartosc_testUserOnTabUsers === 3){
                    return 2;
                }

                changeStanOnTabUsers(i, wartosc_testUserOnTabUsers)
                return 2;
            }
        }
    }
    if(wartosc_testUserOnTabUsers == 3){
        return 0;
    }

    addUserToTabUsers(message, wartosc_testUserOnTabUsers);
    return 0;   
}
//yes
client.on('message', message => {
    if (message.content === `${prefix}yes`){
        let test = testUserOnTabUsers(message, 1)
        if(test == 0){
            message.channel.send(`${message.author} chce zagrać!`);
        }else if(test == 1){
            message.channel.send(`${message.author} już wiemy że chcesz zagrać!`);
        }else if(test == 2){
            message.channel.send(`${message.author} jednak zmienił zdanie!`);
        }
    }
}
);

//nie
client.on('message', message => {
    if (message.content === `${prefix}no`){
        let test = testUserOnTabUsers(message, 0);
        if(test == 0){
            message.channel.send(`${message.author} nie chce zagrać!`);
        }else if(test == 1){
            message.channel.send(`${message.author} już wiemy że nie chcesz zagrać!`);
        }else if(test == 2){
            message.channel.send(`${message.author} jednak zmienił zdanie!`);
        }
    }
}
);
//delete
function removeUserToTabUsers(zmienna){
    TabUsers.splice(zmienna, 1);
}
//leave
client.on('message', message => {
    if (message.content === `${prefix}leave`){
        let test = testUserOnTabUsers(message, 3);
        if(test == 0){
            message.channel.send(`${message.author} nie znajdujesz się w lobby!`);
        }else if(test == 2){
            let TabLength = TabUsers.length;
            for(i=0; i<TabLength;i++){
                let userX = TabUsers[i]
                if(userX[0] === message.author){
                    removeUserToTabUsers(i)
                    message.channel.send(`${message.author} usunięto Cię z lobby!`);
                    return;
                }
            }
        }
    }
});

//182 
/*
!show
!no
!show
*/
////Delete msg -function

//Delete msg
client.on('message', message => {
    if (message.content.startsWith(`${prefix}`)) {
        setTimeout(()=>{message.delete()}, 1500);
    }
 });
 client.on('message', message => {
    let msgToChar = message.content.charAt(0);
    if(!(msgToChar == prefix) && !(message.author.bot)){
        message.delete();
    }
 });

 //TESTOWANIE
 client.on('message', message => {
    if (message.channel.id === '702269891348136040') {
    if (message.content == `!test`) {

        message.channel.send("\`\`\`CSS\n asd \`\`\`")
    }
    }
 });


client.login(token);