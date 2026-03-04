import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from './List';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="ms-panel ms-email-panel">
                    <div className="ms-panel-body p-0">
                        <div className="ms-email-aside">
                            <Link to="#" className="btn btn-primary w-100 mt-0 has-icon"> <i className="flaticon-pencil" /> Compose Email </Link>
                            <ul className="ms-list ms-email-list">
                                <li className="ms-list-item ms-email-label"> Main </li>
                                <li className="ms-list-item ms-active-email"> <Link to="#"> <i className="material-icons ms-has-notification">mail</i> Inbox <span>32</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">flag</i> Flagged <span>12</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">chat</i> Spam <span>17</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">drafts</i> Drafts <span>22</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">send</i> Sent <span>51</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">delete</i> Trash <span>33</span> </Link> </li>
                            </ul>
                            <ul className="ms-list ms-email-list">
                                <li className="ms-list-item ms-email-label">Folders</li>
                                <li className="ms-list-item"> <Link to="#"><i className="material-icons">folder</i> Social Media <span>123</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"><i className="material-icons">folder</i> Promotions <span>175</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"><i className="material-icons">folder</i> Updates <span>12</span> </Link> </li>
                            </ul>
                            <ul className="ms-list ms-email-list bb-0">
                                <li className="ms-list-item ms-email-label">Others</li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">local_phone</i> Phone Calls <span>2</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">contacts</i> Contacts <span>233</span> </Link> </li>
                                <li className="ms-list-item"> <Link to="#"> <i className="material-icons">group</i> Groups <span>8</span> </Link> </li>
                            </ul>
                            <div className="ms-email-config">
                                <div className="progress progress-tiny">
                                    <div className="progress-bar bg-dark-green" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                                <p className="mb-0">54.27 GB (25%) of 150 GB used</p>
                                <Link to="#">Manage Storage</Link>
                            </div>
                        </div>
                        {/* Email Main */}
                        <List />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
