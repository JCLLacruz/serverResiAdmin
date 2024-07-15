const Image = require('../models/Image');
const Resident = require('../models/Resident');
const User = require('../models/User');
const sharp = require('sharp');

const ImageController = {
	async uploadUserProfileImage(req, res) {
		try {
			const webpImage = await sharp(req.file.buffer).toFormat('webp').toBuffer();

			const image = await Image.create({
				data: webpImage,
				contentType: 'image/webp',
				userId: req.body.userId,
			});

			const user = await User.findById(req.body.userId);
			if (user) {
				user.images.push(image._id);
				await user.save();
			}

			res.status(200).send({ msg: 'Image uploaded and converted successfully', image });
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred while processing the image');
		}
	},
	async uploadResidentImage(req, res) {
		try {
			const webpImage = await sharp(req.file.buffer).toFormat('webp').toBuffer();

			const image = await Image.create({
				data: webpImage,
				contentType: 'image/webp',
				residentId: req.body.residentId,
			});

			const resident = await Resident.findById(req.body.residentId);
			if (resident) {
				resident.images.push(image._id);
				await resident.save();
			}

			res.status(200).send({ msg: 'Image uploaded and converted successfully', image });
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred while processing the image');
		}
	},
	async getImage(req, res) {
		try {
			const image = await Image.findById(req.params.id);

			if (!image) {
				return res.status(404).send('Image not found');
			}

			res.set('Content-Type', image.contentType);
			res.send(image.data);
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred while retrieving the image');
		}
	},
    async deleteImage(req, res) {
        try {
            const image = await Image.findByIdAndDelete({_id: req.params._id});
            if(req.headers.Userid) {
                const user = await User.findById(req.headers.Userid);
                user.images = user.images.filter(img => img.toString() !== req.params._id);
                await user.save();
            }
            if(req.headers.Residentid) {
                const resident = await Resident.findById(req.headers.Residentid);
                resident.images = resident.images.filter(img => img.toString() !== req.params._id);
                await resident.save();
            }
            res.send({msg:'Image deleted from database', image});
        } catch (error) {
            console.error(error);
            res.status(500).send({msg:'Server error', error});
        }
    }
};

module.exports = ImageController;
