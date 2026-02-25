import React, { Component } from 'react';
import Averagenycountry from '../../home/Averagenycountry';
import Googleanalytics from './Googleanalytics';
// import Sessions from './Sessions';
import Topbar from './Topbar';
import Topuser from './Topuser';
import Websiteaudience from './Websiteaudience';
import PaymentSummaryTable from './Paymentsummary';
import LabRecordTable from './labrecord'; // NEW import to render full-width
import ReportSummary from './reporttable';

class Content extends Component {
  render() {
    return (
      <div className="ms-content-wrapper">
        {/* Row with Websiteaudience (7-col) and Googleanalytics (5-col) */}
        <div className="row">
         
          <div className="col-xl-7 col-md-12">
            <Websiteaudience />
          </div>

          <div className="col-xl-5 col-md-12">
            <Googleanalytics />
            {/* <Sessions />  */}
          </div>
        </div>

        {/* NEW ROW: full-width LabRecordTable (12 columns) */}
        <div className="row">
          <div className="col-xl-12 col-md-12 mt-3">
            <LabRecordTable />
          </div>
        </div>
         <div className="row">
          <div className="col-xl-12 col-md-12 mt-3">
            <ReportSummary />
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
    );
  }
}

export default Content;
