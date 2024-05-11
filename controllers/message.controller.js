// import Conversation from "../models/conversation.model.js";
// import Message from "../models/message.model.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";

// export const sendMessage = async (req, res) => {
// 	try {
// 		const { message } = req.body;
// 		const { id: receiverId } = req.params;
// 		const senderId = req.user._id;

// 		let conversation = await Conversation.findOne({
// 			participants: { $all: [senderId, receiverId] },
// 		});

// 		if (!conversation) {
// 			conversation = await Conversation.create({
// 				participants: [senderId, receiverId],
// 			});
// 		}

// 		const newMessage = new Message({
// 			senderId,
// 			receiverId,
// 			message,
// 		});

// 		if (newMessage) {
// 			conversation.messages.push(newMessage._id);
// 		}

// 		// await conversation.save();
// 		// await newMessage.save();

// 		// this will run in parallel
// 		await Promise.all([conversation.save(), newMessage.save()]);

// 		// SOCKET IO FUNCTIONALITY WILL GO HERE
// 		const receiverSocketId = getReceiverSocketId(receiverId);
// 		if (receiverSocketId) {
// 			// io.to(<socket_id>).emit() used to send events to specific client
// 			io.to(receiverSocketId).emit("newMessage", newMessage);
// 		}

// 		res.status(201).json(newMessage);
// 	} catch (error) {
// 		console.log("Error in sendMessage controller: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// export const getMessages = async (req, res) => {
// 	try {
// 		const { id: userToChatId } = req.params;
// 		const senderId = req.user._id;

// 		const conversation = await Conversation.findOne({
// 			participants: { $all: [senderId, userToChatId] },
// 		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

// 		if (!conversation) return res.status(200).json([]);

// 		const messages = conversation.messages;

// 		res.status(200).json(messages);
// 	} catch (error) {
// 		console.log("Error in getMessages controller: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

import multer from "multer";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // File naming convention
    },
});

// Configure multer upload settings
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Validate file types (e.g., images, documents)
        if (file.mimetype.startsWith("image/") || 
        file.mimetype.startsWith("application/pdf") || 
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDF files are allowed"));
        }
    },
});

// Controller for handling sending messages
export const sendMessage = async (req, res) => {
    try {
        // Handle file upload if included in request
        upload.single("file")(req, res, async function (err) {
            if (err) {
                console.error("Error uploading file:", err);
                // Handle file upload error
                return res.status(500).json({ error: "File upload failed" });
            }

            // File upload successful
            const file = req.file;
            let filename = null;
            if (file) {
                filename = file.filename;
            }

            // Retrieve message and receiver ID from request
            const { message } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;

            // Find or create conversation
            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] },
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId],
                });
            }

            // Create new message
            const newMessage = new Message({
                senderId,
                receiverId,
                message,
                file: filename, // Save file name if file exists
            });

            // Add message to conversation
            conversation.messages.push(newMessage._id);

            // Save conversation and message
            await Promise.all([conversation.save(), newMessage.save()]);

            // Send message to receiver via socket
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            res.status(201).json(newMessage);
        });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



// Controller for getting messages
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        // Find conversation and populate messages
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages"); // Populate actual messages

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
