import React, { Component } from 'react';
import Averagenycountry from '../../home/Averagenycountry';
import GoogleAnalytics from './Googleanalytics';
import Topbar from './Topbar';
import Topuser from './Topuser';
import Websiteaudience from './Websiteaudience';
import PaymentSummaryTable from './Paymentsummary';
import LabRecordTable from './labrecord';
import ReportSummary from './reporttable';
import DashboardCalendar from './DashboardCalendar';

class Content extends Component {
  render() {
    return (
      <>
        <div className="ms-content-wrapper">
          {/* Top Metric Cards (Entire Screen Width) */}
          <div className="row no-gutters">
            <div className="col-md-12">
              <PaymentSummaryTable />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-xl-7 col-md-12">
              <Websiteaudience />
              <div className="mt-3">
                <ReportSummary />
              </div>
            </div>

            <div className="col-xl-5 col-md-12">
              <DashboardCalendar />
              <div className="mt-3">
                <GoogleAnalytics />
              </div>
            </div>
          </div>

          {/* LabRecordTable and ReportSummary remain below */}
          <div className="row">
            <div className="col-12 mt-3">
              <LabRecordTable />
            </div>
          </div>

          {/* Existing second row unchanged 
          <div className="row">
            <Topuser />
            <div className="col-xl-7 col-md-12">
              <Averagenycountry />
            </div>
          </div>*/}
        </div>
      </>
    );
  }
}

export default Content;
