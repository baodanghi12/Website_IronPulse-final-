import userModel from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ Lấy từ middleware authUser

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {  // ✅ Ghi đúng là userData, không phải useData
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getUserData };
