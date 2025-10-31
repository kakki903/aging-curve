const profileService = require("../../services/profile/profileService");

const profileService = {
  initProfile: async (req, res) => {
    const {
      user_id,
      name_ko,
      name_ch,
      birth_day,
      birth_time,
      working_company,
      working_years,
      working_regno,
      current_salary,
    } = req.body;
  },
};

module.exports = profileService;
