import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import $ from 'jquery';
import Ratingbars from './Ratingbars';
import Blocks from './Blocks';
import Latestreviews from './Latestreviews';

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
                    <Breadcrumb pageprev={'Customer'} pagecurrent={'Reviews'} />
                    <Ratingbars/>
                    <Blocks/>
                    <Latestreviews/>
                </div>
            </div>
        );
    }
}

export default Content;