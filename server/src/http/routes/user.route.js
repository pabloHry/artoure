const { Router } = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const Joi = require("joi");
const validateRequestBody = require("../middlewares/validateRequestBody");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const config = require("../../../config");
const { uploadFile } = require("../../utils/createFile");

module.exports = ({ users, file }) => {
  const router = Router();

  const mapUserToApiOutput = (user) => {
    return {
      id: user._id,
      email: user.email,
      username: user.username,
      pseudo: user.pseudo,
      created_at: user.created_at,
    };
  };

  const mapFileToApiOutput = (file) => {
    return {
      id: file._id,
      path: file.path,
      name: file.name,
      created_at: file.created_at,
    };
  };
  router.get(
    "/",
    tryCatch(async (req, res) => {
      const allUsers = await users.getAll();
      const usersMappeed = allUsers.map(mapUserToApiOutput);

      return res.json({ user: usersMappeed });
    })
  );

  router.post(
    "/:id/file",
    uploadFile,
    tryCatch(async (req, res, next) => {
      const { id } = req.params;
      const { filename } = req.file;
      const { name } = req.body;
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.auth.user.jwtSecret);
      if (decoded) {
        const path = `upload/${id}/${name + "." + filename.split(".")[1]}`;
        fs.rename(`upload/${id}/${filename}`, path, () => {});

        const createdFile = await file.createFile({ path, name });
        return res
          .status(201)
          .json({ message: "OK", data: mapFileToApiOutput(createdFile) });
      }
    })
  );

  router.get(
    "/:id/file",
    tryCatch(async (req, res) => {
      const { id } = req.params;
      const directoryPath = `upload/${id}`;
      const filesArray = [];

      fs.readdir(directoryPath, async function (err, files) {
        if (err) return res.send(err);

        for (let i = 0; i < files.length; i++) {
          const filename = files[i];
          const fileData = await file.getFileByName(filename);
          filesArray.push(mapFileToApiOutput(fileData));
        }
        return res.send({
          message: "OK",
          data: filesArray,
        });
      });
    })
  );

  router.post(
    "/",
    validateRequestBody(
      Joi.object({
        username: Joi.string().required(),
        pseudo: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
    ),
    tryCatch(async (req, res) => {
      const { username, pseudo, email, password } = req.body;
      const getUser = await users.getUser(email);

      if (getUser)
        return res.status(490).json({
          status: "Conflict",
          message: "User already exists",
        });

      const createdUser = await users.createUser({
        username,
        pseudo,
        email,
        password,
      });

      return res
        .status(201)
        .json({ message: "OK", data: mapUserToApiOutput(createdUser) });
    })
  );

  router.delete(
    "/:id",
    tryCatch(async (req, res) => {
      const { id } = req.params;
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.auth.user.jwtSecret);
      if (decoded) {
        await users.removeUser({ id });
        return res.status(204).send();
      }
    })
  );

  router.put(
    "/:id",
    tryCatch(async (req, res) => {
      const { id } = req.params;
      const { email, username, password, pseudo } = req.body;
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, config.auth.user.jwtSecret);
      if (decoded.email) {
        const user = await users.updateUser({
          id,
          email,
          username,
          password,
          pseudo,
        });
        return res.json({
          message: "OK",
          data: mapUserToApiOutput(user),
        });
      }
    })
  );

  return router;
};
