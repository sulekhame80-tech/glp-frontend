import React from "react";
import { Link } from 'react-router-dom';

export const columns = [
    { name: "Id", selector: "id", sortable: true },
    { name: "Product Name", cell: row => <div data-tag="allowRowEvents" style={{ width: '30px', whiteSpace: 'nowrap' }}><img src={process.env.PUBLIC_URL + '/' + row.img} style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }} alt="img" />{row.name}</div>, sortable: true },
    { name: "Product Price", cell: row => <span data-tag="allowRowEvents">${row.price}</span>, sortable: true },
    { name: "Date", selector: "date", sortable: true },
    { name: "No. Of Purchase", selector: "noofpurchase", sortable: true },
    { name: "Action", cell: row => <div data-tag="allowRowEvents" ><Link to='#'><i className='fas fa-pencil-alt ms-text-primary' /></Link> <Link to='#'><i className='far fa-trash-alt ms-text-danger' /></Link></div>, sortable: true },
];

export const data = [
    { id: 101, img: "assets/img/dashboard/product-1.jpg", name: "Low Rider", price: 620.50, date: "2022/05/03", noofpurchase: 2 },
    { id: 102, img: "assets/img/dashboard/product-2.jpg", name: "Hemp Oil", price: 450.50, date: "2022/05/03", noofpurchase: 3 },
    { id: 103, img: "assets/img/dashboard/product-3.jpg", name: "Super Skunk", price: 850.50, date: "2017/10/05", noofpurchase: 4 },
    { id: 105, img: "assets/img/dashboard/product-1.jpg", name: "Low Rider", price: 320.50, date: "2022/05/03", noofpurchase: 1 },
    { id: 104, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", price: 650.50, date: "2017/10/05", noofpurchase: 2 },
    { id: 106, img: "assets/img/dashboard/product-3.jpg", name: "Hemp Oil", price: 520.50, date: "2022/05/03", noofpurchase: 3 },
    { id: 107, img: "assets/img/dashboard/product-1.jpg", name: "UK Cheese", price: 550.50, date: "2017/10/05", noofpurchase: 1 },
    { id: 108, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", price: 450.50, date: "2017/10/05", noofpurchase: 5 },
    { id: 109, img: "assets/img/dashboard/product-3.jpg", name: "Low Rider", price: 220.50, date: "2022/05/03", noofpurchase: 4 },
    { id: 110, img: "assets/img/dashboard/product-1.jpg", name: "Hemp Oil", price: 720.50, date: "2022/05/03", noofpurchase: 3 },
    { id: 111, img: "assets/img/dashboard/product-2.jpg", name: "Low Rider", price: 620.50, date: "2022/05/03", noofpurchase: 1 },
    { id: 112, img: "assets/img/dashboard/product-3.jpg", name: "Hemp Oil", price: 450.50, date: "2022/05/03", noofpurchase: 6 },
    { id: 113, img: "assets/img/dashboard/product-1.jpg", name: "Super Skunk", price: 850.50, date: "2017/10/05", noofpurchase: 2 },
    { id: 114, img: "assets/img/dashboard/product-2.jpg", name: "Ingrid", price: 650.50, date: "2017/10/05", noofpurchase: 4 },
    { id: 115, img: "assets/img/dashboard/product-3.jpg", name: "Low Rider", price: 320.50, date: "2022/05/03", noofpurchase: 2 },
    { id: 116, img: "assets/img/dashboard/product-1.jpg", name: "Hemp Oil", price: 520.50, date: "2022/05/03", noofpurchase: 3 },
    { id: 117, img: "assets/img/dashboard/product-2.jpg", name: "UK Cheese", price: 550.50, date: "2017/10/05", noofpurchase: 1 },
    { id: 118, img: "assets/img/dashboard/product-3.jpg", name: "Ingrid", price: 450.50, date: "2017/10/05", noofpurchase: 2 },
    { id: 119, img: "assets/img/dashboard/product-1.jpg", name: "Low Rider", price: 220.50, date: "2022/05/03", noofpurchase: 4 },
    { id: 120, img: "assets/img/dashboard/product-2.jpg", name: "Hemp Oil", price: 720.50, date: "2022/05/03", noofpurchase: 3 },


];
export default data;
