module.exports = (sequelize, DataTypes) => {
  const SharedBoard = sequelize.define("SharedBoard", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.STRING, // User ID (integer as string in this app usually?) Let's check Users.js. It uses default ID.
      allowNull: false,
    },
    collaborators: {
      type: DataTypes.TEXT, // Storing as JSON string for simplicity as per plan
      allowNull: true,
      defaultValue: "[]",
      get() {
        const rawValue = this.getDataValue('collaborators');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('collaborators', JSON.stringify(value));
      }
    }
  });

  return SharedBoard;
};
