const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../helpers/cloudinary");
const Course = require("../../models/Course");

const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Upload to cloudinary
        const result = await uploadMediaToCloudinary(req.file.path);

        res.status(200).json({
            success: true,
            message: "Media uploaded successfully",
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                resource_type: result.resource_type
            }
        });

    } catch (error) {
        console.error('Error in uploadMedia:', error);
        res.status(500).json({
            success: false,
            message: "Error uploading media",
            error: error.message
        });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: "Public ID is required"
            });
        }

        // Delete from cloudinary
        await deleteMediaFromCloudinary(publicId);

        res.status(200).json({
            success: true,
            message: "Media deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteMedia:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting media",
            error: error.message
        });
    }
};

module.exports = {
    uploadMedia,
    deleteMedia
};