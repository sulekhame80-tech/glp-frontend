import React, { Component } from 'react';
import Breadcrumb from '../../layouts/Breadcrumb';
import { Link } from 'react-router-dom';

const table = [
    { id: 1, name: "Chihoo Hwang", email: "Chihoo123@gmail.com", productname: "Hemp Oil", puchasedate: "15/11/2022", shipped: true },
    { id: 2, name: "Ammy Swallon", email: "Ammy123@gmail.com", productname: "Super Skunk", puchasedate: "13/11/2022", shipped: false },
    { id: 3, name: "John Doe", email: "John123@gmail.com", productname: "Ingrid", puchasedate: "11/11/2022", shipped: true },
    { id: 4, name: "Michale Hemm", email: "Michale123@gmail.com", productname: "Low Rider", puchasedate: "08/11/2022", shipped: true },
    { id: 5, name: "Bella Guitto", email: "Bella123@gmail.com", productname: "Super Skunk", puchasedate: "01/11/2022", shipped: false },
    { id: 6, name: "Jenny jgyie", email: "Jenny123@gmail.com", productname: "Ingrid", puchasedate: "20/11/2022", shipped: true },
    { id: 7, name: "Liam Hwang", email: "Liam123@gmail.com", productname: "Hemp Oil", puchasedate: "25/11/2022", shipped: true },
    { id: 8, name: "Noah Swallon", email: "Noah123@gmail.com", productname: "Super Skunk", puchasedate: "27/11/2022", shipped: true },
    { id: 9, name: "Benjamin Luitto", email: "Benjamin123@gmail.com", productname: "Ingrid", puchasedate: "10/11/2022", shipped: true },
    { id: 10, name: "Elijah Gubtto", email: "Elijah123@gmail.com", productname: "Low Rider", puchasedate: "05/11/2022", shipped: true },
]; 

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Shipment'} pagecurrent={'Shipment List'} />
                    <div className="col-xl-12 col-md-12">
                        <div className="ms-panel ms-panel-fh">
                            <div className="ms-panel-header">
                                <h6>Shipment List</h6>
                            </div>
                            <div className="ms-panel-body">
                                <div className="table-responsive">
                                    <table className="table thead-primary">
                                        <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Customer Name</th>
                                                <th scope="col">Email Id</th>
                                                <th scope="col">Product Name</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Purchase Date</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.map((item, i) => (
                                                <tr key={i}>
                                                    <th scope="row">{item.id}</th>
                                                    <td><Link to="#">{item.name}</Link></td>
                                                    <td>{item.email}</td>
                                                    <td>{item.productname}</td>
                                                    <td>{item.shipped === true ? <span className="badge badge-outline-success">Shipped</span> : <span className="badge badge-outline-danger">Pending</span>} </td>
                                                    <td>{item.puchasedate}</td>
                                                    <td> <Link to="#" className="ms-text-primary"> View Details</Link></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Content;
