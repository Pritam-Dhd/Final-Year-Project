import Issue from "../Schema/IssueSchema.js";
import nodemailer from "nodemailer";

export const reminderEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.User,
        pass: process.env.Pass,
      },
    });

    const nowDate = new Date();
    nowDate.setDate(nowDate.getDate() + 1);
    nowDate.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(nowDate);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    const issues = await Issue.find({
      dueDate: {
        $gt: nowDate,
        $lt: dayAfterTomorrow,
      },
      status: "Not Returned",
    })
      .populate("user")
      .populate("book");

    // Send emails for each issue
    issues.forEach(async (issue) => {
      // Convert the due date to local time zone
      const localDueDate = new Date(
        issue.dueDate.getTime() + issue.dueDate.getTimezoneOffset() * 60000
      );
      const mailOptions = {
        from: process.env.User,
        to: issue.user.email,
        subject: "Reminder: Book Due Tomorrow",
        text: `Dear ${issue.user.name},\n\nThis is a reminder that the ${issue.book.name} book you borrowed is due tomorrow (${localDueDate}). Please return it on time.\n\nRegards,\nYour Library`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${issue.user.email}`);
    });
  } catch (err) {
    console.log(err);
  }
};
