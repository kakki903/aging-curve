const sampleRepository = require("../repositories/sampleRepository");

const sampleService = {
  // 데이터 생성 서비스
  createSample: async (username, userage) => {
    // [비즈니스 로직]: 예: 나이가 0 이상인지 검증
    if (userage < 0) {
      throw new Error("나이는 0 이상이어야 합니다.");
    }
    return sampleRepository.createSample(username, userage);
  },

  // 리스트 조회 서비스
  getSamples: async () => {
    return sampleRepository.findAllSamples();
  },
};

module.exports = sampleService;
