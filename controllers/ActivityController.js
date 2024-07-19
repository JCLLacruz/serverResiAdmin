const Activity = require('../models/Activity');
const User = require('../models/User');
const Session = require('../models/Session');
const Resident = require('../models/Resident');

const ActivityController = {
	async createActivity(req, res) {
		try {
			const activity = await Activity.create(req.body);
			res.status(201).send({ msg: 'Activity added to database', activity });
		} catch (error) {
			console.error(error);
		}
	},
	async updateActivity(req, res) {
		try {
			console.log(req.params._id);
			const activity = await Activity.findOneAndUpdate({ _id: req.params._id }, { ...req.body, UserId: req.user._id }, { new: true });
			res.send({ msg: 'Activity updated in database', activity });
		} catch (error) {
			console.error(error);
		}
	},
	async allActivities(req, res) {
		try {
			const activities = await Activity.find()
				.populate('sessions')
				.populate({
					path: 'sessions',
					populate: {
						path: 'residentIds',
						model: 'Resident',
					},
				});
			res.send({ msg: 'All activities', activities });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async deleteActivity(req, res) {
		try {
			const activity = await Activity.findByIdAndDelete({ _id: req.params._id }).populate('sessions');
			activity.sessions.forEach(async (session) => {
				const sessionToDelete = await Session.findByIdAndDelete({ _id: session._id }).populate('residentIds');
				session.residentIds.forEach(async (resident) => {
					await Resident.findByIdAndUpdate({ _id: resident._id }, { $pull: { sessions: {sessionId: sessionToDelete._id }} });
				});
			});
			res.send({ msg: 'Activity deleted from database', activity });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async getActivityById(req, res) {
		try {
			const activity = await Activity.findById({ _id: req.params._id })
				.populate('sessions')
				.populate({
					path: 'sessions',
					populate: {
						path: 'residentIds',
						model: 'Resident',
					},
				});
			res.send({ msg: 'Activity by id was found', activity });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
};

module.exports = ActivityController;
