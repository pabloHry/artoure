const { FileModel } = require("../model");

module.exports = async () => {
  return {
    createFile: async ({ path, name }) => {
      const file = new FileModel({
        path,
        name,
        created_at: new Date(),
      });

      await file.save();
      return file.toObject();
    },
    getById: async ({ id }) => await FileModel.findOne({ _id: id }),
    getFileByName: async (name) =>
      await FileModel.findOne({ name: name.split(".")[0] }),
    removeFile: async ({ id }) => {
      const file = await FileModel.findOne({ id });

      if (!file) return null;

      return await file.deleteOne({ id });
    },
    updateFile: async ({ id, name }) => {
      const file = await FileModel.findOne({ _id: id });
      if (!file) throw new Error(`Unable to find file with id ${id}`);
      const updated = await FileModel.findOneAndUpdate(
        file._id,
        {
          path: `upload/63d976fcd8a4ecc62406d70b/${name}.csv`,
          name,
        },
        { new: true }
      );

      return updated;
    },
  };
};
