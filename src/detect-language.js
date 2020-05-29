const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');


/**
 * Helper
 * @param {*} errorMessage
 * @param {*} defaultLanguage
 */
function getTheErrorResponse(errorMessage, defaultLanguage) {
  return {
    statusCode: 200,
    body: {
      language: defaultLanguage || 'en',
      errorMessage: errorMessage
    }
  };
}

/**
  *
  * main() will be run when the action is invoked
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
function main(params) {

  /*
   * The default language to choose in case of an error
   */
  const defaultLanguage = 'en';
  return new Promise(function (resolve, reject) {

    const languageTranslator = new LanguageTranslatorV3({
      version: '2018-05-01',
      authenticator: new IamAuthenticator({
        apikey: 'rMEJ0JpoHy6bT4LyQ8SQP3pPmvqXGxLCqYL3GzelYROZ',
      }),
      url: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/e780ff06-5c9c-43e2-8ceb-3a51268e0bc0',
    });

    try {
      languageTranslator.identify(params)
        .then(identifiedLanguages => {

          resolve({
            statusCode: 200,
            body: {
              input: params.text,
              language: identifiedLanguages.result.languages[0].language,
              confidence: identifiedLanguages.result.languages[0].confidence,
            },
            headers: { 'Content-Type': 'application/json' }
          });

        })
        .catch(err => {
          console.error('Error while initializing the AI service', err);
          resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
        });


    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
