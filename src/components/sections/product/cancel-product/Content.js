import React from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import { columns, data } from '../../../data/cancelproductlist';

function Content() {
    const tableData = {
        columns,
        data,
    };
    return (
        <div className="ms-content-wrapper">
            <div className="row">
                <Breadcrumb pageprev={'Product'} pagecurrent={'Cancel Product List'} />
                <div className="col-md-12">
                    <div className="ms-panel">
                        <div className="ms-panel-header">
                            <h6>Cancel Product List</h6>
                        </div>
                        <div className="ms-panel-body">
                            <div className="table-responsive">
                                <div className="thead-primary datatables">
                                    <DataTableExtensions {...tableData}>
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            pagination
                                            responsive={true}
                                            noHeader
                                            highlightOnHover
                                            striped
                                        />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
