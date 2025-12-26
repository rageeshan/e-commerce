import User from "../Models/userModel.js";

export async function getAllUsers(req, res) {
  try {
    const user = await User.find().sort({ createdAt: -1 }); //shows the newest note on first
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAllUser" + error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

export async function getById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found! " });
    res.json(user);
  } catch (error) {
    console.error("Error in getById" + error);
    res
      .status(500)
      .json({ message: "Somethings wrong! check the code please!" });
  }
}

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      nic,
      mobile,
      address,
      gender,
      dob,
      email,
      password,
    } = req.body;

    const user = new User({
      firstName,
      lastName,
      nic,
      mobile,
      address,
      gender,
      dob,
      email,
      password,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error in createUser:", error.message); // log real error
    res
      .status(500)
      .json({ message: "User could not be added!", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body; // Only update fields provided in request

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true } // ✅ return updated doc & validate
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser:", error.message);
    res
      .status(500)
      .json({ message: "User didn't update!", error: error.message });
  }
};

export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
