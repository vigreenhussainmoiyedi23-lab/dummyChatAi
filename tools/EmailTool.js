import { tool } from "langchain";
import sendEmail from "../services/sendEmail.js";
import * as z from "zod";

export const EmailTool = tool(sendEmail,
    {
        name: "send_email",
        description: "use this to send email",
        schema: z.object({
            subject: z.string().describe("email subject"),
            html: z.string().describe("email body"),
            to: z.string().describe("email recipient")
        })
    }
)