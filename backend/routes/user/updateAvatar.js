const cloudinary = require('../../config/cloudinary');
const upload = require('../../config/multer');
const User = require('../../models/user');
const path = require('path');

// UPDATE USER PROFILE AVATAR
const uploadAvatar = (app) =>
  app.put('/api/update-avatar/:id', upload.single('image'), async (req, res) => {
    //array of accepted files
    const authorizedMimeTypes = ['.jpg', '.jpeg', '.png'];
    // get the extension of the uploaded file
    const fileExtension = path.extname(req.file.originalname);

    try {
      // if file is a image
      if (authorizedMimeTypes.includes(fileExtension)) {
        let user = await User.findById(req.params.id);
        // delete avatar image from database if there is already one
        await cloudinary.uploader.destroy(user.avatar.cloudinaryId);
        // upload the new image
        const result = await cloudinary.uploader.upload(req.file.path);
        // set the new data of  the avatar
        const data = {
          avatar: {
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
          },
        };
        // update the avatar with the new data
        user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        res.status(201).json({
          sucess: true,
          message: `image updated successfully`,
          data: user.avatar,
        });
      }
      // if file is note an image ---> message error
      else
        res.status(400).json({
          sucess: false,
          message: `Please upload an image file`,
        });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        sucess: false,
        message: `Invalid type of  file`,
      });
    }
  });

module.exports = uploadAvatar;
