const baseUrl = "http://localhost:3001/";
const { v4: uuidv4 } = require("uuid");

class PostController {
  normalUploadImg = async (req, res) => {
    const userId = req.session.userId;
    try {
      const dir = __basedir + `/public/${userId}`;
      //Check folder is existed and create
      !fs.existsSync(dir) && fs.mkdirSync(dir);
      //set up diskStorage
      let fileName = [];
      let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unitKey = uuidv4();
          const fileType = file.mimetype;
          const fileTail = fileType.split("/")[fileType.split("/").length - 1];
          fileName.push(unitKey + "." + fileTail);
          cb(null, unitKey + "." + fileTail);
        },
      });
      // upload file
      let uploadFile = multer({
        storage: storage,
      }).array("listFile");
      let uploadFileMiddleware = util.promisify(uploadFile);
      await uploadFileMiddleware(req, res);
      // res file url
      let fileUrl = [];
      fileName.map((item) => {
        fileUrl.push(baseUrl + `/${userId}/` + item);
      });
      return res.json(fileUrl);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = new PostController();
