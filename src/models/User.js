const { DataTypes } = require("sequelize");
const { sequelize } = require("../Db/sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_type",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "phone_no",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agreeTerms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "agree_terms",
    },
    about: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "token",
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "refresh_token",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
);

module.exports = User;
