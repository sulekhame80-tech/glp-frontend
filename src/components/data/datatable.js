import React from "react";

export const columns = [
    { name: "Id", selector: "id", sortable: true },
    { name: "User Name", cell: row => <div data-tag="allowRowEvents" style={{ width: '30px', whiteSpace: 'nowrap' }}><img src={process.env.PUBLIC_URL + '/' + row.img} style={{ width: '30px', borderRadius: '50%', marginRight: '5px' }} alt="img" />{row.name}</div>, sortable: true },
    { name: "Email Id", selector: "email", sortable: true },
    { name: "Order Id", selector: "orderid", sortable: true },
    { name: "Product Name", selector: "productname", sortable: true },
    { name: "Price", selector: "price", sortable: true },
    { name: "Date", selector: "date", sortable: true },
];

export const data = [
    { id: 101, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Anny", email: "anny@123gmail.com", orderid: 2321, productname: "Low Rider", price: 620.50, date: "2022/05/03" },
    { id: 102, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Hennry", email: "Hennry@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 450.50, date: "2022/05/03" },
    { id: 103, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Haris", email: "Haris@123gmail.com", orderid: 3525, productname: "Super Skunk", price: 850.50, date: "2017/10/05" },
    { id: 104, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Jhon", email: "Jhon@123gmail.com", orderid: 3525, productname: "Ingrid", price: 650.50, date: "2017/10/05" },
    { id: 105, img: "assets/img/dashboard/rakhan-potik-5.jpg", name: "Jack", email: "Jack@123gmail.com", orderid: 2321, productname: "Low Rider", price: 320.50, date: "2022/05/03" },
    { id: 106, img: "assets/img/dashboard/rakhan-potik-7.jpg", name: "Bella", email: "Bella@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 520.50, date: "2022/05/03" },
    { id: 107, img: "assets/img/dashboard/rakhan-potik-8.jpg", name: "Alice", email: "Alice@123gmail.com", orderid: 3525, productname: "UK Cheese", price: 550.50, date: "2017/10/05" },
    { id: 108, img: "assets/img/dashboard/rakhan-potik-9.jpg", name: "Harry", email: "Harry@123gmail.com", orderid: 3525, productname: "Ingrid", price: 450.50, date: "2017/10/05" },
    { id: 109, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Moris", email: "Moris@123gmail.com", orderid: 2321, productname: "Low Rider", price: 220.50, date: "2022/05/03" },
    { id: 110, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Peter", email: "Peter@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 720.50, date: "2022/05/03" },
    { id: 111, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Anny", email: "anny@123gmail.com", orderid: 2321, productname: "Low Rider", price: 620.50, date: "2022/05/03" },
    { id: 112, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Hennry", email: "Hennry@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 450.50, date: "2022/05/03" },
    { id: 113, img: "assets/img/dashboard/rakhan-potik-5.jpg", name: "Haris", email: "Haris@123gmail.com", orderid: 3525, productname: "Super Skunk", price: 850.50, date: "2017/10/05" },
    { id: 114, img: "assets/img/dashboard/rakhan-potik-7.jpg", name: "Jhon", email: "Jhon@123gmail.com", orderid: 3525, productname: "Ingrid", price: 650.50, date: "2017/10/05" },
    { id: 115, img: "assets/img/dashboard/rakhan-potik-8.jpg", name: "Jack", email: "Jack@123gmail.com", orderid: 2321, productname: "Low Rider", price: 320.50, date: "2022/05/03" },
    { id: 116, img: "assets/img/dashboard/rakhan-potik-9.jpg", name: "Bella", email: "Bella@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 520.50, date: "2022/05/03" },
    { id: 117, img: "assets/img/dashboard/rakhan-potik-1.jpg", name: "Alice", email: "Alice@123gmail.com", orderid: 3525, productname: "UK Cheese", price: 550.50, date: "2017/10/05" },
    { id: 118, img: "assets/img/dashboard/rakhan-potik-2.jpg", name: "Harry", email: "Harry@123gmail.com", orderid: 3525, productname: "Ingrid", price: 450.50, date: "2017/10/05" },
    { id: 119, img: "assets/img/dashboard/rakhan-potik-3.jpg", name: "Moris", email: "Moris@123gmail.com", orderid: 2321, productname: "Low Rider", price: 220.50, date: "2022/05/03" },
    { id: 120, img: "assets/img/dashboard/rakhan-potik-4.jpg", name: "Peter", email: "Peter@123gmail.com", orderid: 2321, productname: "Hemp Oil", price: 720.50, date: "2022/05/03" },
];
export default data;
