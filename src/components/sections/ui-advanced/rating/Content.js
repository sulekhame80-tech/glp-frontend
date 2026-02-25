import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Heart from './Heart';
import Letter from './Letter';
import Misc from './Misc';
import Number from './Number';
import Star from './Star';
import $ from 'jquery';

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
                    <Breadcrumb pageprev={'Advanced UI Elements'} pagecurrent={'Rating'} />
                    <div className="col-md-12">
                        <Star />
                        <Letter />
                        <Number />
                        <Heart />
                        <Misc />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;