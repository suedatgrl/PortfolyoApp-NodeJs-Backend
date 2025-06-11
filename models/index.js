const { Sequelize } = require('sequelize');
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@1234',
  database: process.env.DB_NAME || 'portfolio_app',
  dialect: 'mysql'
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.user,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

// Initialize db object
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./userModel')(sequelize, Sequelize);
db.Message = require('./messageModel')(sequelize, Sequelize);
db.Post = require('./postModel')(sequelize, Sequelize);
db.SavedPost = require('./savedPostModel')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Post, { foreignKey: 'createdBy', as: 'posts' });
db.Post.belongsTo(db.User, { foreignKey: 'createdBy', as: 'author' });

// İlişki adlarını düzgün ayarlayın
db.User.belongsToMany(db.Post, { 
  through: db.SavedPost, 
  foreignKey: 'userId', 
  otherKey: 'postId',
  as: 'savedPosts' 
});

db.Post.belongsToMany(db.User, { 
  through: db.SavedPost,
  foreignKey: 'postId',
  otherKey: 'userId',
  as: 'savedByUsers' 
});

// Message ilişkisi
db.Message.belongsTo(db.User, { foreignKey: 'userId', as: 'sender' });
module.exports = db;