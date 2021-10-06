const Schemes = require('./scheme-model');

const checkSchemeId = async (req, res, next) => {
  try {
    const validSchemeId = await Schemes.findById(req.params.scheme_id);

    if (!validSchemeId){
      next({ 
        status: 404, message: `scheme with scheme_id ${req.params.scheme_id} not found`
      });
    } else {
      next();
    }
  }
  catch(err){
    next(err);
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  try{
    const name = req.body.scheme_name;

    if(typeof name !== 'string' || !name || name === null){
      next({
        status: 400, message: "invalid scheme_name"
      })
    } else {
      next();
    }
  }
  catch(err){
    next(err);
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
