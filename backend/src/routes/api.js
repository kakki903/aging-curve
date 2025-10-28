const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");
const sampleController = require("../controllers/sampleController");

// GET /api/v1/ 요청이 들어오면 mainController.getHello 함수를 실행합니다.
router.get("/", mainController.getHello);

// [데이터 생성] POST /api/v1/samples
router.post("/samples", sampleController.createSample);
// [데이터 조회] GET /api/v1/samples
router.get("/samples", sampleController.getSamples);

module.exports = router;
