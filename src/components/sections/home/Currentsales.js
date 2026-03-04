import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';

const tabledata = [
    { price: 7860.24, amount: 0.528, icon: "dollar", trackid: "TR34351", date: "12.01.2022", extclass: "BTC" },
    { price: 5813.44, amount: 0.345, icon: "pound", trackid: "TR34352", date: "12.01.2022", extclass: "ETH" },
    { price: 1264.99, amount: 0.117, icon: "dollar", trackid: "TR34353", date: "12.01.2022", extclass: "BTC" },
    { price: 3789.31, amount: 0.217, icon: "euro", trackid: "TR34354", date: "11.01.2022", extclass: "PPC-alt" },
    { price: 7860.24, amount: 0.528, icon: "dollar", trackid: "TR34355", date: "11.01.2022", extclass: "BTC" },
    { price: 7860.24, amount: 0.528, icon: "dollar", trackid: "TR34356", date: "11.01.2022", extclass: "BTC" },
    { price: 7860.24, amount: 0.528, icon: "dollar", trackid: "TR34357", date: "10.01.2022", extclass: "BTC" },
    { price: 5813.44, amount: 0.345, icon: "pound", trackid: "TR34358", date: "10.01.2022", extclass: "ETH" },
];

class Currentsales extends Component {
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-panel-fh ms-crypto-orders">
                    <Tab.Container defaultActiveKey="tab1">
                        <div className="ms-panel-header">
                            <div className="d-flex justify-content-between">
                                <div className="ms-header-text">
                                    <h6>Current Sales</h6>
                                    <p>Manage your current sale and buy orders</p>
                                </div>
                                <Nav variant="tabs" className="btn-group btn-group-toggle nav nav-tabs ms-graph-metrics">
                                    <Nav.Item>
                                        <Nav.Link className="btn btn-sm" eventKey="tab1">
                                            Buy Orders
                                    </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link className="btn btn-sm" eventKey="tab2">
                                            Sell Orders
                                    </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </div>
                        <div className="ms-panel-body p-0">
                            <Tab.Content>
                                <Tab.Pane eventKey="tab1">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Price ($)</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Track ID</th>
                                                    <th scope="col">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tabledata.map((item, i) => (
                                                    <tr key={i}>
                                                        <td>${item.price}</td>
                                                        <td><i className={"fas fa-" + item.icon + "-sign " + item.extclass} />{item.amount}</td>
                                                        <td>#{item.trackid}</td>
                                                        <td>{item.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="tab2">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Price ($)</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Track ID</th>
                                                    <th scope="col">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tabledata.map((item, i) => (
                                                    <tr key={i}>
                                                        <td>${item.price}</td>
                                                        <td><i className={"fas fa-" + item.icon + "-sign " + item.extclass} />{item.amount}</td>
                                                        <td>#{item.trackid}</td>
                                                        <td>{item.date}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>
        );
    }
}

export default Currentsales;
