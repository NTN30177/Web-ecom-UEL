const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

  
const FeedbackSchema = new mongoose.Schema({
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content:{
      type:string
    }
  });
  


const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = {
    Feedback,
}  