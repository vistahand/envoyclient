import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

const payments = [
  { amount: 250000.00, transactionId: "TRX-18084578123", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", method: "Online (Paystack)", status: "Successful" },
  { amount: 250000.00, transactionId: "TRX-18084578123", date: "28 Oct 2024", purpose: "Standard Shipping, Basic Insurance", method: "Online (Paystack)", status: "Unsuccessful" },
  { amount: 250000.00, transactionId: "TRX-18084578123", date: "12 Oct 2024", purpose: "QuickWing, Basic Insurance", method: "Online (Paystack)", status: "Successful" }
];

const getStatusColor = (status) => {
  return status === "Successful" ? "text-green-500" : "text-red-500";
};

const PaymentsAdmin = () => {
  const [masterChecked, setMasterChecked] = useState(true);
  const [selectedPayments, setSelectedPayments] = useState(payments.map(() => true));
  
  const handleMasterCheckboxChange = () => {
    const newCheckedState = !masterChecked;
    setMasterChecked(newCheckedState);
    setSelectedPayments(payments.map(() => newCheckedState));
  };
  
  const handlePaymentCheckboxChange = (index) => {
    const newSelectedPayments = [...selectedPayments];
    newSelectedPayments[index] = !newSelectedPayments[index];
    setSelectedPayments(newSelectedPayments);
    
    // Update master checkbox based on individual selections
    if (newSelectedPayments.every(item => item)) {
      setMasterChecked(true);
    } else if (newSelectedPayments.every(item => !item)) {
      setMasterChecked(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">Payments History</h2>
        <p className="text-primary mt-1">View and manage all your transaction records</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-full">
          <thead className="text-primary border-b">
            <tr>
              <th className="py-3 px-2">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-4 w-4 accent-primary" 
                  checked={masterChecked}
                  onChange={handleMasterCheckboxChange}
                />
              </th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">
                Date Initiated
                <span className="inline-block ml-1">↕</span>
              </th>
              <th className="py-3 px-4">Payment Purpose</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {payments.map((payment, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-4 px-2">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 accent-primary" 
                    checked={selectedPayments[index]}
                    onChange={() => handlePaymentCheckboxChange(index)}
                  />
                </td>
                <td className="py-4 px-4">₦{payment.amount.toLocaleString()}</td>
                <td className="py-4 px-4">{payment.transactionId}</td>
                <td className="py-4 px-4">{payment.date}</td>
                <td className="py-4 px-4">{payment.purpose}</td>
                <td className="py-4 px-4">{payment.method}</td>
                <td className="py-4 px-4 flex items-center">
                <FaCircle style={{ color: payment.status === "Successful" ? "green" : "red" }} className="text-xs mr-2" />
                {payment.status}
                </td>
                <td className="py-4 px-4 text-center">
                  <BsThreeDots className="cursor-pointer text-lg text-primary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-primary">
        <div>
          <span>Rows per page: </span>
          <select className="border-none bg-transparent px-1">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <div>1-4 of 4</div>
          <div className="flex space-x-1">
            <button className="p-1"><FaAngleDoubleLeft className="text-gray-400" /></button>
            <button className="p-1"><FaChevronLeft className="text-gray-400" /></button>
            <button className="p-1"><FaChevronRight className="text-gray-400" /></button>
            <button className="p-1"><FaAngleDoubleRight className="text-gray-400" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsAdmin;