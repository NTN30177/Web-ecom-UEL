const x = async (req, res, next) => {
    try {
      console.log(1)
    } catch (err) {
      console.log(2)

    }
  };

  module.exports = {
    x
}

