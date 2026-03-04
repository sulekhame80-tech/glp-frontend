import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, NavLink } from 'react-bootstrap';

class Topbar extends Component {
    render() {
        return (
            <div className="col-md-12">
                <Dropdown className="ms-site-select">
                    <Dropdown.Toggle as={NavLink} className="ms-active-site d-inline-block has-chevron h2 p-0">
                        Weedo Dashboard
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <li className="ms-dropdown-list">
                            <form method="get" className="p-2">
                                <input type="search" className="form-control p-2" placeholder="Search Site" />
                            </form>
                            <div className="dropdown-divider" />
                            <Link className="media p-2 selected" to="#">
                                <div className="media-body">
                                    <span>Weedo Dashboard</span>
                                </div>
                            </Link>
                            <Link className="media p-2" to="#">
                                <div className="media-body">
                                    <span>Example Site 2</span>
                                </div>
                            </Link>
                            <Link className="media p-2" to="#">
                                <div className="media-body">
                                    <span>Example Site 3</span>
                                </div>
                            </Link>
                            <div className="dropdown-divider" />
                            <Link className="media p-2" to="#">
                                <div className="media-body">
                                    <span>Add New Site</span>
                                </div>
                            </Link>
                        </li>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}

export default Topbar;
