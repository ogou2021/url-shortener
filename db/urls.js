const Joi = require('joi');
const db = require('./connection');

const urls = db.get('urls');

const schema = Joi.object().keys({
  name: Joi.string().token().min(1).max(100).required(),
  url: Joi.string().uri({
    scheme: [
      /https?/
    ]
  }).required()
}).with('name', 'url');

function find(name) {
  return urls.findOne({
    name
  });
}

async function create(almostOgou) {
  const result = Joi.validate(almostOgou, schema);
  // result.error === null
  if (result.error === null) {
    const url = await urls.findOne({
      name: almostOgou.name
    });
    if (!url) {
      return urls.insert(almostOgou);
    } else {
      return Promise.reject({
        isJoi: true,
        details: [{
          message: 'Short name is in use.'
        }]
      });
    }
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  create,
  find
};