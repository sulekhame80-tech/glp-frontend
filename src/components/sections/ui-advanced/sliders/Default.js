import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

const slide = [
    { img: 'assets/img/dashboard/slider-1.jpg' },
    { img: 'assets/img/dashboard/slider-2.jpg' },
    { img: 'assets/img/dashboard/slider-3.jpg' },
];

class Default extends Component {
    render() {
        return (
            <div className="ms-panel">
                <div className="ms-panel-header">
                    <h6>Default Slider</h6>
                </div>
                <div className="ms-panel-body">
                    <p className="ms-directions">Use <code>interval={'{'}false{'}'}</code> in <code>.carousel</code> to disable autoplay</p>
                    <Carousel indicators={false} controls={false}>
                        {slide.map((item, i) => (
                            <Carousel.Item key={i}>
                                <img className="d-block w-100" src={process.env.PUBLIC_URL + "/" + item.img} alt="slide" />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default Default;
