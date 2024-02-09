const Users = require('./schema/getUserSchema');
const logger = require('~/config/winston');

module.exports = {
  getAllUsers: async () => {
    try {
      const users = await Users.find({});
      return { userList: users };
    } catch (error) {
      logger.error('[getAllUsers] Error getting users info', error);
      return { message: 'Error getting users info' };
    }
  },
};
