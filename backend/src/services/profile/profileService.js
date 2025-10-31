const profileRepository = require("../../repositories/profile/profileRepository");

const profileService = {
  initProfile: async (
    user_id,
    name_ko,
    name_ch,
    birth_day,
    birth_time,
    working_company,
    working_years,
    working_regno,
    current_salary
  ) => {
    const user = await profileRepository.findByEmailWithAuth(email);
  },
};

module.exports = profileService;
