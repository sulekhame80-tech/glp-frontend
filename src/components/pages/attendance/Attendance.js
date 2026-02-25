import React, { useEffect, useState, useRef } from "react";
import {
  getTechniciansForAttendanceApi,
  getAttendanceStatusApi,
  saveAttendanceApi,
  getAttendanceRangeApi, searchEmployeeAttendanceApi, getEmployeeMonthlyOrdersApi
} from "../../api/endpoint";
import { FiCalendar } from "react-icons/fi";

const Attendance = () => {
  const [technicians, setTechnicians] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [monthStatusMap, setMonthStatusMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const dateInputRef = useRef(null);
  const [mode, setMode] = useState("day");

  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayIso);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  });

  // 🔹 NEW (DAY PAGE ONLY)
  const [loginTimeMap, setLoginTimeMap] = useState({});
  const [logoutTimeMap, setLogoutTimeMap] = useState({});
  const [permissionDurationMap, setPermissionDurationMap] = useState({});
  const [permissionHourMap, setPermissionHourMap] = useState({});
  const [permissionMinuteMap, setPermissionMinuteMap] = useState({});
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeAttendance, setEmployeeAttendance] = useState({});
  const [employeePermissionTotal, setEmployeePermissionTotal] = useState("00:00");
  const [selectedUsername, setSelectedUsername] = useState("");
  // 🔹 Employee Monthly Orders
  const [employeeOrders, setEmployeeOrders] = useState([]);
  const [employeeOrderSummary, setEmployeeOrderSummary] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const css = `
    input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
    input[type="date"]::-moz-calendar-picker-indicator { display: none; }
    input[type="month"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
    input[type="month"]::-moz-calendar-picker-indicator { display: none; }
    input[type="date"], input[type="month"] { -webkit-appearance: none; -moz-appearance: textfield; appearance: none; }
  `;

  const STATUS_OPTIONS = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "half-day", label: "Half Day" },
    { value: "leave", label: "Leave" },
    { value: "holiday", label: "Holiday" },
  ];

  const rowHeight = 26;
  const visibleRows = 13;
  const tbodyMaxHeight = rowHeight * visibleRows;

  const techColWidth = 220;
  const userColWidth = 250;
  const dayColWidth = 120;
  const summaryColWidth = 120;

  const getMonthDays = (ym) => {
    const [yStr, mStr] = (ym || "").split("-");
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    if (!year || !month) return [];
    const days = [];
    const last = new Date(year, month, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const dt = new Date(year, month - 1, d);
      const iso = dt.toISOString().slice(0, 10);
      const label = String(d).padStart(2, "0") + "-" + String(month).padStart(2, "0") + "-" + String(year).slice(2);
      days.push({ iso, label });
    }
    return days;
  };

  const handleEmployeeSearch = async () => {
    const username = selectedUsername;

    if (!username) {
      alert("Please select username");
      return;
    }


    try {
      const res = await searchEmployeeAttendanceApi(
        username,
        selectedMonth
      );

      // 🔹 SAVE attendance map from backend
      setEmployeeAttendance(res.data.attendance || {});
      setEmployeePermissionTotal(res.data.total_permission_duration || "00:00");

    } catch (err) {
      console.error("Employee search failed:", err);
    }
  };

  const getCalendarMatrix = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const lastDate = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > lastDate) {
          week.push(null);
        } else {
          week.push(day++);
        }
      }
      weeks.push(week);
    }
    return weeks;
  };
  const [yearStr, monthStr] = selectedMonth.split("-");
  const calendarWeeks = getCalendarMatrix(
    Number(yearStr),
    Number(monthStr) - 1
  );


  const monthDays = getMonthDays(selectedMonth);
  const monthColsCount = monthDays.length;
  const monthTableMinWidth = techColWidth + userColWidth + monthColsCount * dayColWidth + 5 * summaryColWidth;

  // 🔹 Employee attendance totals (right side)
  const employeeTotals = {
    present: 0,
    absent: 0,
    "half-day": 0,
    leave: 0,
    holiday: 0,
  };

  Object.values(employeeAttendance || {}).forEach((st) => {
    if (employeeTotals.hasOwnProperty(st)) {
      employeeTotals[st] += 1;
    }
  });

  useEffect(() => {
    (async function loadTechs() {
      try {
        const res = await getTechniciansForAttendanceApi();
        const techs = res.data || [];
        setTechnicians(techs);
        setStatusMap({});
        setMonthStatusMap({});
      } catch (err) {
        console.error("Error fetching technician list:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (mode !== "day" || !selectedDate) return;

    let cancelled = false;

    (async function loadStatuses() {
      try {
        const res = await getAttendanceStatusApi(selectedDate);
        const rows = res.data || [];

        // key -> { status, login_time, logout_time, permission_duration }
        const lookup = {};
        rows.forEach((r) => {
          const key = `${(r.technician_name || "").trim()}||${(r.username || "").trim()}`;
          lookup[key] = {
            status: r.status || "",
            login_time: r.login_time || "",
            logout_time: r.logout_time || "",
            permission_duration: r.permission_duration || "",
          };
        });

        if (cancelled) return;

        const newStatusMap = {};
        const newLoginMap = {};
        const newLogoutMap = {};
        const newPermissionMap = {};

        technicians.forEach((tech, index) => {
          const key = `${(tech.technician_name || "").trim()}||${(tech.username || "").trim()}`;
          const data = lookup[key] || {};

          newStatusMap[index] = data.status || "";
          newLoginMap[index] = data.login_time || "";
          newLogoutMap[index] = data.logout_time || "";
          newPermissionMap[index] = data.permission_duration || "";
        });

        setStatusMap(newStatusMap);
        setLoginTimeMap(newLoginMap);
        setLogoutTimeMap(newLogoutMap);
        setPermissionDurationMap(newPermissionMap);

      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching attendance status:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, selectedDate, technicians.length]);

  useEffect(() => {
    if (mode !== "month" || !selectedMonth) return;
    let cancelled = false;
    (async function loadMonthStatuses() {
      try {
        const [yStr, mStr] = (selectedMonth || "").split("-");
        const year = parseInt(yStr, 10);
        const month = parseInt(mStr, 10);
        if (!year || !month) return;
        const first = new Date(year, month - 1, 1);
        const last = new Date(year, month, 0);
        const fromDate = first.toISOString().slice(0, 10);
        const toDate = last.toISOString().slice(0, 10);

        const res = await getAttendanceRangeApi(fromDate, toDate);
        const rows = res.data || [];
        const lookup = {};
        rows.forEach((r) => {
          const key = `${(r.technician_name || "").trim()}||${(r.username || "").trim()}||${r.date}`;
          lookup[key] = r.status || "";
        });
        if (!cancelled) setMonthStatusMap(lookup);
      } catch (err) {
        if (!cancelled) console.error("Error fetching month range:", err);
      }
    })();
    return () => { cancelled = true; };
  }, [mode, selectedMonth, technicians.length]);

  const openCalendar = () => {
    if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker();
    else dateInputRef.current.focus();
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setStatusMap({});
    setMonthStatusMap({});
  };
  const handleStatusChange = (index, value) => setStatusMap((p) => ({ ...p, [index]: value }));


  const handleSave = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const rows = technicians
      .map((tech, idx) => ({
        technician_name: tech.technician_name,
        username: tech.username,
        status: statusMap[idx] || "",

        // NEW FIELDS
        login_time: loginTimeMap[idx] || null,
        logout_time: logoutTimeMap[idx] || null,
        permission_duration: permissionDurationMap[idx] || null,
      }))
      .filter((r) => r.status); // only rows with status



    setSaving(true);
    setSaveResult(null);

    try {
      const payload = { date: selectedDate, rows };
      const res = await saveAttendanceApi(payload);
      setSaveResult(res.data || null);

      // ✅ IMPORTANT:
      // Do NOT rebuild statusMap manually
      // Let the existing DAY useEffect reload everything correctly
      setSelectedDate((d) => d);

      alert("Save complete.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed. See console for details.");
    } finally {
      setSaving(false);
    }
  };


  const computeMonthTotalsForTech = (tech) => {
    const totals = { present: 0, absent: 0, "half-day": 0, leave: 0, holiday: 0 };
    monthDays.forEach((d) => {
      const key = `${(tech.technician_name || "").trim()}||${(tech.username || "").trim()}||${d.iso}`;
      const st = monthStatusMap[key] || "";
      if (!st) totals.absent += 1;
      else if (st === "present") totals.present += 1;
      else if (st === "absent") totals.absent += 1;
      else if (st === "half-day") totals["half-day"] += 1;
      else if (st === "leave") totals.leave += 1;
      else if (st === "holiday") totals.holiday += 1;
      else totals.absent += 1;
    });
    return totals;
  };

  const computeDayTotalsForTech = (index) => {
    const st = statusMap[index] || "";
    const totals = { present: 0, absent: 0, "half-day": 0, leave: 0, holiday: 0 };
    if (!st) totals.absent = 1;
    else if (st === "present") totals.present = 1;
    else if (st === "absent") totals.absent = 1;
    else if (st === "half-day") totals["half-day"] = 1;
    else if (st === "leave") totals.leave = 1;
    else if (st === "holiday") totals.holiday = 1;
    else totals.absent = 1;
    return totals;
  };

  const tableWidth = mode === "month" ? `${Math.max(monthTableMinWidth, 1000)}px` : "100%";
  const formatHHMM = (value) => {
    if (!value) return "00:00";

    let v = value.trim();

    // If only number like "8" → "08:00"
    if (/^\d{1,2}$/.test(v)) {
      const h = Math.min(parseInt(v, 10), 23);
      return String(h).padStart(2, "0") + ":00";
    }

    // If like "1:2" or "1:20" or "01:2"
    if (/^\d{1,2}:\d{1,2}$/.test(v)) {
      let [h, m] = v.split(":").map((n) => parseInt(n, 10));
      h = Math.min(h, 23);
      m = Math.min(m, 59);
      return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    }

    // If invalid input → reset
    return "00:00";
  };

  const [ordersByDate, setOrdersByDate] = useState({});

  const fetchEmployeeMonthlyOrders = async () => {
    if (!selectedUsername || !selectedMonth) {
      alert("Please select employee and month");
      return;
    }

    try {
      setOrderLoading(true);

      const res = await getEmployeeMonthlyOrdersApi({
        username: selectedUsername,
        month: selectedMonth,
      });

      if (res.data) {
        // Map daily orders for calendar highlighting
        const daily = res.data.date_wise || [];
        const map = {};
        daily.forEach((row) => {
          map[row.date] = row.orders > 0; // true if orders exist
        });

        setOrdersByDate(map);

        setEmployeeOrders(daily);
        setEmployeeOrderSummary(res.data.summary || null);
      }
    } catch (err) {
      console.error("Failed to fetch employee orders", err);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="ms-content-wrapper">
      <style>{css}</style>
      <div className="row">
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px",
                padding: "4px 10px",
                height: "45px",
                minHeight: "45px"
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <select value={mode} onChange={handleModeChange}>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="employee">Employee</option>
                </select>


                <h6 style={{ margin: 0 }}>Attendance</h6>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {mode === "day" && (
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}

                {mode === "employee" && (
                  <>
                    <select
                      className="form-control"
                      value={selectedUsername}
                      onChange={(e) => setSelectedUsername(e.target.value)}
                      style={{ height: "36px", fontSize: "14px", width: "220px" }}
                    >
                      <option value="">Select Username</option>
                      {technicians.map((tech, idx) => (
                        <option key={idx} value={tech.username}>
                          {tech.username}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleEmployeeSearch();          // attendance calendar
                        fetchEmployeeMonthlyOrders();    // 🔥 orders report
                      }}
                      disabled={!selectedUsername}
                    >
                      Search
                    </button>
                  </>
                )}

                <div style={{ position: "relative", width: "170px" }}>
                  {mode === "day" ? (
                    <input ref={dateInputRef}
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        padding: "6px 36px 6px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        height: "36px",
                        fontSize: "14px",
                        width: "100%",
                        background: "#fff",
                      }}
                    />
                  ) : (
                    <input ref={dateInputRef}
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{
                        padding: "6px 36px 6px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ced4da",
                        height: "36px",
                        fontSize: "14px",
                        width: "100%",
                        background: "#fff",
                      }}
                    />
                  )}

                  <button type="button"
                    onClick={openCalendar}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#000",
                      padding: 0,
                    }}>
                    <FiCalendar size={18} />
                  </button>
                </div>
              </div>
            </div>


            {mode !== "employee" && (
              <div className="ms-panel-body" style={{ paddingTop: "0px" }}>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <div style={{ minWidth: tableWidth }}>
                    <table className="table table-bordered" style={{ marginBottom: 0, width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <thead>
                        <tr style={{ height: "40px" }}>
                          <th style={{ minWidth: `${techColWidth}px`, width: `${techColWidth}px` }}>Technician Name</th>
                          <th style={{ minWidth: `${userColWidth}px`, width: `${userColWidth}px` }}>Username</th>

                          {mode === "day" ? (
                            <>
                              <th style={{ minWidth: "220px", width: "220px" }}>Status</th>
                              <th style={{ minWidth: "140px", width: "140px" }}>Login Time</th>
                              <th style={{ minWidth: "140px", width: "140px" }}>Logout Time</th>
                              <th style={{ minWidth: "160px", width: "150px" }}>Permission Hours</th>
                            </>
                          ) : (
                            monthDays.map((d) => (
                              <th key={d.iso} style={{ minWidth: `${dayColWidth}px`, width: `${dayColWidth}px`, textAlign: "center" }}>{d.label}</th>
                            ))
                          )}

                          {mode === "month" && (
                            <>
                              <th style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center" }}>Present</th>
                              <th style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center" }}>Absent</th>
                              <th style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center" }}>Half Day</th>
                              <th style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center" }}>Leave</th>
                              <th style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center" }}>Holiday</th>
                            </>
                          )}
                        </tr>
                      </thead>
                    </table>

                    <div style={{ maxHeight: `${tbodyMaxHeight}px`, borderTop: "none" }}>
                      <table className="table table-bordered" style={{ marginBottom: 0, width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <tbody>
                          {technicians.length === 0 ? (
                            <tr style={{ height: `${rowHeight}px` }}>
                              <td colSpan={mode === "month" ? 2 + monthColsCount + 5 : 3} className="text-center" style={{ padding: "8px" }}>No technicians found</td>
                            </tr>
                          ) : (
                            technicians.map((tech, index) => {
                              const totals = mode === "month" ? computeMonthTotalsForTech(tech) : computeDayTotalsForTech(index);

                              return (
                                <tr key={index} style={{ height: `${rowHeight}px` }}>
                                  <td style={{ minWidth: `${techColWidth}px`, width: `${techColWidth}px`, padding: "4px 8px", verticalAlign: "middle", fontSize: "13px" }}>{tech.technician_name}</td>
                                  <td style={{ minWidth: `${userColWidth}px`, width: `${userColWidth}px`, padding: "4px 8px", verticalAlign: "middle", fontSize: "13px" }}>{tech.username}</td>

                                  {mode === "day" ? (
                                    <>
                                      <td style={{ minWidth: "220px", width: "220px", padding: "4px 8px", verticalAlign: "middle" }}>
                                        <select className="form-control" value={statusMap[index] || ""} onChange={(e) => handleStatusChange(index, e.target.value)} style={{ height: `${rowHeight - 2}px`, padding: "2px 6px", fontSize: "13px", width: "100%" }}>
                                          <option value="">Select Status</option>
                                          {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                      </td>

                                      <td style={{ minWidth: "140px", width: "140px" }}>
                                        <input
                                          type="time"
                                          className="form-control"
                                          value={loginTimeMap[index] || ""}
                                          onChange={(e) =>
                                            setLoginTimeMap((p) => ({ ...p, [index]: e.target.value }))
                                          }
                                          style={{
                                            height: `${rowHeight - 7}px`,
                                            padding: "2px 6px",
                                            fontSize: "13px",
                                          }}
                                        />

                                      </td>

                                      <td style={{ minWidth: "140px", width: "140px" }}>
                                        <input
                                          type="time"
                                          className="form-control"
                                          value={logoutTimeMap[index] || ""}
                                          onChange={(e) =>
                                            setLogoutTimeMap((p) => ({ ...p, [index]: e.target.value }))
                                          }
                                          style={{
                                            height: `${rowHeight - 7}px`,
                                            padding: "2px 6px",
                                            fontSize: "13px",
                                          }}
                                        />

                                      </td>

                                      <td style={{ minWidth: "140px", width: "150px" }}>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="HH:MM"
                                          value={permissionDurationMap[index] ?? "00:00"}
                                          onChange={(e) => {
                                            const raw = e.target.value;
                                            setPermissionDurationMap((p) => ({
                                              ...p,
                                              [index]: raw,
                                            }));
                                          }}
                                          onBlur={() => {
                                            setPermissionDurationMap((p) => ({
                                              ...p,
                                              [index]: formatHHMM(p[index]),
                                            }));
                                          }}
                                          style={{
                                            height: `${rowHeight - 7}px`,
                                            padding: "2px 6px",
                                            fontSize: "13px",
                                          }}
                                        />
                                      </td>



                                    </>


                                  ) : (
                                    monthDays.map((d) => {
                                      const key = `${(tech.technician_name || "").trim()}||${(tech.username || "").trim()}||${d.iso}`;
                                      const val = monthStatusMap[key] || "";
                                      return (
                                        <td key={d.iso} style={{ minWidth: `${dayColWidth}px`, width: `${dayColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle", fontSize: "13px" }}>
                                          {val ? val : ""}
                                        </td>
                                      );
                                    })
                                  )}

                                  {mode === "month" && (
                                    <>
                                      <td style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>{totals.present}</td>
                                      <td style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>{totals.absent}</td>
                                      <td style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>{totals["half-day"]}</td>
                                      <td style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>{totals.leave}</td>
                                      <td style={{ minWidth: `${summaryColWidth}px`, width: `${summaryColWidth}px`, textAlign: "center", padding: "4px 8px", verticalAlign: "middle" }}>{totals.holiday}</td>
                                    </>
                                  )}
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === "employee" && (
              <div>
                <div
                  className="ms-panel-body"
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* ===== CALENDAR ===== */}
                  <table
                    className="table table-bordered"
                    style={{
                      width: "75%",
                      tableLayout: "fixed",
                    }}
                  >
                    <thead>
                      <tr>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                          <th
                            key={d}
                            style={{
                              textAlign: "center",
                              width: "40px",
                              fontSize: "12px",
                              padding: "4px",
                            }}
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {calendarWeeks.map((week, i) => (
                        <tr key={i}>
                          {week.map((day, j) => {
                            if (!day) {
                              return (
                                <td
                                  key={j}
                                  style={{
                                    width: "40px",
                                    height: "45px",
                                    background: "#f8f9fa",
                                  }}
                                />
                              );
                            }

                            const dateIso = `${yearStr}-${monthStr}-${String(day).padStart(2, "0")}`;
                            const status = employeeAttendance[dateIso];

                            const STATUS_COLORS = {
                              present: "#28a745",
                              absent: "#dc3545",
                              "half-day": "#ffc107",
                              leave: "#17a2b8",
                              holiday: "#6f42c1",
                            };

                            const bgColor = STATUS_COLORS[status];

                            return (
                              <td
                                key={j}
                                title={status || ""}
                                style={{
                                  width: "40px",
                                  height: "45px",
                                  padding: "3px",
                                  fontSize: "12px",
                                  textAlign: "right",
                                  verticalAlign: "top",
                                  cursor: "pointer",
                                  backgroundColor: bgColor || "transparent",
                                  color: bgColor ? "#fff" : "#000",
                                }}
                              >
                                <strong>{day}</strong>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* ===== LEGEND ===== */}
                  <div style={{ minWidth: "180px", marginTop: "6px" }}>
                    {[
                      { key: "present", label: "Present", color: "#28a745" },
                      { key: "absent", label: "Absent", color: "#dc3545" },
                      { key: "half-day", label: "Half Day", color: "#ffc107" },
                      { key: "leave", label: "Leave", color: "#17a2b8" },
                      { key: "holiday", label: "Holiday", color: "#6f42c1" },
                    ].map((item) => (
                      <div
                        key={item.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          marginBottom: "10px",
                          fontSize: "13px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: item.color,
                              display: "inline-block",
                            }}
                          />
                          {item.label}
                        </div>

                        <strong>{employeeTotals[item.key] || 0}</strong>
                      </div>
                    ))}

                    {employeeOrderSummary && (
                      <div>
                        <p>Total Order: {employeeOrderSummary.total_orders}</p>
                        <p>Payment Received: ₹ {employeeOrderSummary.total_payment_received}</p>
                      </div>
                    )}
                    {/* ===== PERMISSION DURATION ===== */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginTop: "12px",
                        paddingTop: "10px",
                        borderTop: "1px solid #ddd",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "#343a40",
                            display: "inline-block",
                          }}
                        />
                        Permission Hours
                      </div>

                      <strong>{employeePermissionTotal ? `${employeePermissionTotal} Hr` : "00:00 Hr"}</strong>



                    </div>
                  </div>

                </div>
                <p></p>


              </div>

            )}



          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
