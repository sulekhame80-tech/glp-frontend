import React, { useEffect, useState } from "react";
import { deleteRoutineApi, getRoutineListApi } from "../../api/endpoint";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ important
import logo from "../../../assets/img/dashboard/logo.jpeg";
import image from '../../../assets/img/dashboard/image1.PNG';
import "./patient.css";
import RoutineModal from "./RoutineModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RoutineProfile = () => {
  const [routines, setRoutines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadRoutines = () => {
    getRoutineListApi({
      search,
      page,
      page_size: 10
    })
      .then(res => {
        setRoutines(res.data.results);
        setTotalPages(res.data.total_pages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadRoutines();
  }, [search, page]);

  const handleEdit = (id) => {
    setEditId(id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this routine?")) return;
    deleteRoutineApi(id)
      .then(() => loadRoutines())
      .catch(err => console.error(err));
  };


  const downloadBill = (routine) => {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    /* ================= BORDER ================= */
    pdf.setLineWidth(0.8);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

    /* ================= HEADER ================= */
    // add company logo
    try {
      pdf.addImage(logo, "JPEG", 12, 10, 40, 18);
    } catch (e) {
      // ignore image errors
      console.warn("Could not add logo to PDF:", e);
    }

    // add genelife image on right side
    try {
      pdf.addImage(image, "PNG", pageWidth - 52, 10, 40, 18);
    } catch (e) {
      // ignore image errors
      console.warn("Could not add image to PDF:", e);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("LAB BILL RECEIPT", pageWidth / 2, 36, { align: "center" });

    pdf.setLineWidth(0.3);
    pdf.line(12, 40, pageWidth - 12, 40);

    /* ================= PATIENT DETAILS ================= */
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    let startY = 48;

    pdf.text(`Patient Name : ${routine.patient_name || "-"}`, 14, startY);
    pdf.text(`Lab ID : ${routine.lab_id || "-"}`, pageWidth - 14, startY, { align: "right" });

    startY += 8;
    pdf.text(`Email : ${routine.email_id?.trim() || "-"}`, 14, startY);
    pdf.text(`Mobile : ${routine.mobile_no || "-"}`, pageWidth - 14, startY, { align: "right" });

    startY += 8;
    pdf.text(`Sex : ${routine.sex?.trim() || "-"}`, 14, startY);
    pdf.text(`Age : ${routine.age ?? "-"}`, pageWidth - 14, startY, { align: "right" });

    /* ================= TEST TABLE ================= */
    autoTable(pdf, {
      startY: startY + 10,
      head: [["Test Code", "Test Name", "MRP"]],
      body: routine.test_details.map(t => [
        t.test_code,
        t.test_name,
        `${Number(t.mrp).toLocaleString()}`
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 35 },
        1: { halign: "left" },
        2: { halign: "right", cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });

    /* ================= TOTALS ================= */
    const y = pdf.lastAutoTable.finalY + 10;

    const totalMRP = routine.total_mrp
      ? Number(routine.total_mrp)
      : routine.test_details.reduce((sum, t) => sum + Number(t.mrp || 0), 0);

    const discount = Number(routine.discount || 0);
    const finalAmount = Number(routine.price || totalMRP - (totalMRP * discount) / 100);

    // Totals — label right-aligned at fixed x, value right-aligned at page edge
    const labelX = pageWidth - 55;  // right edge of label column
    const valueX = pageWidth - 14;  // right edge of value column

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);

    // Row 1: Total Amount
    pdf.text("Total Amount:", labelX, y, { align: "right" });
    pdf.text(`${totalMRP.toLocaleString()}`, valueX, y, { align: "right" });

    // Row 2: Discount
    pdf.text("Discount:", labelX, y + 8, { align: "right" });
    pdf.text(`${discount.toFixed(2)} %`, valueX, y + 8, { align: "right" });

    // Separator line
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth - 70, y + 11, pageWidth - 14, y + 11);

    // Row 3: Final Amount
    pdf.text("Final Amount:", labelX, y + 17, { align: "right" });
    pdf.text(`${finalAmount.toLocaleString()}`, valueX, y + 17, { align: "right" });

    /* ================= FOOTER ================= */
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    pdf.text(
      "Thank you for choosing our laboratory.",
      pageWidth / 2,
      pageHeight - 14,
      { align: "center" }
    );

    pdf.save(`Bill_${routine.patient_name}.pdf`);
  };


  return (
    <div className="routine-main-container">
      <div className="routine-header">
        <h3>Routine List</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditId(null);  // ❌ clear editId
            setShowModal(true);
          }}
        >
          + Add Routine
        </button>

      </div>

      {/* 🔍 SEARCH */}
      <div className="patient-search">
        <input
          type="text"
          style={{ width: "300px", height: "35px", borderRadius: "5px", borderColor: "#127405ff", paddingLeft: "10px" }}

          placeholder="Search by any field..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <p></p>
      {/* 📋 TABLE */}
      <table className="routine-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Lab ID</th>
            <th>Test Code</th>
            <th>Test Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routines.length > 0 ? routines.map(r => (
            <tr key={r.id}>
              <td>{r.patient_name}</td>
              <td>{r.lab_id}</td>
              <td>{r.test_code}</td>
              <td>{r.test_name}</td>
              <td>{r.price}</td>
              <td className="action-cell">
                <FaEdit
                  className="icon edit-icon"
                  title="Edit"
                  onClick={() => handleEdit(r.id)}
                />
                <FaTrash
                  className="icon -icon"
                  title="Delete"
                  onClick={() => handleDelete(r.id)}
                />
                <FaDownload
                  className="icon download-icon"
                  title="Download Bill"
                  onClick={() => downloadBill(r)}
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p></p>
      {/* 📄 PAGINATION */}

      <div className="custom-pagination">
        <FaChevronLeft
          className={`page-icon ${page === 1 ? "disabled-icon" : ""}`}
          onClick={() => page > 1 && setPage(prev => prev - 1)}
        />
        <span className="page-info">{page} / {totalPages}</span>
        <FaChevronRight
          className={`page-icon ${page === totalPages ? "disabled-icon" : ""}`}
          onClick={() => page < totalPages && setPage(prev => prev + 1)}
        />
      </div>

      {showModal && (
        <RoutineModal
          editId={editId}
          onClose={() => setShowModal(false)}
          onSuccess={loadRoutines}
        />
      )}
    </div>
  );
};

export default RoutineProfile;
