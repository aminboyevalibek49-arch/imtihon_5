// single upload
const upload_img = async (req, res) => {
  return res.status(201).json({
    filePath:
      `http://localhost:${process.env.PORT}/images/` + req.file.filename,
  });
};

// multiple-upload
const upload_multi = async (req, res) => {
  return res.status(201).json({
    filePath: req.files.map(
      (img) => `http://localhost:${process.env.PORT}/images/` + img.filename,
    ),
  });
};

module.exports = {
  upload_img,
  upload_multi,
};
