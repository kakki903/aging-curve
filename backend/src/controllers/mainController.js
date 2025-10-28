const mainService = require("../services/mainService");

const mainController = {
  getHello: (req, res) => {
    try {
      // Service 계층 호출
      const message = mainService.getHelloMessage();

      // 성공 응답 (HTTP 200)
      res.status(200).send(message);
    } catch (error) {
      // 에러 응답
      console.error("Error in mainController.getHello:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = mainController;
