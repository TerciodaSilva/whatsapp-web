const { Client, LocalAuth, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');


const store = {

}


const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
        authStrategy: new LocalAuth()
    },
    authStrategy: new LocalAuth({
        dataPath: "sessions",
    }),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', qr => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
})

client.on('ready', () => {
    console.log('READY');
});

client.on('message_create', async message => {

    // Emergencia -> Localização -> Você -> Resgate Urgente -> numero de pessoas -> Descrição da situacação
    if (store[message.from] == "Resgate Urgente referencia por perto") {
        let response = "Descreva a situação e o risco iminente"
        store[message.from] = "Resgate Urgente finalização"
        client.sendMessage(message.from, response)
    }

    if (message.body == '!init') {
        let response = "1 - Emergência\n 2 - Atendimento Médico\n 3 - Outras informações"
        store[message.from] = "init"
        client.sendMessage(message.from, response)
    }

    if (message.location !== undefined) {
        console.log(message.location.latitude, message.location.longitude)

        // Emergencia -> Localização
        if (store[message.from] == "Emergencia Localização") {
            let response = "1 - Para você\n2 - Para outra pessoa"
            store[message.from] = "Atendimento para quem"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização
        if (store[message.from] == "Outra Pessoa Localização") {
            let response = "Existe alguma referência por perto?"
            store[message.from] = "Outra Pessoa Referencia"
            client.sendMessage(message.from, response)
        }   
    
    }

    // Emergencia -> Localização
    if (store[message.from] == "Outra Pessoa Referencia") {
        let response = "Descreva a situação e o risco iminente"
        store[message.from] = "Finalização"
        client.sendMessage(message.from, response)
    }   

    // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
    if (store[message.from] == "Estou Isolado ou ilhado referencia") {
        let response = "Descreva a situação e o risco iminente"
        store[message.from] = "Estou Isolado ou ilhado situaçao"
        client.sendMessage(message.from, response)
    }    

    // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
    if (store[message.from] == "Estou Isolado ou ilhado situaçao") {
        let response = "Finalização"
        store[message.from] = "Finalização"
        client.sendMessage(message.from, response)
    }   

    // Emergencia -> Localização
    if (store[message.from] == "Outra Pessoa número de telefone") {
        let response = "Qual a localização do atendimento?"
        store[message.from] = "Outra Pessoa Localização"
        client.sendMessage(message.from, response)
    }   

    if (message.body == "1") {
        // Emergencia
        if (store[message.from] == "init") {
            let response = "Compartilhe a Geolocalização tempo real"
            store[message.from] = "Emergencia Localização"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você
        if (store[message.from] == "Atendimento para quem") {
            let response = "1 - Resgate Urgente\n2 - Atendimento médico\n3 - Estou Isolado ou ilhado"
            store[message.from] = "Você"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Resgate Urgente
        if (store[message.from] == "Você") {
            let response = "Número de pessoas\n\n1 - 1 pessoa\n2 - 2 pessoas\n3 - +3 pessoas"
            store[message.from] = "Resgate Urgente número de pessoas"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Resgate Urgente -> numero de pessoas
        if (store[message.from] == "Resgate Urgente número de pessoas") {
            let response = "Existe alguma referencia por perto?"
            store[message.from] = "Resgate Urgente referencia por perto"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico -> numero de pessoas
        if (store[message.from] == "Você Atendimento médico") {
            let response = "Protocolo da SAMU\n\nTem as seguintes complicações?\nDor no peito\nFalta de ar\nPerda de consciência\nSofreu algum trauma ou queda\n1 - Sim\n2 - Não"
            store[message.from] = "sintomas"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico -> numero de pessoas
        if (store[message.from] == "sintomas") {
            let response = "Manda URL para abrir camera"
            store[message.from] = "Você Atendimento Médico Finalização"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
        if (store[message.from] == "Estou Isolado ou ilhado") {
            let response = "Existe alguma referência por perto?"
            store[message.from] = "Estou Isolado ou ilhado referencia"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização
        if (store[message.from] == "Outra Pessoa") {
            let response = "Número de telefone da pessoa a ser atendida"
            store[message.from] = "Outra Pessoa número de telefone"
            client.sendMessage(message.from, response)
        }        

    }

    if (message.body == "2") {
        // Ajuda Humanitária
        if (store[message.from] == "init") {

        }

        // Emergencia -> Localização -> Você -> Resgate Urgente -> numero de pessoas
        if (store[message.from] == "Resgate Urgente número de pessoas") {
            let response = "Existe alguma referencia por perto?"
            store[message.from] = "Resgate Urgente referencia por perto"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico
        if (store[message.from] == "Você") {
            let response = "Número de pessoas\n\n1 - 1 pessoa\n2 - 2 pessoas\n3 - +3 pessoas"
            store[message.from] = "Você Atendimento médico"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico -> numero de pessoas
        if (store[message.from] == "Você Atendimento médico") {
            let response = "Protocolo da SAMU\n\nTem as seguintes complicações?\nDor no peito\nFalta de ar\nPerda de consciência\nSofreu algum trauma ou queda\n1 - Sim\n2 - Não"
            store[message.from] = "sintomas"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico -> numero de pessoas
        if (store[message.from] == "sintomas") {
            let response = "Finalização"
            store[message.from] = "Você Atendimento Médico Finalização"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
        if (store[message.from] == "Estou Isolado ou ilhado") {
            let response = "Existe alguma referência por perto?"
            store[message.from] = "Estou Isolado ou ilhado referencia"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização
        if (store[message.from] == "Emergencia Localização") {
            let response = "1 - Resgate Urgente\n2 - Atendimento médico\n3 - Estou Isolado ou ilhado"
            store[message.from] = "Outra Pessoa"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização
        if (store[message.from] == "Outra Pessoa") {
            let response = "Número de telefone da pessoa a ser atendida"
            store[message.from] = "Outra Pessoa número de telefone"
            client.sendMessage(message.from, response)
        }   

    }

    if (message.body == "3") {
        // Outras informações
        if (store[message.from] == "init") {

        }

        // Emergencia -> Localização -> Você -> Resgate Urgente -> numero de pessoas
        if (store[message.from] == "Resgate Urgente número de pessoas") {
            let response = "Existe alguma referencia por perto?"
            store[message.from] = "Resgate Urgente referencia por perto"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Atendimento Médico -> numero de pessoas
        if (store[message.from] == "Você Atendimento médico") {
            let response = "Protocolo da SAMU\n\nTem as seguintes complicações?\nDor no peito\nFalta de ar\nPerda de consciência\nSofreu algum trauma ou queda\n1 - Sim\n2 - Não"
            store[message.from] = "sintomas"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
        if (store[message.from] == "Você") {
            let response = "Número de pessoas\n\n1 - 1 pessoa\n2 - 2 pessoas\n3 - +3 pessoas"
            store[message.from] = "Estou Isolado ou ilhado"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização -> Você -> Estou Isolado ou ilhado
        if (store[message.from] == "Estou Isolado ou ilhado") {
            let response = "Existe alguma referência por perto?"
            store[message.from] = "Estou Isolado ou ilhado referencia"
            client.sendMessage(message.from, response)
        }

        // Emergencia -> Localização
        if (store[message.from] == "Outra Pessoa") {
            let response = "Número de telefone da pessoa a ser atendida"
            store[message.from] = "Outra Pessoa número de telefone"
            client.sendMessage(message.from, response)
        }   
    }



});