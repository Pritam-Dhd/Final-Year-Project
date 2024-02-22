import Issue from "../Schema/IssueSchema.js";
import Fine from "../Schema/FineSchema.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import randomstring from "randomstring";

const calculateFine = (dueDate) => {
  const today = new Date();
  if (today > dueDate) {
    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    return daysOverdue * 100;
  } else {
    return 0;
  }
};

export const addFines = async () => {
  try {
    const overdueIssues = await Issue.find({
      dueDate: { $lt: new Date() },
      status: "Not Returned",
    });

    for (const issue of overdueIssues) {
      const amount = calculateFine(issue.dueDate);

      // Check if a fine already exists for this issue
      const existingFine = await Fine.findOne({ issue: issue._id });

      if (existingFine) {
        // Update existing fine
        await Fine.updateOne({ _id: existingFine._id }, { amount });
      } else {
        // Insert new fine
        await Fine.create({
          issue: issue._id,
          amount,
        });
      }
    }
  } catch (error) {
    console.error("Error updating fines:", error);
  }
};

export const paidFine = async ({ data, userRole }) => {
  try {
    const fine = await Fine.findByIdAndUpdate(data._id, { status: "paid" });
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

export const paidOnline = async (req,res) => {
  try {
    const id = await Fine.findById(req.transaction_uuid);
    const fine = await Fine.findByIdAndUpdate(id, { status: "paid" });
    res.redirect("http://localhost:3002/dashboard/fine");
    // const fine = await Fine.findByIdAndUpdate(data._id, { status: "paid" });
    // return {
    //   message: "Fine paid successfully",
    // };
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
          select: "_id name",
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
      signature:signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: "http://localhost:5000/esewa-success", // Replace with your success URL
      failure_url: "http://localhost:5000/esewa-failure", // Replace with your failure URL
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

// export const getUserFines = async ({userRole, userId}) => {
//   try {
//     const allFines = await Fine.find().populate({
//       path: 'issue',
//       populate: {
//         path: 'book',
//         select: '_id name',
//       },
//     }).populate({
//       path: 'issue',
//       populate: {
//         path: 'user',
//         select: '_id name',
//       },
//     });

//     const Fines = allFines.filter(fine => fine.issue.user._id.toString() === userId);

//     return {
//       Fines,
//     };
//   } catch (error) {
//     console.log(error.message);
//     return {
//       message: 'Error getting fines for the user',
//     };
//   }
// };
