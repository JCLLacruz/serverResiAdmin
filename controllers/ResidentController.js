const Resident = require("../models/Resident");

const ResidentController = {
    async createResident (req, res) {
        try {
            if (!req.file) {
				req.body.image_path = 'nonResidentImage';
			} else {
				req.body.image_path = req.file.filename;
			}
            const resident = await Resident.create(req.body);
            res.status(201).send({msg:'Resident added to database', resident});
        } catch (error) {
            console.error(error);
            res.status(500).send({msg:'Server error', error});
        }
    },
    async updateResident (req, res) {
        try {
            if (!req.file) {
				req.body.image_path = 'nonResidentImage';
			} else {
				req.body.image_path = req.file.filename;
			}
            const resident = await Resident.findOneAndUpdate({_id: req.params._id}, req.body, { new: true });
            res.status(201).send({msg:'Resident updated in database', resident});
        } catch (error) {
            console.error(error);
            res.status(500).send({msg:'Server error', error});
        }
    },
    async deleteResident (req, res) {
        try {
            const resident = await Resident.findByIdAndDelete({_id: req.params._id});
            res.status(201).send({msg:'Resident deleted from database', resident});
        } catch (error) {
            console.error(error);
            res.status(500).send({msg:'Server error', error});
        }
    },
    async allResidents (req, res) {
        try {
            const residents = await Resident.find();
            res.status(201).send({msg:'All residents', residents});
        } catch (error) {
            console.error(error);
            res.status(500).send({msg:'Server error', error});
        }
    },
    async findResidentById(req, res) {
		try {
			const resident = await Resident.findOne({ _id: req.params._id });
			res.send({ msg: 'Resident by id was found.', resident });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `The resident with this id does not exist in the database.`, error });
		}
	},
	async findResidentByName(req, res) {
		try {
            if (req.params.firstname.length > 20){
				return res.status(400).send('Search to long.')
			}
			const firstname = new RegExp(req.params.firstname, 'i');
			const resident = await Resident.find({firstname})
			res.send({ msg: 'Resident by firstname was found.', resident });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `The resident with this firstname does not exist in the database.`, error });
		}
	},
}

module.exports = ResidentController;