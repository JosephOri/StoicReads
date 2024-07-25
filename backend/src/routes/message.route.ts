import express from "express";
const router = express.Router();

import {
    getConversation,
} from "@controllers/message.contoller";

router.post("/getConversation", getConversation);//auth?

export default router;
