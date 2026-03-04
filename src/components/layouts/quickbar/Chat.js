import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import chats from '../../data/chats.json';
import groups from '../../data/groups.json';
import contacts from '../../data/contact.json';
import { Dropdown, NavLink, Tab, Nav } from 'react-bootstrap';

class Chat extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            chats: chats
        }
    }
    triggerDelete(chatIndex) {
        if (window.confirm("Are you sure you want to delete this chat?")) {
            let chats = this.state.chats;
            chats.splice(chatIndex, 1);
            this.setState({ chats: chats });
        }
    }
    render() {
        return (
            <div className="ms-chat-container">
                <div className="ms-chat-header px-3">
                    <div className="ms-chat-user-container media clearfix">
                        <div className="ms-chat-status ms-status-online ms-chat-img mr-3 align-self-center">
                            <img src={process.env.PUBLIC_URL + "/assets/img/dashboard/rakhan-potik-1.jpg"} className="ms-img-round" alt="people" />
                        </div>
                        <div className="media-body ms-chat-user-info mt-1">
                            <h6>Anny Farisha</h6>
                            <Dropdown>
                                <Dropdown.Toggle as={NavLink} className="text-disabled has-chevron fs-12 d-inline-block p-0">
                                    Available
                            </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <li className="ms-dropdown-list">
                                        <Link className="media p-2" to="#">
                                            <div className="media-body">
                                                <span>Busy</span>
                                            </div>
                                        </Link>
                                        <Link className="media p-2" to="#">
                                            <div className="media-body">
                                                <span>Away</span>
                                            </div>
                                        </Link>
                                        <Link className="media p-2" to="#">
                                            <div className="media-body">
                                                <span>Offline</span>
                                            </div>
                                        </Link>
                                    </li>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <form className="ms-form my-3" method="post">
                        <div className="ms-form-group my-0 mb-0 has-icon fs-14">
                            <input type="search" className="ms-form-input w-100" name="search" placeholder="Search for People and Groups" />
                            <i className="flaticon-search text-disabled" />
                        </div>
                    </form>
                </div>
                <div className="ms-chat-body">
                    <Tab.Container defaultActiveKey="chats">
                        <Nav variant="tab" className="nav nav-tabs tabs-bordered d-flex nav-justified px-3">
                            <Nav.Item className="fs-12">
                                <Nav.Link eventKey="chats">Chats</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="fs-12">
                                <Nav.Link eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="fs-12">
                                <Nav.Link eventKey="contacts">Contacts</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="chats">
                                <Scrollbar className="ms-scrollable ms-quickbar-container">
                                    {chats.length > 0 ? chats.slice(0, 5).map((item, index) => (
                                        <li key={index} className="ms-chat-user-container ms-open-chat ms-deletable p-3 media clearfix">
                                            {
                                                item.newmsg === true ?
                                                    <div className="ms-chat-status ms-status-away ms-has-new-msg ms-chat-img mr-3 align-self-center">
                                                        {
                                                            item.msgcount > 0 || item.msgcount !== '' ? <span className="msg-count">{item.msgcount}</span> : ''
                                                        }
                                                        <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                                    </div>
                                                    : ''
                                            }
                                            {
                                                item.online === true ?
                                                    <div className="ms-chat-status ms-status-online ms-chat-img mr-3 align-self-center">
                                                        {
                                                            item.msgcount > 0 || item.msgcount !== '' ? <span className="msg-count">{item.msgcount}</span> : ''
                                                        }
                                                        <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                                    </div>
                                                    : ''
                                            }
                                            {
                                                item.offline === true ?
                                                    <div className="ms-chat-status ms-status-offline ms-chat-img mr-3 align-self-center">
                                                        {
                                                            item.msgcount > 0 || item.msgcount !== '' ? <span className="msg-count">{item.msgcount}</span> : ''
                                                        }
                                                        <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                                    </div>
                                                    : ''
                                            }
                                            {
                                                item.busy === true ?
                                                    <div className="ms-chat-status ms-status-busy ms-chat-img mr-3 align-self-center">
                                                        {
                                                            item.msgcount > 0 || item.msgcount !== '' ? <span className="msg-count">{item.msgcount}</span> : ''
                                                        }
                                                        <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                                    </div>
                                                    : ''
                                            }
                                            <div className="media-body ms-chat-user-info mt-1">
                                                <h6>{item.name}</h6> <span className="ms-chat-time">{item.time}</span>
                                                <p>{item.text}</p>
                                                <i className="flaticon-trash ms-delete-trigger" onClick={(e) => { e.stopPropagation(); e.preventDefault(); this.triggerDelete(index); }}> </i>
                                            </div>
                                        </li>
                                    )) : <li className="ms-chat-user-container ms-open-chat p-3 media clearfix justify-content-center">No chats available</li>}
                                </Scrollbar>
                            </Tab.Pane>
                            <Tab.Pane eventKey="groups">
                                <Scrollbar className="ms-scrollable ms-quickbar-container">
                                    {groups.slice(0, 3).map((item, i) => (
                                        <li key={i} className="ms-chat-user-container ms-open-chat p-3 media clearfix">
                                            <div className="ms-chat-img mr-3 align-self-center">
                                                <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                            </div>
                                            <div className="media-body ms-chat-user-info mt-1">
                                                <h6>{item.name}</h6> 
                                                <Link to="#" className="ms-chat-time"> <i className="flaticon-chat" /> </Link>
                                                <p>{item.text}</p>
                                                <ul className="ms-group-members clearfix mt-3 mb-0">
                                                    {item.moreuser.map((user, i) => (
                                                        <li key={i}> <img src={process.env.PUBLIC_URL + '/' + user.img} alt={item.name} /> </li>
                                                    ))}
                                                    {
                                                        item.totaluser > 0 || item.totaluser !== '' ? <li className="ms-group-count"> {item.totaluser} </li> : ''
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </Scrollbar>
                            </Tab.Pane>
                            <Tab.Pane eventKey="contacts">
                                <Scrollbar className="ms-scrollable ms-quickbar-container">
                                    {contacts.map((item, i) => (
                                        <li key={i} className="ms-chat-user-container ms-open-chat p-3 media clearfix">
                                            <div className="ms-chat-img mr-3 align-self-center">
                                                <img src={process.env.PUBLIC_URL + '/' + item.img} className="ms-img-round" alt={item.name} />
                                            </div>
                                            <div className="media-body ms-chat-user-info mt-1">
                                                <h6>{item.name}</h6> 
                                                <Link to="#" className="ms-chat-time"> <i className="flaticon-chat" /> </Link>
                                                <p>{item.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </Scrollbar>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        );
    }
}

export default Chat;
