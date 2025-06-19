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
        model: 'users', // KÜÇÜK HARF
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts', // KÜÇÜK HARF
        key: 'id'
      }
    }
  }, {
    tableName: 'savedposts', // KÜÇÜK HARF
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId']
      }
    ]
  });

  return SavedPost;
};