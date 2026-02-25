import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { columns, data } from '../../../data/invoicelist';
import { getInvoicesApi } from '../../../api/endpoint';

function Content() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & search
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await getInvoicesApi({ page, page_size: pageSize, search });
      setData(response.data.data); // assuming your API returns { data: [...], pagination: {...} }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, pageSize, search]);

  return (
    <div className="ms-Content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={'Invoice'} pagecurrent={'Invoice List'} />
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header d-flex justify-Content-between align-items-center">
              <h6 style={{marginRight:"20px"}}>Invoice List</h6>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-control w-auto"
              />
            </div>
            <div className="ms-panel-body">
              <div className="table-responsive">
                <DataTableExtensions columns={columns} data={data}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;
