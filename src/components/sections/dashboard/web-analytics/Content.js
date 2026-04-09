import React from 'react';
import GoogleAnalytics from './Googleanalytics';
import PaymentSummaryTable from './Paymentsummary';
import LabRecordTable from './labrecord';
import ReportSummary from './reporttable';
import DashboardCalendar from './DashboardCalendar';

const Content = () => {
  return (
    <div className="ms-content-wrapper">
      
      {/* Top Metric Cards */}
      <div className="row g-0">
        <div className="col-md-12">
          <PaymentSummaryTable />
        </div>
      </div>

      <div className="row mt-3 g-3">
        <div className="col-xl-7 col-md-12">
          <ReportSummary />
        </div>

        <div className="col-xl-5 col-md-12">
          <DashboardCalendar />
          <div className="mt-3">
            <GoogleAnalytics />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 mt-3">
          <LabRecordTable />
        </div>
      </div>

    </div>
  );
};

export default Content;
