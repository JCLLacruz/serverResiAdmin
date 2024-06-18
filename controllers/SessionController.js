const Activity = require('../models/Activity');
const Resident = require('../models/Resident');
const Session = require('../models/Session');

const SessionController = {
	async createSession(req, res) {
		try {
			const session = await Session.create(req.body);
			const activity = await Activity.findByIdAndUpdate({ _id: req.body.activityId }, { $push: { sessions: session._id } });
			req.body.residents.forEach(async (resident) => {
				await Resident.findOneAndUpdate(
					{ _id: resident },
					{ $push: { sessions: { sessionId: session._id, activityId: activity._id, sessionDate: session.createdAt } } }
				);
			});
			res.status(201).send({ msg: 'Session added to database', session });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
    async deleteSession (req,res) {
        try {
            const session = await Session.findByIdAndDelete({_id: req.params._id});
            res.send({ msg: 'Session deleted from database', session });
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'Server error', error });
        }
    },
    async allSessions (req,res) {
        try {
            const sessions = await Session.find().populate('residentIds').populate('activityId');
            res.send({msg: 'All sessions', sessions})
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'Server error', error });
        }
    },
    async findSessionById(req,res) {
        try {
            const session = await Session.findById({_id: req.params._id}).populate('residentIds').populate('activityId')
            res.send({msg:'Session by id was found', session})
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: 'Server error', error });
        }
    },
};

module.exports = SessionController;
