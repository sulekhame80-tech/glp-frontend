import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLabrecordApi } from '../../../api/endpoint';
import { UserContext } from '../../../../UserContext';
import { FiChevronLeft, FiChevronRight, FiArrowLeft, FiEye } from 'react-icons/fi';

const DashboardCalendar = () => {
  const { location, role } = useContext(UserContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOrders, setDateOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Fetch orders for the current month to show markers
  useEffect(() => {
    fetchMonthOrders();
  }, [currentMonth, location, role]);

  const fetchMonthOrders = async () => {
    try {
      // Fetch a larger page size to get enough markers for the month
      const res = await getLabrecordApi(1, 100, "", location, role);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetching month orders:", error);
    }
  };

  const fetchDateOrders = async (dateStr) => {
    setLoading(true);
    try {
      const res = await getLabrecordApi(1, 50, "", location, role, dateStr);
      setDateOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetching date orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
    fetchDateOrders(dateStr);
  };

  const renderHeader = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
      <div className="d-flex justify-content-between align-items-center mb-0 p-2 border-bottom bg-white" style={{ borderRadius: '4px 4px 0 0' }}>
        <h6 className="mb-0 font-weight-bold text-uppercase" style={{ fontSize: '0.8rem', color: '#334155' }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h6>
        <div className="btn-group">
          <button className="btn btn-sm btn-link text-secondary p-1" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
            <FiChevronLeft size={16} />
          </button>
          <button className="btn btn-sm btn-link text-secondary p-1" onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="row no-gutters border-bottom">
        {days.map((day, idx) => (
          <div key={`${day}-${idx}`} className="col text-center font-weight-bold py-2 border-right" style={{ 
            color: '#334155', 
            fontSize: '11px', 
            backgroundColor: '#ebf8ff',
            borderLeft: idx === 0 ? 'none' : 'none'
          }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(monthStart.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

    const rows = [];
    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(day);
        const dateStr = formatDate(currentDay);
        const isCurrentMonth = currentDay.getMonth() === currentMonth.getMonth();
        const hasOrders = orders.some(o => o.patient_id__expected_report_date && o.patient_id__expected_report_date.startsWith(dateStr));

        days.push(
          <div
            key={dateStr}
            className={`col p-0 text-center border-right border-bottom pointer`}
            style={{
              minHeight: '45px',
              cursor: 'pointer',
              backgroundColor: isCurrentMonth ? '#f0f9ff' : '#fff',
              position: 'relative',
              transition: 'background-color 0.2s'
            }}
            onClick={() => handleDateClick(currentDay)}
          >
            <div className="p-1 text-right w-100" style={{ position: 'absolute', top: 0, right: 0 }}>
              <span className="font-weight-bold" style={{ 
                fontSize: '10px', 
                color: isCurrentMonth ? '#334155' : '#cbd5e1' 
              }}>
                {currentDay.getDate()}
              </span>
            </div>
            
            <div className="d-flex justify-content-center align-items-end h-100 pb-1" style={{ minHeight: '45px' }}>
              {hasOrders && (
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.4)'
                }} />
              )}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(<div className="row no-gutters" key={day.getTime()}>{days}</div>);
      days = [];
    }
    return (
      <div className="calendar-grid border-left" style={{ borderTop: 'none' }}>
        {rows}
      </div>
    );
  };

  const navigate = useNavigate();

  const handleSeeDetail = (orderId) => {
    navigate('/order/order-status', { state: { searchOrderId: orderId } });
  };

  const renderDetailView = () => (
    <div className="p-1">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ position: 'relative' }}>
        <button className="btn btn-link p-0 text-primary" onClick={() => setSelectedDate(null)} title="Back to Calendar" style={{ width: '30px', textAlign: 'left', zIndex: 1 }}>
          <FiArrowLeft size={20} />
        </button>
        <div className="text-center font-weight-bold" style={{ 
          fontSize: '0.9rem', 
          color: '#333',
          position: 'absolute',
          left: 0,
          right: 0,
          pointerEvents: 'none'
        }}>
          Reports: {selectedDate}
        </div>
        <div style={{ width: '30px' }}></div> {/* Spacer to maintain symmetry */}
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-hover mb-0" style={{ fontSize: '11px' }}>
          <thead className="thead-light">
            <tr>
              <th className="align-middle" style={{ width: '40px' }}>ID</th>
              <th className="align-middle">Patient</th>
              <th className="align-middle text-center" style={{ width: '40px' }}>Status</th>
              <th className="align-middle text-center" style={{ width: '40px' }}>View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-3">...</td></tr>
            ) : dateOrders.length > 0 ? (
              dateOrders.map(order => (
                <tr key={order.order_id}>
                  <td className="align-middle font-weight-bold">{order.order_id.slice(-5)}</td>
                  <td className="align-middle text-truncate" style={{ maxWidth: '70px' }} title={order.patient_id__patient_name}>
                    {order.patient_id__patient_name || '-'}
                  </td>
                  <td className="align-middle text-center">
                    <span className={`badge p-1 badge-${order.report_status === 'Completed' ? 'success' : 'warning'}`} style={{ fontSize: '9px', minWidth: '18px', display: 'inline-block' }}>
                      {order.report_status ? order.report_status.charAt(0) : 'P'}
                    </span>
                  </td>
                  <td className="align-middle text-center">
                    <button 
                      className="btn btn-link p-0 m-0 line-height-1" 
                      onClick={() => handleSeeDetail(order.order_id)}
                      title="See Full Detail"
                      style={{ color: '#28a745', background: 'none', border: 'none', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  <div className="small">No reports found</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="ms-panel">
      <div className="ms-panel-header p-2">
        <h6 className="mb-0" style={{ fontSize: '0.8rem' }}>Reports Calendar</h6>
      </div>
      <div className="ms-panel-body p-2" style={{ minHeight: '300px', overflow: 'hidden' }}>
        {selectedDate ? (
          <div key="detail" className="animate__animated animate__fadeIn animate__faster">
            {renderDetailView()}
          </div>
        ) : (
          <div key={`month-${currentMonth.getTime()}`} className="calendar animate__animated animate__fadeIn animate__faster">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCalendar;
