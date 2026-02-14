const sequelize = require('../config/database');
const User = require('./User');
const Post = require('./Post');

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = {
    sequelize,
    User,
    Post
};
