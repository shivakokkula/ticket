// ticketRoutes.js
const express = require("express");
const { createTicket, getTickets, getTicket, assignTicket } = require("../controllers/ticketController");
const authMiddleware = require("../middlewares/authMiddleware");
const { get } = require("mongoose");
const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware,getTickets);
router.get("/:id", authMiddleware,getTicket);
router.post("/:id/assign", authMiddleware, assignTicket);
module.exports = router;
