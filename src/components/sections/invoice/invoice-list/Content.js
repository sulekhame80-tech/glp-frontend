import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import DataTable_ from 'react-data-table-component';
import DataTableExtensions_ from 'react-data-table-component-extensions';
import { columns } from '../../../data/invoicelist';
import { getInvoicesApi } from '../../../api/endpoint';

// Robustly handle the imports (default vs named/cjs)
const DataTable = DataTable_?.default || DataTable_;
const DataTableExtensions = DataTableExtensions_?.default || DataTableExtensions_;

function Content() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  // 📝 Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await getInvoicesApi({
        page,
        page_size: pageSize,
        search,
        start_date: startDate,
        end_date: endDate
      });
      if (response && response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSearch('');
    setPage(1);
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize, search, startDate, endDate]);

  const tableData = {
    columns,
    data
  };

  return (
    <>
      <div className="ms-content-wrapper">
        <div className="row">
          <Breadcrumb pageprev={'Invoice'} pagecurrent={'Invoice List'} />
        </div>

        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Invoice List</h6>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleReset}
                  style={{ borderRadius: '20px', padding: '5px 15px' }}
                >
                  <i className="fas fa-undo mr-1"></i> Reset Filters
                </button>
              </div>

              <div className="row align-items-end g-3">
                <div className="col-lg-3 col-md-6">
                  <div className="ms-form-group">
                    <label className="small text-muted mb-1">From Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-right-0">
                        <i className="fas fa-calendar-alt text-muted small"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control form-control-sm border-left-0"
                        value={startDate}
                        onChange={e => { setStartDate(e.target.value); setPage(1); }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="ms-form-group">
                    <label className="small text-muted mb-1">To Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-right-0">
                        <i className="fas fa-calendar-check text-muted small"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control form-control-sm border-left-0"
                        value={endDate}
                        onChange={e => { setEndDate(e.target.value); setPage(1); }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-12">
                  <div className="ms-form-group">
                    <label className="small text-muted mb-1">Search Invoice / Patient</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-right-0">
                        <i className="fas fa-search text-muted small"></i>
                      </span>
                      <input
                        type="text"
                        placeholder="Type to search..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="form-control form-control-sm border-left-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ms-panel-body">
              <div className="table-responsive">
                {DataTableExtensions && columns && data ? (
                  <DataTableExtensions
                    {...tableData}
                    filter={false}
                    export={true}
                    print={true}
                  >
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      paginationServer
                      paginationTotalRows={data.length}
                      onChangePage={setPage}
                      onChangeRowsPerPage={setPageSize}
                      responsive
                      noHeader
                      highlightOnHover
                      striped
                      progressPending={loading}
                    />
                  </DataTableExtensions>
                ) : (
                  <div>Loading Table...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;
