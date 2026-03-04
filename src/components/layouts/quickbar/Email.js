import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import email from '../../data/email.json';

class Email extends Component {
    render() {
        return (
            <div className="ms-email-container">
                <div className="ms-qa-options">
                    <Link to="#" className="btn btn-primary w-100 mt-0 has-icon"> <i className="flaticon-pencil" /> Compose Email </Link>
                </div>
                <Scrollbar className="ms-scrollable ms-quickbar-container">
                    {email.map((item, i) => (
                        <li key={i} className="p-3  media ms-email clearfix">
                            <div className="ms-email-img mr-3 ">
                                <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                            </div>
                            <div className="media-body ms-email-details">
                                <span className="ms-email-sender">{item.name}</span>
                                <h6 className="ms-email-subject">{item.mailtitle}</h6> <span className="ms-email-time">{item.mailtime}</span>
                                <p className="ms-email-msg">{item.mailcomment}</p>
                            </div>
                        </li>
                    ))}
                </Scrollbar>
            </div>
        );
    }
}

export default Email;
