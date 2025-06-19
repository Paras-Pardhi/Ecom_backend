const CartModel = require("../../models/addToCartModel");

const clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new Error("User ID missing");
    }

    await CartModel.deleteMany({ userId });

    res.status(200).json({
      message: "Cart cleared successfully after payment",
      success: true,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: error.message || "Failed to clear cart",
      success: false,
    });
  }
};

module.exports = clearCart;
