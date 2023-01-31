const { Router } = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const config = require("../../../config");

module.exports = ({ file }) => {
  const router = Router();

  const mapFileToApiOutput = (file) => {
    return {
      id: file._id,
      path: file.path,
      name: file.name,
      created_at: file.created_at,
    };
  };

  router.put(
    "/:id",
    tryCatch(async (req, res) => {
      const { id } = req.params;
      const { name } = req.body;
      const fileData = await file.getById({ id });

      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.auth.user.jwtSecret);
      if (decoded) {
        await fs.renameSync(
          fileData.path,
          `upload/${decoded.id}/${name}.${fileData.path.split(".")[1]}`,
          () => {}
        );
        await file.updateFile({ id, name });
        const resData = await file.getById({ id });

        return res
          .status(200)
          .send({ message: "OK", data: mapFileToApiOutput(resData) });
      }
    })
  );

  router.delete(
    "/:id",
    tryCatch(async (req, res) => {
      /* Destructuring the email property from the req.params object. */
      const { id } = req.params;

      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.auth.user.jwtSecret);
      if (decoded) {
        const fileData = await file.getById({ id });
        await file.removeFile({ id });

        fs.unlinkSync(fileData.path);

        return res.status(204).send();
      }
    })
  );

  return router;
};
