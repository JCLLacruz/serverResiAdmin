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
    }
}

module.exports = ResidentController;