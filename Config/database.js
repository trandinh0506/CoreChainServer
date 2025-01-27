const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect to database successfully");
    } catch (error) {
        console.log(error);
        console.log("connect error");
    }

}
