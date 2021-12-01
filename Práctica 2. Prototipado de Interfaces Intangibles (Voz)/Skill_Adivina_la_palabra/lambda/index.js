/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
 
 
 
const Alexa = require('ask-sdk-core');
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
       const firstword = hideword(); //se llama por primera vez aqui a hideword para que las variables cojan los valores correspondientes
        let speakOutput = 'Hola! y bienvenido a adivina la palabra!. ' ;
            speakOutput += 'Si no conoces las reglas del juego pideme ayuda ... Si ya lo conoces ... Comencemos\n! '
            speakOutput += 'La palabra que tienes que adivinar empieza por la letra ' + word.value[0] +  ' y tiene ' + word.value.length + ' letras: \n ' + firstword;
       

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*------------------------------------------------------------------------------
Funcion que recoge la respuesta y mira si es correcta o no
---------------------------------------------------------------------------------
*/


const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
    handle(handlerInput) {
        
        let speakOutput = '';

        const respuestaValue = handlerInput.requestEnvelope.request.intent.slots.Answer.value;
        if (word.value === respuestaValue)
        {
            speakOutput = 'Enhorabuena!, Has acertado!!, La palabra era: ' + word.value;
            finished = true;
            retry = 0;
            
        }
        else 
        {
            if(retry < 3)
            {
            retry +=1;
            speakOutput = '...Error. Esa no era la palabra  tienes (' + retry + ' de 3) intentos más!..\n '
            speakOutput += 'La palabra a adivinar empezaba por la letra ' + word.value[0] +  ' y tiene ' + word.value.length + ' letras: \n ' + hidden_word;
        
            }
            
        
        else
        {
            speakOutput = '...Error. La respuesta es incorrecta ...  La respuesta correcta era: ' + word.value;
            retry = 0;
            finished = true;
        }
        }
        
        if (finished)
        {
        finished = false;
       speakOutput += ' ¿Quieres continuar? Si / No';
       word = null;
       
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

/*-------------------------------------------------------------------------------
handler que recoge la continuacion del juego
---------------------------------------------------------------------------------
*/

const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const hidden_word = hideword(); //cuando le pregunta si quiere continuar y al decir que si se da otra palabra y se oculta simplemente llamando a la funcion hideword()
        const speakOutput = '... Vamos con la siguiente palabra entonces ... la palabra que tienes que adivinar empieza por la letra ' + word.value[0] +  ' y tiene ' + word.value.length + ' letras\n ' + hidden_word;
       

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*---------------------------------------------------------------------------------
handler que recoge una letra y actualiza la palabra 
---------------------------------------------------------------------------------
*/

const CharacterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CharacterIntent';
    },
    handle(handlerInput) 
    {
       var CharValue = handlerInput.requestEnvelope.request.intent.slots.Character.value; //recoge la letra
       let speakOutput = '';
      
        var updatedWord = '';
        if(retry < 3)
            updatedWord = UpdateWord(CharValue);
        if(retry < 3 && updatedWord[1]) //si el bool de la funcion de abajo es true significa que la letra que ha dicho se encuentra en la palabra
        {
            speakOutput = 'Se han encontrado ' + updatedWord[2] + ' ' + CharValue + ' ...  Actualizando: Te recuerdo que ' ;
        }
        else
            if(retry < 3)
            {
                retry += 1;
                speakOutput = 'Esta palabra no contiene la letra ' + CharValue + ', tienes (' + retry + ' de 3) intentos más!... Te recuerdo que';
            } 
        else
        {
            speakOutput = 'Lo siento te has quedado sin intentos... Intenta adivinar la palabra ahora.... ';
      
        }
        if(finished === false)
        speakOutput += 'la palabra a adivinar empezaba por la letra ' + word.value[0] +  ' y tiene ' + word.value.length + ' letras: \n ' + hidden_word;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        
        
        let speakOutput = 'Te voy a explicar las reglas del juego que vas a jugar:\n';
            speakOutput += 'En primer lugar te van a dar una palabra oculta que tendrás que adivinar... y podrás realizar una de las siguientes acciones:\n';
            speakOutput += 'Puedes pedirme una letra que creas que podría contener la palabra, o bien puedes intentar adivinar la palabra...' ;
            speakOutput += 'Pero ojo cada vez que falles al adivinar o la letra que pidas no se encuentre en la palabra se te descontará una vida...  y recuerda solo tienes 3 así que aprovechalas!!';
            speakOutput += 'Te recuerdo la palabra que tenias que adivinar:\n ' + hidden_word;
                        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {                                                        
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adios, tenga un buen dia!';                // Mensaje de salida (alexa adios)

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no sé que significa esto. Si necesitas ayuda pideméla!.'; // Sorry, I don\'t know about that. Please try again

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Error: No se que significa esto. Porfavor escriba correctamente. Si necesitas ayuda pideme ayuda';  // Mensaje de error  'Sorry, I had trouble doing what you asked. Please try again.'
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const wordlist = require('./world-list'); //aqui se usa para guardar en world-list el objeto lista de objetos
var retry = 0;
var hidden_word = null; //esta variable va a tener la palabra ya oculta
var finished = false;
var word = null; //esta variable va a contener un objeto del objeto world-list, con word.value recoge el valor de la palabra a adivinar

function getRandomItem(obj)
{
    if (Object.keys(obj).length === 0)
    {
        return null;
    }

    word = obj[Object.keys(obj)[Math.floor(Math.random()*Object.keys(obj).length)]]; //devuelve valor aleatorio del objeto world-list
    return word;  //nota: no solo te devuelve el valor del objeto y se guarda en la variable con la que invocastes sino tambien se guarda el objeto en la variable global word
}


function hideword() //con esta funcion escondes la palabra
{
    hidden_word = ' '; //creas un string vacio
    const palabra = getRandomItem(wordlist); //aqui llamas a la funcion para que te devuelva el objeto y darle valor a word
    hidden_word = hidden_word.replaceAt(0, palabra.value[0]);  //reemplaza la primera letra del string vacio con la primera letra de la palabra a adivinar
        for (var i =1; i < palabra.value.length ; i++) // rellenas el resto del string con x
        {
            hidden_word += '*';
        }
    
    return hidden_word;
    
}

function UpdateWord(char) //funcion para actualizar la palabra
{
   char = char.charAt(0).toLowerCase() //a veces cuando pides el caracter a alexa (sobre todo con consonantes) te lo devuelve en mayuscula asi nos aseguramos que siempre se compara minuscula con minuscula
    var bool = false; //esto servira en un futuro para decirle al usuario que ha acertado
    var count = 0; //esto sirve para el numero de letras que se ha cambiado
    for(var i = 1 ; i < word.value.length ; i++)
    {
        if(char === word.value[i]) //recorre el string e inspecciona si el caracter que ha dicho el usuario se encuentra dentro de la palabra
        {
            hidden_word = hidden_word.replaceAt(i,word.value[i]);  //si la encuentra reemplaza el caracter de la palabra oculta con el caracter de la palabra del objeto
            bool = true;
            count +=1;
        }
    
    }
    return [hidden_word,bool,count]; //se retorna un array con los valores de la palabra actualizada, el valor de bool, y el numero de veces que ha acertado en las posiciones 0,1,2
}

String.prototype.replaceAt = function(index, replacement) { //esta funcion prototipo permite reemplazar un caracter de una cadena proporcionando un indice
    if (index >= this.length) {
        return this.valueOf(); //devuelve el string si el index es mayor que el tamaño de la cadena
    }
 
    return this.substring(0, index) + replacement + this.substring(index + 1); //parte el string antes del index indicado y despues y le mete la palabra o caracter que quieras en medio
}

/*
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerIntentHandler,
        CharacterIntentHandler,
        HelpIntentHandler,
        YesIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();