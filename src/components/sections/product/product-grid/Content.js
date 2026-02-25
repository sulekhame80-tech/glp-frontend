import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { Link } from 'react-router-dom';
import products from '../../../data/product.json'

class Content extends Component {
    render() { 
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Product'} pagecurrent={'Product grid'} />
                    {products.map((item, i) => (
                        <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                            <div className="ms-card">
                                <div className="ms-card-img">
                                    <img src={process.env.PUBLIC_URL + "/" + item.img[0]} alt={item.title} />
                                </div>
                                <div className="ms-card-body">
                                    <div className="ms-panel-custom">
                                        <h4>{item.title}</h4>
                                        <span className="ms-text-primary">${new Intl.NumberFormat().format((item.price).toFixed(2))}</span>
                                    </div>
                                    <p>{item.shortdesc}</p>
                                    <div className="ms-panel-custom">
                                        <button className="btn btn-primary mr-2  ms-custom-btn">Edit</button>
                                        <Link to={"/product/product-detail/" + item.id} className="btn btn-dark ms-custom-btn">View</Link>
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