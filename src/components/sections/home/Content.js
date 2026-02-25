import React, { Component } from 'react';
import Blocks from './Blocks';
import Currentsales from './Currentsales';
import Ordersgraph from './Ordersgraph';
import Topsellers from './Topsellers';
import $ from 'jquery';
import Productratings from './Productratings';
import Socialmedia from './Socialmedia';
import Orderhistory from './Orderhistory';
import Totalrevenue from './Totalrevenue';
import Averagenycountry from './Averagenycountry';

class Content extends Component {
    componentDidMount() {
        function starRating() {
            $('.ms-star-rating').on('click', '.ms-rating-item', function () {
                $(this).prevAll().removeClass('rated');
                $(this).addClass('rated');
                $(this).nextAll().addClass('rated');
            });
        }
        starRating()
    }
    render() { 
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Blocks />
                    <Ordersgraph />
                    <Currentsales />
                    <Topsellers />
                    <Productratings />
                    <Socialmedia />
                    <Orderhistory />
                    <Totalrevenue />
                    <div className="col-xl-8 col-md-12">
                        <Averagenycountry />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;