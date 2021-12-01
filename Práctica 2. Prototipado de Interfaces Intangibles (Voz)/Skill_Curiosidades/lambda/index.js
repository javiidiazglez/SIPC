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
      //  return GetFactIntentHandler.handle(handlerInput);
       const speakOutput = 'Hola bienvenido a Curiosidades de microorganismos, Quieres saber una curiosidad? ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetNewFactIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetNewFactIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const speakOutput = RandomItem(CURIOSIDADES);

        return handlerInput.responseBuilder
            .speak(speakOutput + RandomItem(PREGUNTAS))
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
        const speakOutput = 'Puedes consultar una curiosidad tan solo pidiéndola';

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
        const speakOutput = 'Adios, tenga un buen día';

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
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

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
        const speakOutput = 'Perdona, se ha producido un error. Vuelva a intentarlo de nuevo';
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function RandomItem(array) { // <--- necessary to obtain a random element of an array
    return array[Math.floor(Math.random()*array.length)]
}

const CURIOSIDADES = [
    
    'En tu boca hay más microorganismos que personas en la Tierra',
    'En una sola gota de saliva hay más de 100 millones de microorganismos',
    'Pese a la gran cantidad de microorganismos, solo 500 de ellos son patógenos y solo 50 producen enfermedades graves ',
    'Si eliminaras todas las bacterias que están dentro de tu cuerpo perderías cerca de 2 kilos y medio ',
    'Si pusiéramos en fila a las bacterias de la Tierra, formarían una línea de 400 millones años Luz ',
    'Nuestro cuerpo es el hogar de 40 millones de millones de bacterias. ',
    'En tu cuerpo se aloja mas ADN bacteriano que humano. ',
    'El olor desagradable en nuestra boca por la mañana es debido a la producción, durante la noche, de compuestos volátiles por parte de las bacterias de nuestra boca. ',
    'Bacillus safensis es una bacteria capaz de crecer en el espacio y crece mejor que en la Tierra. ',
    'Se cree que las bacterias que habitan en el tracto intestinal puede producir compuesto con el potencial de alterar la química del cerebro produciendo ansiedad o depresión. ',
    'Existen bacterias que se alimentan de plástico. ',
    'Las bacterias tiene una posibilidad de crear unas moléculas con las que pueden comunicarse entre ellas. ',
    'Existen bacterias capaces de generar luz a través de distintas reacciones. ',
    'Shewanella banthica es una bacteria que vive en el lecho marino de la Fosa de las Marianas soportando una presión 1000 veces superior a la de la superficie. ',
    'Burkholderia mallei es una bacteria con un 95% de letalidad sin tratamiento que se contagia a través de los caballos. ',
    'Gracias a muchas vacterias tenemos distintas comidas como cervezas, quesos y vinos. ',
    'El tamaño de los microorganismos oscila entre los 0.5 y los 5 micrómetros. ',
    'En un solo gramo de tierra hay mas de 40 millones de bacterias. ',
    'Pese a conocer cerca de 10.000 especies de microorganismos, se estima que esto es menos del 1% de las que habitan en la Tierra. '
    ];
    
const PREGUNTAS = [
    
    'Quiere otra curiosidad? ',
    'Quiere saber más? ',
    'Quiere continuar? ',
    'Le gustaria saber más? ',
    'Te digo otra? ',
    'Te digo alguna curiosidad más?',
    'Te digo más? ',
    'Te digo la siguiente?',
    'Quieres saber la siguiente?',
    'Te gustaría otra curiosidad más? ',
    'Querrías obtener otra curiosidad? ',
    'Se muchas curiosidades más, Quieres otra?'
    ];

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetNewFactIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();