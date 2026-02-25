import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Brandicon from './Brandicon';
import Directional from './Directional';
import Filetype from './Filetype';
import Formcontrol from './Formcontrol';
import General from './General';
import Medical from './Medical';
import Texteditor from './Texteditor';
import Videoplayer from './Videoplayer';
import Webapp from './Webapp';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Icons'} pagecurrent={'Fontawesome'} />
                    <General/>
                    <Webapp/>
                    <Filetype/>
                    <Formcontrol/>
                    <Texteditor/>
                    <Directional/>
                    <Videoplayer/>
                    <Brandicon/>
                    <Medical/>
                </div>
            </div>
        );
    }
}

export default Content;