const mongoose = require("mongoose");

const connectToMongo = () => {
    console.log(process.env.DATABASE_URI)
    try {
        const conn =  mongoose.connect("mongodb+srv://user:user@cluster0.b0lagrk.mongodb.net/Bloggingwebsite");
        console.log(
          `Conneted To Mongodb Databse `
        );
      } catch (error) {
        console.log(`Errro in Mongodb ${error}`);
      }
};

module.exports = connectToMongo;

