const Activity = require('../models/Activity');
const Resident = require('../models/Resident');
const Session = require('../models/Session');

const SessionController = {
	async createSession(req, res) {
		try {
			let { activityId, observations, residentIds } = req.body;
			const session = await Session.create({ activityId, observations, residentIds });
			await Activity.findByIdAndUpdate({ _id: activityId }, { $push: { sessions: session._id } });
			residentIds.forEach(async (residentId) => {
				await Resident.findOneAndUpdate(
					{ _id: residentId },
					{ $push: { sessions: { sessionId: session._id, activityId, sessionDate: session.createdAt } } }
				);
			});
			res.status(201).send({ msg: 'Session added to database', session });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async deleteSession(req, res) {
		try {
			const session = await Session.findByIdAndDelete({ _id: req.params._id });
            await Activity.findOneAndUpdate({_id: session.activityId},{$pull: {sessions: session._id}});
            session.residentIds.forEach(async (residentId) => {
                await Resident.findOneAndUpdate(
					{ _id: residentId },
					{ $pull: { sessions: { sessionId: session._id, activityId: session.activityId, sessionDate: session.createdAt } } }
				);
            })
			res.send({ msg: 'Session deleted from database', session });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async allSessions(req, res) {
		try {
			const sessions = await Session.find().populate('residentIds').populate('activityId');
			res.send({ msg: 'All sessions', sessions });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async findSessionById(req, res) {
		try {
			const session = await Session.findById({ _id: req.params._id }).populate('residentIds').populate('activityId');
			res.send({ msg: 'Session by id was found', session });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async findSessionsByResidentId(req, res) {
		try {
			const sessions = await Session.find({ residentIds: req.params._id }).populate('residentIds').populate('activityId');
			res.send({ msg: 'Sessions by resident id were found', sessions });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async findSessionsByActivityId(req, res) {
		try {
			const sessions = await Session.find({ activityId: req.params._id }).populate('residentIds').populate('activityId');
			res.send({ msg: 'Sessions by activity id were found', sessions });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	}
};

module.exports = SessionController;
