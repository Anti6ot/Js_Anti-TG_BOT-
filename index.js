const TelegramApi = require('node-telegram-bot-api');
// const {gameOptions, againOptions} = require('./options')    импорт из файл options.js
const token = "5752211637:AAGNpBqUhxK2zDJwuaKdm7AwcsFDuZ9nWLs"; 

const bot = new TelegramApi(token, {polling: true}); 

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data:'1'} , {text: '2', callback_data:'2'} , {text: '3', callback_data:'3'}],
            [{text: '4', callback_data:'4'} , {text: '5', callback_data:'5'} , {text: '6', callback_data:'6'}],
            [{text: '7', callback_data:'7'} , {text: '8', callback_data:'8'} , {text: '9', callback_data:'9'}],
            [{text: '0', callback_data:'0'}],
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Заново', callback_data:'/again'}],
        ]
    })
}

const startGame = async (chatId) => {        //Чтобы не дублировать логику - которая заново генерирует случайное число когда нажмем кнопку "Заново"
    await bot.sendMessage(chatId, 'Я загадаю число от 1 до 10, а ты долженего отгадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `отгадывай ${chats[chatId]}`, gameOptions)
}          

const start = () => {
    bot.setMyCommands([
        {command: '/start', description:'Начать общение с ботом'},
        {command: '/info', description:'Инфо'},
        {command: '/game', description: 'Игра'}
    ])

    bot.on("message", async msg => {      //обработчик событий
        const text = msg.text;
        const chatId = msg.chat.id;   //получаем чат ид и текст сообщения
    
        if(text === "/start"){        //хардим по условию
            await bot.sendMessage(chatId, `Добро пожаловать на канал channel Js-Kit`)
            return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/e04/90b/e0490ba1-4c50-4ddd-940c-ef97b79c73ed/2.webp" )
        }
        if(text === "/info"){
            return bot.sendMessage(chatId, `your call ${msg.from.first_name} ${msg.from.username}`)
        }
        if(text === "/game"){
            return startGame(chatId);
        }
        
        
        bot.sendMessage(chatId, "Я тебя не понимаю")

    })

    bot.on("callback_query", async msg => {     // Обработчик/слушатель событии клавиатуры( кнопок)
        const data = msg.data;
        const chatId = msg.message.chat.id;
        // console.log(msg)

        if(data === "/again"){
            return startGame(chatId);
        }
        if(+data === chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю ты отгадал ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `К сожалению не угадал ${chats[chatId]}`, againOptions)
        }
    })
}
start ()
