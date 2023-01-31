const { Router } = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const validateRequestBody = require("../middlewares/validateRequestBody");

module.exports = ({ users }) => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(
      Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
    ),

    tryCatch(async (req, res) => {
      const { email, password } = req.body;
      const getUser = await users.getUser(email);

      if (!getUser)
        return res.status(490).json({
          status: "Conflict",
          message: "User not found",
        });

      const token = await users.authenticate({
        email,
        password,
      });

      return res.status(201).json({ message: "OK", data: token });
    })
  );

  return router;
};
