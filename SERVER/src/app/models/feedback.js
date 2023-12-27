const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    idOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String
    },
    images: [
      {
          type: String,
      },
  ],
}, {
    timestamps: true,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = {Feedback};
