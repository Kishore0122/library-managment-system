import cron from "node-cron";
import { Borrow } from "../models/borrowmodels.js";    
import { sendEmail } from "../utils/sendemail.js";
export const notifyuser = () => {
    cron.schedule("*/30 * * * *", async () => {

        try {

            const onedayago = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowers = await Borrow.find({
                duedate: {
                    $lt: onedayago,
                },
                returndate: null,
                notified: false,
            }).populate('user'); // Populate the user field to access email and name
            for (const element of borrowers) {
                if (element.user && element.user.email) {
                    await sendEmail({
                        to: element.user.email,
                        subject: "Book return reminder",
                        message: `Hello ${element.user.name} \n\n Time to return books`
                    });

                    element.notified = true;
                    await element.save();
                    console.log("Email sent to:", element.user.email);
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
} 