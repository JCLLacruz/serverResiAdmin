const ServerController = {
	async serverStatus(req, res) {
        try {
            res.status(200).send({msg: 'Server is running'});
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
};

module.exports = ServerController;
