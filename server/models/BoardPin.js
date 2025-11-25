module.exports = (sequelize, DataTypes) => {
  const BoardPin = sequelize.define("BoardPin", {
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pinId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return BoardPin;
};
