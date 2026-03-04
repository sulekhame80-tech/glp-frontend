import React from "react";
import { Link } from 'react-router-dom';

export const columns = [
    { name: "Id", selector: "id", sortable: true },
    { name: "Product Name", cell: row => <div data-tag="allowRowEvents" style={{ width: '30px', whiteSpace: 'nowrap' }}><img src={process.env.PUBLIC_URL + '/' + row.img} style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }} alt="img" />{row.name}</div>, sortable: true },
    { name: "Return Issue", selector: "returnissue", sortable: true },
    { name: "Return Date", selector: "returndate", sortable: true },
    { name: "Dispatch Date", selector: "dispatchdate", sortable: true },
    { name: "Date", selector: "date", sortable: true },
    { name: "Action", cell: row => <div data-tag="allowRowEvents" ><Link to='#'><i className='far fa-trash-alt ms-text-danger' /></Link></div>, sortable: true },
];

export const data = [
    { id: 101, img: "assets/img/dashboard/product-1.jpg", name: "Low Rider", returnissue: "Defective Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 102, img: "assets/img/dashboard/product-2.jpg", name: "Hemp Oil", returnissue: "Late Delivery", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 103, img: "assets/img/dashboard/product-3.jpg", name: "Super Skunk", returnissue: "Damaged Item", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 105, img: "assets/img/dashboard/product-1.jpg", name: "Low Rider", returnissue: "Wrong Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 104, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", returnissue: "Defective Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 106, img: "assets/img/dashboard/product-3.jpg", name: "Hemp Oil", returnissue: "Wrong Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 107, img: "assets/img/dashboard/product-1.jpg", name: "UK Cheese", returnissue: "Late Delivery", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 108, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", returnissue: "Damaged Item", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 109, img: "assets/img/dashboard/product-3.jpg", name: "Low Rider", returnissue: "Defective Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 110, img: "assets/img/dashboard/product-1.jpg", name: "Hemp Oil", returnissue: "Wrong Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 111, img: "assets/img/dashboard/product-2.jpg", name: "Low Rider", returnissue: "Late Delivery", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 112, img: "assets/img/dashboard/product-3.jpg", name: "Hemp Oil", returnissue: "Defective Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
    { id: 113, img: "assets/img/dashboard/product-1.jpg", name: "Super Skunk", returnissue: "Damaged Item", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 114, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", returnissue: "Defective Product", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2017/10/05" },
    { id: 115, img: "assets/img/dashboard/product-3.jpg", name: "Low Rider", returnissue: "Late Delivery", returndate: "2011/04/25", dispatchdate: "2011/04/25", date: "2022/05/03" },
];
export default data;
