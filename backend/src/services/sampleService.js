const sampleRepository = require("../repositories/sampleRepository");

const sampleService = {
  // 데이터 생성 서비스
  createSample: async (username, userage) => {
    // 1. [비즈니스 로직]: 나이 유효성 검증
    if (userage < 0) {
      throw new Error("나이는 0 이상이어야 합니다.");
    }

    // 2. [비즈니스 로직]: 사용자 이름과 나이 쌍의 중복 확인
    // 새로운 findByUsernameAndAge 함수를 호출합니다.
    const existingUser = await sampleRepository.findByUsernameAndAge(
      username,
      userage
    );

    if (existingUser) {
      // username과 userage가 모두 일치하는 데이터가 있으면 에러 발생
      throw new Error("이미 등록된 계정입니다. (이름/나이 중복)");
    }

    // 3. 중복이 없으면 Repository를 통해 데이터 저장
    return sampleRepository.createSample(username, userage);
  },

  // 리스트 조회 서비스
  getSamples: async () => {
    return sampleRepository.findAllSamples();
  },
};

module.exports = sampleService;
