const StudyNote = require("../../models/StudyNote");
const razorpay = require("../../helpers/razorpay");
const crypto = require('crypto');

// Get all published independent notes (for students to browse)
const getAllIndependentNotes = async (req, res) => {
    try {
        const { category, level, sortBy = 'price-lowtohigh' } = req.query;

        let filters = {
            isIndependent: true,
            isPublished: true
        };

        if (category) {
            filters.category = category;
        }
        if (level) {
            filters.level = level;
        }

        let sortParam = {};
        switch (sortBy) {
            case 'price-lowtohigh':
                sortParam.pricing = 1;
                break;
            case 'price-hightolow':
                sortParam.pricing = -1;
                break;
            case 'title-atoz':
                sortParam.title = 1;
                break;
            case 'title-ztoa':
                sortParam.title = -1;
                break;
            case 'newest':
                sortParam.createdAt = -1;
                break;
            default:
                sortParam.createdAt = -1;
        }

        const notes = await StudyNote.find(filters)
            .sort(sortParam)
            .select('-purchasedBy'); // Don't send purchasedBy list to all users

        res.status(200).json({
            success: true,
            data: notes
        });

    } catch (error) {
        console.error('Error in getAllIndependentNotes:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching notes",
            error: error.message
        });
    }
};

// Get note details by ID
const getNoteDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await StudyNote.findById(id)
            .select('-purchasedBy');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });

    } catch (error) {
        console.error('Error in getNoteDetails:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching note details",
            error: error.message
        });
    }
};

// Check if student has purchased a note
const checkNotePurchase = async (req, res) => {
    try {
        const { noteId, studentId } = req.params;

        const note = await StudyNote.findById(noteId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        // Free notes are always accessible
        if (!note.isIndependent || note.pricing === 0) {
            return res.status(200).json({
                success: true,
                data: true
            });
        }

        const hasPurchased = note.purchasedBy.some(
            purchase => purchase.studentId.toString() === studentId
        );

        res.status(200).json({
            success: true,
            data: hasPurchased
        });

    } catch (error) {
        console.error('Error in checkNotePurchase:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while checking purchase",
            error: error.message
        });
    }
};

// Get purchased notes for a student
const getPurchasedNotes = async (req, res) => {
    try {
        const { studentId } = req.params;

        const notes = await StudyNote.find({
            'purchasedBy.studentId': studentId,
            isIndependent: true
        }).select('-purchasedBy');

        res.status(200).json({
            success: true,
            data: notes
        });

    } catch (error) {
        console.error('Error in getPurchasedNotes:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching purchased notes",
            error: error.message
        });
    }
};

// Create order for note purchase
const createNoteOrder = async (req, res) => {
    try {
        const { noteId } = req.body;
        const userId = req.user.id;

        const note = await StudyNote.findById(noteId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        if (!note.isIndependent) {
            return res.status(400).json({
                success: false,
                message: 'This note is part of a course and cannot be purchased independently'
            });
        }

        // Check if already purchased
        const alreadyPurchased = note.purchasedBy.some(
            p => p.studentId.toString() === userId
        );
        if (alreadyPurchased) {
            return res.status(400).json({
                success: false,
                message: 'You have already purchased this note'
            });
        }

        // If free, add to purchased directly
        if (note.pricing === 0) {
            note.purchasedBy.push({
                studentId: userId,
                studentName: req.user.userName,
                studentEmail: req.user.userEmail,
                paidAmount: 0,
                purchaseDate: new Date()
            });
            await note.save();

            return res.status(200).json({
                success: true,
                message: 'Note added successfully (free)',
                data: { isFree: true }
            });
        }

        // Create Razorpay Order for paid notes
        const options = {
            amount: Math.round(note.pricing * 100), // Razorpay expects amount in paise
            currency: "INR",
            receipt: `note_order_${Date.now()}`
        };

        try {
            const razorpayOrder = await razorpay.orders.create(options);

            res.status(200).json({
                success: true,
                data: {
                    noteId: note._id,
                    razorpayOrderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: process.env.RAZORPAY_KEY_ID,
                    noteTitle: note.title
                }
            });
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating order',
                error: error.message
            });
        }

    } catch (error) {
        console.error('Error in createNoteOrder:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while creating order",
            error: error.message
        });
    }
};

// Verify note payment
const verifyNotePayment = async (req, res) => {
    try {
        const { noteId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const userId = req.user.id;

        // Verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find and update note
        const note = await StudyNote.findById(noteId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // Add to purchased list
        note.purchasedBy.push({
            studentId: userId,
            studentName: req.user.userName,
            studentEmail: req.user.userEmail,
            paidAmount: note.pricing,
            purchaseDate: new Date()
        });
        await note.save();

        res.status(200).json({
            success: true,
            message: 'Payment verified and note access granted',
            data: { noteId: note._id }
        });

    } catch (error) {
        console.error('Error in verifyNotePayment:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while verifying payment",
            error: error.message
        });
    }
};

module.exports = {
    getAllIndependentNotes,
    getNoteDetails,
    checkNotePurchase,
    getPurchasedNotes,
    createNoteOrder,
    verifyNotePayment
};
