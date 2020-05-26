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
  * main() will be run when teh action is invoked
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

    try {


      const languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        authenticator: new IamAuthenticator({
          apikey: 'rMEJ0JpoHy6bT4LyQ8SQP3pPmvqXGxLCqYL3GzelYROZ',
        }),
        url: 'https://api.eu-de.language-translator.watson.cloud.ibm.com/instances/e780ff06-5c9c-43e2-8ceb-3a51268e0bc0',
      });

      const translateParams = {
        text: 'Hello, we are Group 11!',
        modelId: 'en-nl',
      };

      languageTranslator.translate(translateParams)
        .then(translationResult => {

          resolve({
            statusCode: 200,
            body: {
              translations: translationResult.result.translations[0].translation,
              words: 1,
              characters: 11,
            },
            headers: { 'Content-Type': 'application/json' }
          });

        })
        .catch(err => {
          console.log('error:', err);
        });




    } catch (err) {
      console.error('Error while initializing the AI service', err);
      resolve(getTheErrorResponse('Error while communicating with the language service', defaultLanguage));
    }
  });
}
