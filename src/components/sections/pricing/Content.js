import React, { Component } from 'react';
import Breadcrumb from '../../layouts/Breadcrumb';
import { Link } from 'react-router-dom';

const table = [
    { id: 1, img: "assets/img/dashboard/product-1.jpg", productname: "Tahoe OG", qty: 2, price: 450.50, noofpurchase: 50 },
    { id: 2, img: "assets/img/dashboard/product-2.jpg", productname: "Green Crack", qty: 1, price: 892.50, noofpurchase: 20 },
    { id: 3, img: "assets/img/dashboard/product-3.jpg", productname: "Hemp Oil", qty: 3, price: 650.50, noofpurchase: 30 },
    { id: 4, img: "assets/img/dashboard/product-1.jpg", productname: "Gummy Bears", qty: 1, price: 350.50, noofpurchase: 10 },
    { id: 5, img: "assets/img/dashboard/product-2.jpg", productname: "Grape Ape", qty: 5, price: 520.50, noofpurchase: 20 },
    { id: 6, img: "assets/img/dashboard/product-3.jpg", productname: "Mango Kush", qty: 2, price: 680.50, noofpurchase: 50 },
    { id: 7, img: "assets/img/dashboard/product-1.jpg", productname: "Hempi Oil", qty: 3, price: 320.50, noofpurchase: 42 },
    { id: 8, img: "assets/img/dashboard/product-3.jpg", productname: "Purple Haze", qty: 4, price: 520.50, noofpurchase: 52 },
    { id: 9, img: "assets/img/dashboard/product-1.jpg", productname: "UK Cheese", qty: 3, price: 620.50, noofpurchase: 30 },
];

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Pricing'} pagecurrent={'Pricing List'} />
                    <div className="col-xl-12 col-md-12">
                        <div className="ms-panel ms-panel-fh">
                            <div className="ms-panel-header">
                                <h6>Pricing List</h6>
                            </div>
                            <div className="ms-panel-body">
                                <div className="table-responsive">
                                    <table className="table thead-primary">
                                        <thead>
                                            <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Product Name</th>
                                                <th scope="col">Qty.</th>
                                                <th scope="col">Pricing</th>
                                                <th scope="col">No. Of Purchase</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.map((item, i) => (
                                                <tr key={i}>
                                                    <th scope="row">{item.id}</th>
                                                    <td>
                                                        <img src={process.env.PUBLIC_URL + "/" + item.img} alt={item.productname} />
                                                        {item.productname}
                                                    </td>
                                                    <td>{item.qty}</td>
                                                    <td>${new Intl.NumberFormat().format((item.price).toFixed(2))}</td>
                                                    <td>{item.noofpurchase}</td>
                                                    <td>
                                                        <Link to="#">
                                                            <i className="fas fa-pencil-alt ms-text-primary" />
                                                            <i className="far fa-trash-alt ms-text-danger" />
                                                        </Link>
                                                    </td>
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
