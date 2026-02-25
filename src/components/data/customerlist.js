import React from "react";
import { Link } from 'react-router-dom';

export const columns = [
    { name: "Id", selector: "id", sortable: true },
    { name: "Customer Name", cell: row => <div data-tag="allowRowEvents" style={{ width: '30px', whiteSpace: 'nowrap' }}><img src={process.env.PUBLIC_URL + '/' + row.img} style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }} alt="img" />{row.name}</div>, sortable: true },
    { name: "Email Id", selector: "email", sortable: true },
    { name: "No. Of Purchase", selector: "noofpurchase", sortable: true },
    { name: "Member Since", selector: "membertime", sortable: true },
    { name: "Action", cell: row => <div data-tag="allowRowEvents" ><Link to='#'><i className='fas fa-paper-plane ms-text-primary' /></Link> <Link to='#'><i className='far fa-trash-alt ms-text-danger' /></Link></div>, sortable: true },
];

export const data = [
    { id: 101, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Tiger Nixon", email: "tiger@123gmail.com", noofpurchase: "421", membertime: "2011/04/25" },
    { id: 102, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Garrett Winters", email: "Garrett@123gmail.com", noofpurchase: "8722", membertime: "2011/07/25" },
    { id: 103, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Harry", email: "Harry@123gmail.com", noofpurchase: "8422", membertime: "2011/02/2" },
    { id: 104, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Jhon", email: "Jhon@123gmail.com", noofpurchase: "8512", membertime: "2011/11/03" },
    { id: 105, img: "assets/img/dashboard/rakhan-potik-5.jpg", name: "Henrry", email: "Henrry@123gmail.com", noofpurchase: "8322", membertime: "2012/07/25" },
    { id: 106, img: "assets/img/dashboard/rakhan-potik-7.jpg", name: "Moris", email: "Moris@123gmail.com", noofpurchase: "9565", membertime: "2014/02/25" },
    { id: 107, img: "assets/img/dashboard/rakhan-potik-8.jpg", name: "Jenny", email: "jenny@123gmail.com", noofpurchase: "9565", membertime: "2014/02/25" },
    { id: 108, img: "assets/img/dashboard/rakhan-potik-9.jpg", name: "Bella", email: "bella@123gmail.com", noofpurchase: "5625", membertime: "2016/08/15" },
    { id: 109, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Haris", email: "Haris@123gmail.com", noofpurchase: "3525", membertime: "2017/10/05" },
    { id: 110, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Anny", email: "anny@123gmail.com", noofpurchase: "2321", membertime: "2022/05/03" },
    { id: 111, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Tiger Nixon", email: "tiger@123gmail.com", noofpurchase: "5421", membertime: "2011/04/25" },
    { id: 112, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Garrett Winters", email: "Garrett@123gmail.com", noofpurchase: "8722", membertime: "2011/07/25" },
    { id: 113, img: "assets/img/dashboard/rakhan-potik-5.jpg", name: "Harry", email: "Harry@123gmail.com", noofpurchase: "8422", membertime: "2011/02/2" },
    { id: 114, img: "assets/img/dashboard/rakhan-potik-7.jpg", name: "Jhon", email: "Jhon@123gmail.com", noofpurchase: "8512", membertime: "2011/11/03" },
    { id: 115, img: "assets/img/dashboard/rakhan-potik-8.jpg", name: "Henrry", email: "Henrry@123gmail.com", noofpurchase: "8322", membertime: "2012/07/25" },
    { id: 116, img: "assets/img/dashboard/rakhan-potik-9.jpg", name: "Moris", email: "Moris@123gmail.com", noofpurchase: "9565", membertime: "2014/02/25" },
    { id: 117, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Jenny", email: "jenny@123gmail.com", noofpurchase: "9565", membertime: "2014/02/25" },
    { id: 118, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Bella", email: "bella@123gmail.com", noofpurchase: "5625", membertime: "2016/08/15" },
    { id: 119, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Haris", email: "Haris@123gmail.com", noofpurchase: "3525", membertime: "2017/10/05" },
    { id: 120, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Anny", email: "anny@123gmail.com", noofpurchase: "2321", membertime: "2022/05/03" },
    { id: 121, img: "assets/img/dashboard/rakhan-potik-5.jpg", name: "Tiger Nixon", email: "tiger@123gmail.com", noofpurchase: "5421", membertime: "2011/04/25" },
    { id: 122, img: "assets/img/dashboard/rakhan-potik-7.jpg", name: "Garrett Winters", email: "Garrett@123gmail.com", noofpurchase: "8722", membertime: "2011/07/25" },
    { id: 123, img: "assets/img/dashboard/rakhan-potik-8.jpg", name: "Harry", email: "Harry@123gmail.com", noofpurchase: "8422", membertime: "2011/02/2" },
    { id: 124, img: "assets/img/dashboard/rakhan-potik-9.jpg", name: "Jhon", email: "Jhon@123gmail.com", noofpurchase: "8512", membertime: "2011/11/03" },
    { id: 125, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Henrry", email: "Henrry@123gmail.com", noofpurchase: "8322", membertime: "2012/07/25" }
];
export default data;