const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
