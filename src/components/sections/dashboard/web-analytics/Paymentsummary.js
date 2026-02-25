import React, { useEffect, useState, useContext } from "react";
import { getPaymentSummaryApi } from "../../../api/endpoint";
import "./paymentCard.css";
import { UserContext } from "../../../../UserContext";

function PaymentSummaryDashboard() {
  const [data, setData] = useState({
    total_received_amount: 0,
    pending_payments: 0,
    payout_pending: 0,
    payout_done: 0,
  });

  // ⬅️ now also get role from context
  const { location, role } = useContext(UserContext);

  useEffect(() => {
    console.log("Location in PaymentSummaryDashboard:", location);
    console.log("Role in PaymentSummaryDashboard:", role);

    getPaymentSummaryApi(location, role)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Payment Summary Error:", err));
  }, [location, role]); // re-run when location or role changes

  const formatValueClass = (value) => {
    return value.toString().length > 8 ? "card-value long-value" : "card-value";
  };

  const cards = [
    {
      title: "Total Received",
      value: `₹${data.total_received_amount}`,
      icon: "fa-solid fa-money-bill-wave",
      gradient: "card-gradient",
    },
    {
      title: "Pending Payments",
      value: data.pending_payments,
      icon: "fa-solid fa-clock",
      gradient: "card-gradient",
    },
    {
      title: "Payout Pending",
      value: data.payout_pending,
      icon: "fa-solid fa-hourglass-half",
      gradient: "card-gradient",
    },
    {
      title: "Payout Done",
      value: data.payout_done,
      icon: "fa-solid fa-check-circle",
      gradient: "card-gradient",
    },
  ];

  return (
    <div className="row">
      {cards.map((card, index) => (
        <div
          className="col-md-3 col-sm-6 mb-4"
          key={index}
          style={{ padding: "5px" }}
        >
          <div className={`dashboard-card ${card.gradient}`}>
            <div className="icon-wrapper">
              <i className={`${card.icon}`}></i>
            </div>

            <h6 className="card-title">{card.title}</h6>
            <h5 className={formatValueClass(card.value)}>{card.value}</h5>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PaymentSummaryDashboard;
