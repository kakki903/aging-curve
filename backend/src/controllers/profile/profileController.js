const profileService = require("../../services/profile/profileService");

const profileController = {
  initProfile: async (req, res) => {
    const user_id = req.userId;
    const {
      name_ko,
      name_ch,
      birth_day,
      birth_time,
      working_company,
      working_years,
      working_regno,
      current_salary,
    } = req.body;

    profileService.initProfile(
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
  },
  infoProfile: async (req, res) => {
    const user_id = req.userId;
    console.log(user_id);
    const profile = await profileService.infoProfile(user_id);
    console.log(profile);
    res.status(200).json({
      message: "성공",
      profile: {
        name_ko: profile.name_ko,
        name_ch: profile.name_ch,
        birth_day: profile.birth_day,
        birth_time: profile.birth_time,
        working_company: profile.working_company,
        working_years: profile.working_years,
        working_regno: profile.working_regno,
        current_salary: profile.current_salary,
      },
    });
  },
};

module.exports = profileController;
