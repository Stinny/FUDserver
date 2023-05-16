const { uploadToS3 } = require('./aws');
const File = require('./models/File');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req?.user?.id });

    return res.json(files);
  } catch (err) {
    return res.status(500).json('There was an error');
  }
};

const uploadFile = async (req, res) => {
  const files = req.files;

  const uploadedFiles = [];

  try {
    for (var i = 0; i < files.length; i++) {
      const uploadedFile = await uploadToS3(files[i]);
      uploadedFiles.push({ key: uploadedFile.Key, url: uploadedFile.Location });
    }

    res.status(200).json({ files: uploadedFiles });
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error');
  }
};

const deleteFile = async (req, res) => {
  const { fileId } = req.body;

  try {
    await File.deleteOne({ _id: fileId });

    return res.json('File deleted');
  } catch (err) {
    return res.status(500).json('Server error');
  }
};

const createFile = async (req, res) => {
  const { file } = req.body;

  try {
    const newFile = new File({
      name: file.key,
      key: file.key,
      url: file.url,
      userId: req?.user?.id,
    });
    newFile.save();

    return res.json('File created');
  } catch (err) {
    return res.status(500).json('Server error');
  }
};

const login = async (req, res) => {
  try {
    //see if a user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('Invalid credentials try again');

    //validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json('Invalid credentials try again');

    const accessToken = user.genAccessToken();

    return res.json({ accessToken: accessToken, user: user.email });
  } catch (err) {
    return res.status(500).json('Server error');
  }
};

const register = async (req, res) => {
  try {
    //creates salt
    //then creates the hash from salt and password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    //checks if email is already in use
    const emailInUse = await User.find({ email: req.body.email });
    if (emailInUse.length)
      return res.status(400).json({
        error: 'Email already in use',
      });

    //create the new user mongo doc
    const newUser = new User({
      email: req.body.email,
      password: hash,
    });

    const accessToken = newUser.genAccessToken();

    //deconstructs the newUser doc so we don't return the password
    const { password, ...otherInfo } = newUser._doc;

    await newUser.save();

    return res.json({ accessToken: accessToken, user: newUser.email });
  } catch (err) {
    console.log(err);
    return res.status(500).json('Server error');
  }
};

module.exports = {
  getFiles,
  uploadFile,
  login,
  register,
  createFile,
  deleteFile,
};
