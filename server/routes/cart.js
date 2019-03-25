
module.exports = {
  cartView: function(req, res, next) {
    const userId = req.params.id;
  },
  cartDelete: function(req, res, next) {
    const removeId = req.params.id;
  },
  cartUpdate: function(req, res, next) {
    const updateId = req.params.id;
    const requestBody = req.body;
    cart.updateOne({ _id: updateId }, requestBody, function(err, data) {
      if (err) return res.send(err);
      res.send(`Updated!! ${data}`)
    });
  },
  cartPost: function(req, res, next) {
    var requestBody = req.body;
    var cart = new cart(requestBody);
    cart.save(function (err) {
      if (err) return res.send(err);
      res.send(requestBody);
    });
  }
};

