const openaiService = require("../../services/openai/openaiService");

const openaiController = {
  get: async (req, res) => {
    const data = await openaiService.get(req);
    res.status(200).json({
      message: "성공",
      data: data,
    });
  },
  init: async (req, res) => {
    const user_id = req.userId;
    const period = req.body.period;
    const data = await openaiService.initPrediction(user_id, period);
    res.status(200).json({
      message: "성공",
      data: data,
    });
  },
};

module.exports = openaiController;
