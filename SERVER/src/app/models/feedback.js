// const mongoose = require("mongoose");

// const FeedbackSchema = new mongoose.Schema({
//     idUser: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     idOrder: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     content: {
//       type: String
//     },
//     images: [
//       {
//           type: String,
//       },
//   ],
// }, {
//     timestamps: true,
// });

// const Feedback = mongoose.model("Feedback", FeedbackSchema);

// module.exports = {Feedback};


const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
      idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    idOrder: { type: mongoose.Schema.Types.ObjectId,
          ref: "Order"},
  productId: { type: String},
  content: { type: String},
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = {Feedback};
