import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { Carousel } from 'react-bootstrap';
import products from '../../../data/product.json';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Product'} pagecurrent={'Product Details'} />
                    <div className="col-md-12">
                        <div className="alert alert-success" role="alert">
                            <i className="flaticon-tick-inside-circle" />
                            <strong>Well done!</strong> You successfully add the product.
                        </div>
                    </div>
                    {products.filter(product => { return product.id === parseInt(this.props.productId) }).map((item, i) => (
                        <div key={i} className="col-12">
                            <div className="bg-white">
                                <div className="row">
                                    <div className="col-xl-6 col-md-12 mb-3 mb-xl-5">
                                        <div className="ms-panel shadow-none">
                                            <div className="ms-panel-body pb-0 produt-detail mb-0">
                                                <Carousel className="ms-dotted-indicator-slider">
                                                    {item.img.map((image, i) => (
                                                        <Carousel.Item key={i}>
                                                            <img className="d-block w-100" src={process.env.PUBLIC_URL + '/' + image} alt="slide" />
                                                        </Carousel.Item>
                                                    ))}
                                                </Carousel>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="row justify-content-center">
                                                <div className="col-sm-4 col-6">
                                                    <div className="progress-rounded progress-round-tiny">
                                                        <div className="progress-value">Return {item.return}%</div>
                                                        <svg>
                                                            <circle className="progress-cicle bg-primary" cx={65} cy={65} r={57} strokeWidth={4} fill="none" aria-valuenow={12} aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ "strokeDashoffset": (358.141563 - (358.141563 / 100) * item.return) + 'px' }}>
                                                            </circle>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4 col-6">
                                                    <div className="progress-rounded progress-round-tiny">
                                                        <div className="progress-value">Favourite {item.favorite}%</div>
                                                        <svg>
                                                            <circle className="progress-cicle bg-dark-green" cx={65} cy={65} r={57} strokeWidth={4} fill="none" aria-valuenow="38.8" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ "strokeDashoffset": (358.141563 - (358.141563 / 100) * item.favorite) + 'px' }}>
                                                            </circle>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="col-sm-4 col-6">
                                                    <div className="progress-rounded progress-round-tiny last-circle">
                                                        <div className="progress-value">Sales {item.sales}%</div>
                                                        <svg>
                                                            <circle className="progress-cicle bg-primary" cx={65} cy={65} r={57} strokeWidth={4} fill="none" aria-valuenow={100} aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ "strokeDashoffset": (358.141563 - (358.141563 / 100) * item.sales) + 'px' }}>
                                                            </circle>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-xl-6 col-md-12">
                                        <div className="ms-panel shadow-none ms-panel-fh">
                                            <div className="ms-panel-body pb-0">
                                                <h3>{item.title}</h3>
                                                <p>{item.longdesc}</p>
                                                <table className="table ms-profile-information">
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row">Id</th>
                                                            <td>{item.id}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Product Name</th>
                                                            <td>{item.title}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Product Category</th>
                                                            <td>{item.category}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Price</th>
                                                            <td>${new Intl.NumberFormat().format((item.price).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">Status</th>
                                                            <td>{item.stock === true ? <span className="badge badge-primary">In Stock</span> : <span className="badge badge-danger">Out of Stock</span>}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row">SKU Identication</th>
                                                            <td>{item.sku}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <button className="btn btn-primary mr-3  ms-graph-metrics mt-0">Edit</button>
                                                <button className="btn btn-green ms-graph-metrics mt-0">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Content;