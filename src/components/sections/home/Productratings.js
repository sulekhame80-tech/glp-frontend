import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const productdata = [
    { title: "White Widow", img: "assets/img/dashboard/product-1.jpg", total: 245, repeat: 45 },
    { title: "Super Sunk", img: "assets/img/dashboard/product-2.jpg", total: 546, repeat: 146 },
    { title: "Low Rider", img: "assets/img/dashboard/product-2.jpg", total: 365, repeat: 265 },
    { title: "Low Rider", img: "assets/img/dashboard/product-2.jpg", total: 365, repeat: 265 },
];

class Productratings extends Component {
    render() {
        return (
            <div className="col-xl-8 col-md-12">
                <div className="ms-panel">
                    <div className="ms-panel-header  ms-panel-custom">
                        <div className="ms-heading">
                            <h6>Product Ratings</h6>
                            <p>Lorem Ipsum is simply dummy text of the printing</p>
                        </div>
                    </div>
                    <div className="ms-panel-body pb-1">
                        <div className="table-responsive">
                            <table className="table table-hover thead-primary">
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Product Ratings</th>
                                        <th>Total Order </th>
                                        <th>Repeat Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productdata.map((item, i) => (
                                        <tr key={i}>
                                            <td className="ms-table-f-w">
                                                <img src={process.env.PUBLIC_URL + "/" + item.img} alt={item.title} />
                                                <Link to="#">{item.title} </Link>
                                            </td>
                                            <td>
                                                <ul className="ms-star-rating mb-0 rating-fill rating-circle heart-rating">
                                                    <li className="ms-rating-item rating-custome"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                                    <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                                </ul>
                                            </td>
                                            <td>{item.total}</td>
                                            <td>{item.repeat}</td>
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

export default Productratings;