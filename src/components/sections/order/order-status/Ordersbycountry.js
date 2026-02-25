import React, { Component } from 'react';

const table = [
    { img: "assets/img/dashboard/country-1.jpg", name: "USA", user: 725, percentage: 17.24, exits: 234 },
    { img: "assets/img/dashboard/country-2.jpg", name: "China", user: 890, percentage: 12.90, exits: 425 },
    { img: "assets/img/dashboard/country-3.jpg", name: "Russia", user: 729, percentage: 20.75, exits: 598 },
    { img: "assets/img/dashboard/country-4.jpg", name: "Canada", user: 316, percentage: 32.09, exits: 112 },
];

class Ordersbycountry extends Component {
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-widget ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>Orders By Country</h6>
                        <p>Your orders base based on country</p>
                    </div>
                    <div className="ms-panel-body">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Country</th>
                                        <th scope="col">Users</th>
                                        <th scope="col">Percentage</th>
                                        <th scope="col">Exits</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.map((item, i) => (
                                        <tr key={i}>
                                            <th scope="row">
                                                <img src={process.env.PUBLIC_URL + "/" + item.img} alt={item.name} />{item.name}</th>
                                            <td>{item.user}</td>
                                            <td>{item.percentage}%</td>
                                            <td>{item.exits}</td>
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

export default Ordersbycountry;