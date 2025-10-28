const sampleService = require("../services/sampleService");

const sampleController = {
  // 1. 데이터 생성 (POST 요청 처리)
  createSample: async (req, res) => {
    const { username, userage } = req.body;
    try {
      const newSample = await sampleService.createSample(username, userage);
      res.status(201).json(newSample);
    } catch (error) {
      // Service에서 발생한 에러 처리
      res.status(400).json({ message: error.message });
    }
  },

  // 2. 리스트 조회 (GET 요청 처리)
  getSamples: async (req, res) => {
    try {
      const samples = await sampleService.getSamples();
      res.status(200).json(samples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch samples" });
    }
  },
};

module.exports = sampleController;
