const mongoose=require('mongoose')

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI + 'uber')
        .then(() => console.log('MongoDB connected successfully'))
        .catch((error) => {
            console.error('MongoDB connection failed:', error.message);
            process.exit(1);
        });
}

module.exports=connectDB