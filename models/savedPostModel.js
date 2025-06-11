module.exports = (sequelize, DataTypes) => {
  const SavedPost = sequelize.define('SavedPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId']
      }
    ]
  });
  
  return SavedPost;
};