module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define("Follow", {
    followerId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    followingId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return Follow;
};

