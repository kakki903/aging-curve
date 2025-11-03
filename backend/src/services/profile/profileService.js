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
    const profileInfo = await profileRepository.initProfile(
      user_id,
      name_ko,
      name_ch,
      birth_day,
      birth_time,
      working_company,
      working_years,
      working_regno,
      current_salary
    );
    return profileInfo;
  },

  infoProfile: async (user_id) => {
    const result = await profileRepository.infoProfile(user_id);
    return result;
  },
};

module.exports = profileService;
