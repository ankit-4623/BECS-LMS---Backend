const express = require("express");
const router = express.Router();
const {
    getAllIndependentNotes,
    getNoteDetails,
    checkNotePurchase,
    getPurchasedNotes,
    createNoteOrder,
    verifyNotePayment
} = require("../../controllers/student-controller/note-controller");
const { auth } = require("../../middleware/auth-middleware");

// Public routes (no auth required)
router.get("/get", getAllIndependentNotes);
router.get("/details/:id", getNoteDetails);

// Protected routes (require authentication)
router.get("/check-purchase/:noteId/:studentId", auth, checkNotePurchase);
router.get("/purchased/:studentId", auth, getPurchasedNotes);
router.post("/order/create", auth, createNoteOrder);
router.post("/order/verify", auth, verifyNotePayment);

module.exports = router;
