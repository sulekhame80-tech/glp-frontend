import React, { Component, Fragment } from 'react';

const cardblock = [
    { img: 'assets/img/dashboard/product-1-530x240.jpg', title: 'This is a card Title', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc velit, dictum eget nulla a, sollicitudin rhoncus orci. Vivamus nec commodo turpis.' },
    { img: 'assets/img/dashboard/product-2-530x240.jpg', title: 'This is a card Title', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc velit, dictum eget nulla a, sollicitudin rhoncus orci. Vivamus nec commodo turpis.' },
    { img: 'assets/img/dashboard/product-3-530x240.jpg', title: 'This is a card Title', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc velit, dictum eget nulla a, sollicitudin rhoncus orci. Vivamus nec commodo turpis.' },
    { img: 'assets/img/dashboard/product-1-530x240.jpg', title: 'This is a card Title', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nunc velit, dictum eget nulla a, sollicitudin rhoncus orci. Vivamus nec commodo turpis.' },
]

class Basicimage extends Component {
    render() {
        return (
            <Fragment>
                <div className="col-md-12">
                    <h2 className="section-title">Basic Image Card</h2>
                </div>
                {cardblock.map((item, i) => (
                    <div key={i} className="col-lg-3 col-md-6 col-sm-6">
                        <div className="ms-card">
                            <div className="ms-card-img">
                                <img src={process.env.PUBLIC_URL + "/" + item.img} alt={item.title} />
                            </div>
                            <div className="ms-card-body">
                                <h6>{item.title}</h6>
                                <p>{item.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Fragment>
        );
    }
}

export default Basicimage;