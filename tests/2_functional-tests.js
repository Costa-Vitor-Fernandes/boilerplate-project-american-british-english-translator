const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    //1
    test('Translation with text and locale fields: POST request to /api/translate', function (done) {
        chai
          .request(server)
          .post('/api/translate')
          .set('content-type', 'application/json')
          .send({text: 'abseil', locale:'british-to-american'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body, 'esponse body')
            assert.equal(res.body.translation, '<span class="highlight">rappel</span>' )
            done();
          });
      });
      //2
      test('Translation with text and  invalid locale fields: POST request to /api/translate', function (done) {
        chai
          .request(server)
          .post('/api/translate')
          .set('content-type', 'application/json')
          .send({text: 'abseil', locale:'british'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body, 'response body')
            assert.equal(res.body.error, 'Invalid value for locale field' )
            done();
          });
      });
      //3
      test('Translation with missing text field: POST request to /api/translate', function (done) {
        chai
          .request(server)
          .post('/api/translate')
          .set('content-type', 'application/json')
          .send({locale:'british-to-american'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body, 'response body')
            assert.equal(res.body.error, 'Required field(s) missing' )
            done();
          });
      });
      //4
      test('Translation with missing locale field: POST request to /api/translate', function (done) {
        chai
          .request(server)
          .post('/api/translate')
          .set('content-type', 'application/json')
          .send({text: 'abseil'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body, 'response body')
            assert.equal(res.body.error, 'Invalid value for locale field' )
            done();
          });
      });

      //5
      test('Translation with empty text: POST request to /api/translate', function (done) {
        chai
          .request(server)
          .post('/api/translate')
          .set('content-type', 'application/json')
          .send({text: '', locale:'american-to-british'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            // console.log(res.body, 'response body')
            assert.equal(res.body.error, 'No text to translate' )
            done();
          });
      });
            //6
            test('Translation with text that needs no translation: POST request to /api/translate', function (done) {
                chai
                  .request(server)
                  .post('/api/translate')
                  .set('content-type', 'application/json')
                  .send({text: 'i have a ball', locale:'american-to-british'})
                  .end(function (err, res) {
                    assert.equal(res.status, 200);
                    // console.log(res.body, 'response body')
                    assert.equal(res.body.translation, 'Everything looks good to me!' )
                    done();
                  });
              });
});

