module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'posts' // TABLO İSMİ KÜÇÜK HARFLİ
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'author'
    });

    Post.belongsToMany(models.User, {
      through: models.SavedPost, // Burası da model referansı olmalı
      as: 'savedByUsers',
      foreignKey: 'postId',
      otherKey: 'userId'
    });
  };

  return Post;
};