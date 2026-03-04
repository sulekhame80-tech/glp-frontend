import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, NavLink } from 'react-bootstrap';
import Scrollbar from 'react-perfect-scrollbar';
import email from '../../../data/emaillist.json';
import { TablePagination } from '@trendmicro/react-paginations';

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emaillist: email,
            page: 1,
            pageLength: 10,
            totalRecords: email.length
        }
    }
    pinnedToggle(item) {
        item.pinned = !item.pinned;
        this.setState({ emaillist: this.state.emaillist })
    }
    render() {
        return (
            <Fragment>
                <div className="ms-email-main">
                    <div className="ms-panel-header">
                        <h6>Inbox</h6>
                        <p>You have 17 Unread Messages</p>
                        <ul className="ms-email-pagination">
                            <TablePagination
                                type="minor"
                                page={this.state.page}
                                pageLength={this.state.pageLength}
                                totalRecords={this.state.totalRecords}
                                onPageChange={({ page, pageLength }) => {
                                    this.setState({ page, pageLength })
                                }}
                                prevPageRenderer={() => <i className="material-icons">keyboard_arrow_left</i>}
                                nextPageRenderer={() => <i className="material-icons">keyboard_arrow_right</i>}
                            />
                        </ul>
                    </div>
                    <div className="ms-email-header">
                        <ul className="ms-email-options">
                            <li>
                                <label className="ms-checkbox-wrap">
                                    <input type="checkbox" className="ms-email-check-all" defaultValue />
                                    <i className="ms-checkbox-check" />
                                </label>
                                <Dropdown className="dropdown">
                                    <Dropdown.Toggle as={NavLink} className="has-chevron p-0">
                                        Select
                                            </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu">
                                        <ul>
                                            <li className="ms-dropdown-list">
                                                <Link className="media p-2" to="#">
                                                    <div className="media-body">
                                                        <span>Mark as read</span>
                                                    </div>
                                                </Link>
                                                <Link className="media p-2" to="#">
                                                    <div className="media-body">
                                                        <span>Flag</span>
                                                    </div>
                                                </Link>
                                                <Link className="media p-2" to="#">
                                                    <div className="media-body">
                                                        <span>Delete</span>
                                                    </div>
                                                </Link>
                                                <Link className="media p-2" to="#">
                                                    <div className="media-body">
                                                        <span>Archive</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                        <ul className="ms-email-options">
                            <li><Link to="#" className="text-disabled"> <i className="material-icons">refresh</i> Refresh </Link></li>
                            <li><Link to="#" className="text-disabled"> <i className="material-icons">local_offer</i> Tags </Link></li>
                            <li><Link to="#" className="text-disabled"> <i className="material-icons">folder</i> Folders </Link></li>
                        </ul>
                    </div>
                    {/* Email Content */}
                    <div className="ms-email-content">
                        <Scrollbar className="ms-scrollable">
                            {this.state.emaillist.slice((this.state.page - 1) * this.state.pageLength, this.state.page * this.state.pageLength).map((item, i) => (
                                <li key={i} className={item.pinned ? 'media ms-email clearfix pinned' : 'media ms-email clearfix'}>
                                    <div className="ms-email-controls">
                                        <label className="ms-checkbox-wrap">
                                            <input type="checkbox" defaultValue />
                                            <i className="ms-checkbox-check" />
                                        </label>
                                        <i className="material-icons ms-pin-email" onClick={(e) => this.pinnedToggle(item)}>flag</i>
                                    </div>
                                    <div className="ms-email-img mr-3 ">
                                        <img src={process.env.PUBLIC_URL + "/" + item.img} className="ms-img-round" alt={item.name} />
                                    </div>
                                    <div className="media-body ms-email-details">
                                        <span className="ms-email-sender">{item.name}</span>
                                        <h6 className="ms-email-subject">{item.subject}</h6> 
                                        <span className="ms-email-time">
                                            {
                                                item.attachment === true ? <Link to="#"><i className="material-icons">attachment</i></Link> : ''
                                            }
                                            {item.time}</span>
                                        <p className="ms-email-msg">{item.text}</p>
                                    </div>
                                    <Dropdown className="dropdown">
                                        <Dropdown.Toggle as={NavLink} className="ms-hoverable-dropdown p-0 toggle-icon-none"><i className="material-icons">more_vert</i></Dropdown.Toggle>
                                        <Dropdown.Menu className="dropdown-menu-right">
                                            <ul>
                                                <li className="ms-dropdown-list">
                                                    <Link className="media p-2" to="#">
                                                        <div className="media-body">
                                                            <span>Mark as read</span>
                                                        </div>
                                                    </Link>
                                                    <Link className="media p-2 ms-pin-email" to="#">
                                                        <div className="media-body">
                                                            <span>Flag</span>
                                                        </div>
                                                    </Link>
                                                    <Link className="media p-2" to="#">
                                                        <div className="media-body">
                                                            <span>Archive</span>
                                                        </div>
                                                    </Link>
                                                    <Link className="media p-2" to="#">
                                                        <div className="media-body">
                                                            <span>Delete</span>
                                                        </div>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            ))}
                        </Scrollbar>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default List;
