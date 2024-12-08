import Issue from "../Schema/IssueSchema.js";
import Fine from "../Schema/FineSchema.js";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";

const calculateFine = (dueDate) => {
  const today = new Date();
  // Set time component of 'today' to start of day
  today.setHours(0, 0, 0, 0);
  // Set time component of 'dueDate' to start of day
  const dueDateStartOfDay = new Date(dueDate);
  dueDateStartOfDay.setHours(0, 0, 0, 0);

  if (today > dueDateStartOfDay) {
    const daysOverdue = Math.ceil(
      (today - dueDateStartOfDay) / (1000 * 60 * 60 * 24)
    );
    return daysOverdue * 5;
  } else {
    return 0;
  }
};

export const addFines = async () => {
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
    
    const today = new Date();
    // Set time component of 'today' to start of day
    today.setHours(0, 0, 0, 0);
    const overdueIssues = await Issue.find({
      dueDate: { $lt: today },
      status: "Not Returned",
    })
    .populate("user")
    .populate("book");;
    for (const issue of overdueIssues) {
      const amount = calculateFine(issue.dueDate);

      // Check if a fine already exists for this issue
      const existingFine = await Fine.findOne({ issue: issue._id, reason:'Overdue'});

      if (existingFine) {
        // Update existing fine
        await Fine.updateOne({ _id: existingFine._id }, { amount });
        const mailOptions = {
          from: process.env.User,
          to: issue.user.email,
          subject: "Fine Updated Notification",
          text: `Dear ${issue.user.name},\n\nThis is a reminder that the ${issue.book.name} book you borrowed is overdue and your fine till now is Rs ${amount}. Please return it the book and pay the fine else it will still increase.\n\nRegards,\nYour Library`,
        };
        await transporter.sendMail(mailOptions);
      } else {
        // Insert new fine
        await Fine.create({
          issue: issue._id,
          amount,
          paid_date: '',
          reason:'Overdue'
        });
        const mailOptions = {
          from: process.env.User,
          to: issue.user.email,
          subject: "Fine Added Notification",
          text: `Dear ${issue.user.name},\n\nThis is a reminder that the ${issue.book.name} book you borrowed is overdue and your fine of Rs ${amount} is added. Please return it the book and pay the fine else Rs 100 will increase everyday.\n\nRegards,\nYour Library`,
        };
        await transporter.sendMail(mailOptions);
      }
    }
  } catch (error) {
    console.error("Error updating fines:", error);
  }
};

export const paidFine = async ({ data, userRole }) => {
  try {
    const fine = await Fine.findByIdAndUpdate(data._id, { status: "paid",paid_date:Date.now(),paidType:'Cash'});
    return {
      message: "Fine paid successfully",
    };
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error paying fine",
    };
  }
};

export const paidOnline = async (req, res) => {
  try {
    const id = await Fine.findById(req.transaction_uuid);
    const fine = await Fine.findByIdAndUpdate(id, { status: "paid",paid_date:Date.now(),paidType:'Online',transaction_code:req.transaction_code});
    res.redirect(`${process.env.FrontendAPI}/dashboard/fine`);
  } catch (error) {
    console.log(error.message);
    return {
      message: "Error paying fine",
    };
  }
};

export const getAllFines = async ({ userRole, userId }) => {
  try {
    const allFines = await Fine.find().populate({
      path: "issue",
      populate: [
        {
          path: "book",
          select: "_id name",
        },
        {
          path: "user",
          select: "_id name email",
        },
      ],
    });

    let Fines;
    if (userRole === "Librarian") {
      Fines = allFines;
    } else {
      Fines = allFines.filter(
        (fine) => fine.issue.user._id.toString() === userId.toString()
      );
    }

    return { Fines };
  } catch (error) {
    console.log(error.message);
    return { message: "Error getting fines" };
  }
};

export const payFine = async ({ data, userRole }) => {
  try {
    // const String=randomstring.generate(6);
    // Get the amount of the fine
    const amount = data.amount;
    const id = data._id;
    const dataToSign = `total_amount=${amount},transaction_uuid=${id},product_code=EPAYTEST`;
    const secretKey = process.env.EsewaSecretKey;
    const hash = CryptoJS.HmacSHA256(dataToSign, secretKey);
    const signature = CryptoJS.enc.Base64.stringify(hash);
    // Make a request to eSewa API to initiate the payment
    const formData = {
      amount: amount,
      tax_amount: 0,
      product_delivery_charge: 0,
      total_amount: amount,
      product_service_charge: 0,
      transaction_uuid: `${id}`,
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `${process.env.BackendAPI}/esewa-success`,
      failure_url: `${process.env.BackendAPI}/esewa-failure`,
    };

    // Return the eSewa response
    return formData;
  } catch (error) {
    console.log(error);
    return {
      message: "Error initiating payment",
    };
  }
};
