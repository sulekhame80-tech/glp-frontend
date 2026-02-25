import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const sellerdata = [
    { title: "White Widow", img: "assets/img/dashboard/product-1.jpg", status: true, lastpurchase: "10-01-2022", price: 450.50, total: 752 },
    { title: "Super Sunk", img: "assets/img/dashboard/product-2.jpg", status: true, lastpurchase: "09-01-2022", price: 350.50, total: 365 },
    { title: "Low Rider", img: "assets/img/dashboard/product-3.jpg", status: false, lastpurchase: "08-01-2022", price: 550.50, total: 165 },
];

class Topsellers extends Component {
    render() {
        return (
            <div className="col-xl-12 col-md-12">
                <div className="ms-panel">
                    <div className="ms-panel-header ms-panel-custom ">
                        <div className="ms-heading">
                            <h6>Top Sallers Products</h6>
                            <p>Lorem Ipsum is simply dummy text of the printing</p>
                        </div>
                    </div>
                    <div className="ms-panel-body pb-1">
                        <div className="table-responsive">
                            <table className="table table-hover thead-primary">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Avalability</th>
                                        <th>Last Purchase</th>
                                        <th>Ratings</th>
                                        <th>Price</th>
                                        <th>Total Orders</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellerdata.map((item, i) => (
                                        <tr key={i}>
                                            <td className="ms-table-f-w">
                                                <img src={process.env.PUBLIC_URL + "/" + item.img} alt={item.title} />
                                                <Link to="#">{item.title} </Link>
                                            </td>
                                            <td>
                                                {item.status === true ? <span className="badge badge-success">In Stock</span> : <span className="badge badge-danger">Out Of Stock</span>}
                                            </td>
                                            <td>{item.lastpurchase}</td>
                                            <td>
                                                <ul className="ms-star-rating rating-fill mb-0 rating-circle heart-rating">
                                                    <li className="ms-rating-item rating-custome"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rating-custome rated"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rating-custome rated"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rating-custome rated"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rating-custome rated"> <i className="material-icons">star</i> </li>
                                                </ul>
                                            </td>
                                            <td>${item.price}</td>
                                            <td>{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Topsellers;