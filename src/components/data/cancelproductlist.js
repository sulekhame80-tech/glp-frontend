import React from "react";
import { Link } from 'react-router-dom';

export const columns = [
    { name: "Id", selector: "id", sortable: true },
    { name: "Customer Name", cell: row => <div data-tag="allowRowEvents" style={{ width: '30px', whiteSpace: 'nowrap' }}><img src={process.env.PUBLIC_URL + '/' + row.img} style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }} alt="img" />{row.name}</div>, sortable: true },
    { name: "Product Name", selector: "productname", sortable: true },
    { name: "Cancel Date", selector: "date", sortable: true },
    { name: "Action", cell: row => <div data-tag="allowRowEvents" ><Link to='#'><i className='far fa-trash-alt ms-text-danger' /></Link></div>, sortable: true },
];

export const data = [
    { id: 101, img: "assets/img/dashboard/rakhan-potik-1.jpg",name:"Tiger Nixon", productname: "Low Rider", date: "2022/05/03"},
    { id: 102, img: "assets/img/dashboard/rakhan-potik-2.jpg",name:"Garrett Winters", productname: "Hemp Oil", date: "2022/05/03"},
    { id: 103, img: "assets/img/dashboard/rakhan-potik-3.jpg",name:"Harry", productname: "Super Skunk", date: "2017/10/05"},
    { id: 105, img: "assets/img/dashboard/rakhan-potik-4.jpg",name:"Jhon", productname: "Low Rider", date: "2022/05/03"},
    { id: 104, img: "assets/img/dashboard/rakhan-potik-5.jpg",name:"Henrry", productname: "Ingrid", date: "2017/10/05"},
    { id: 106, img: "assets/img/dashboard/rakhan-potik-7.jpg",name:"Moris", productname: "Hemp Oil", date: "2022/05/03"},
    { id: 107, img: "assets/img/dashboard/rakhan-potik-8.jpg",name:"Jenny", productname: "UK Cheese", date: "2017/10/05"},
    { id: 108, img: "assets/img/dashboard/rakhan-potik-1.jpg",name:"Bella", productname: "Ingrid", date: "2017/10/05"},
    { id: 109, img: "assets/img/dashboard/rakhan-potik-2.jpg",name:"Haris", productname: "Low Rider", date: "2022/05/03"},
    { id: 110, img: "assets/img/dashboard/rakhan-potik-3.jpg",name:"Anny", productname: "Hemp Oil", date: "2022/05/03"},
    { id: 111, img: "assets/img/dashboard/rakhan-potik-4.jpg",name:"Tiger Nixon", productname: "Low Rider", date: "2022/05/03"},
    { id: 112, img: "assets/img/dashboard/rakhan-potik-5.jpg",name:"Garrett Winters", productname: "Hemp Oil", date: "2022/05/03"},
    { id: 113, img: "assets/img/dashboard/rakhan-potik-7.jpg",name:"Harry", productname: "Super Skunk", date: "2017/10/05"},
    { id: 114, img: "assets/img/dashboard/rakhan-potik-8.jpg",name:"Jhon", productname: "Ingrid", date: "2017/10/05"},
    { id: 115, img: "assets/img/dashboard/rakhan-potik-9.jpg",name:"Henrry", productname: "Low Rider", date: "2022/05/03"},
];
export default data;