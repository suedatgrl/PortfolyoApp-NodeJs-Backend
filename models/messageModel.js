// Find this code:
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  // Change this association:
  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'userId', // This conflicts with the column name
      as: 'sender' // This is causing the naming collision
    });
  };

  // To this:
  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'sender' // Changed from 'userId' to 'sender'
    });
  };

  return Message;
};