import React, { Component } from 'react';

const table = [
    { img: "assets/img/dashboard/country-1.jpg", entrance: 725, rate: 17.24, exits: 7.65 },
    { img: "assets/img/dashboard/country-2.jpg", entrance: 890, rate: 12.90, exits: 9.12 },
    { img: "assets/img/dashboard/country-3.jpg", entrance: 729, rate: 20.75, exits: 14.29 },
    { img: "assets/img/dashboard/country-4.jpg", entrance: 316, rate: 32.09, exits: 10.99 },
    { img: "assets/img/dashboard/country-5.jpg", entrance: 275, rate: 33.58, exits: 6.75 },
];

class Useractivity extends Component {
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-widget">
                    <div className="ms-panel-header">
                        <h6>Top User Activity By Country</h6>
                        <p>Users activity performance and bounce rate based on country</p>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover thead-light mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Country</th>
                                        <th scope="col">Entrances</th>
                                        <th scope="col">Bounce Rate</th>
                                        <th scope="col">Exits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.map((item, i) => (
                                        <tr key={i}>
                                            <th scope="row">
                                                <img src={process.env.PUBLIC_URL + "/" + item.img} alt="flags" />
                                            </th>
                                            <td>{item.entrance}</td>
                                            <td>{item.rate}%</td>
                                            <td>{item.exits}%</td>
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

export default Useractivity;
