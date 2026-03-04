import React, { Component, Fragment } from 'react';
import { VectorMap } from 'react-jvectormap';

const bycountry = [
    { name: "United States", totaluser: 14805, value: 80 },
    { name: "Brazil", totaluser: 11651, value: 70 },
    { name: "Russia", totaluser: 9157, value: 60 },
    { name: "India", totaluser: 7846, value: 45 },
    { name: "Australia", totaluser: 6789, value: 30 },
];

const mapData = {
    US: 100000,
    RU: 9900,
    AU: 86,
    IN: 70,
    BR: 70,
};

class Averagenycountry extends Component {
    render() {
        return ( 
            <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header header-mini">
                        <h6>Average Users By Country</h6>
                        <p>The top locations where users of your product are located</p>
                    </div>
                    <div className="ms-panel-body ms-average-users-country">
                        <div className="row">
                            <div className="col-xl-4 col-md-12">
                                {bycountry.map((item, i) => (
                                    <Fragment key={i}>
                                        <span className="progress-label">{item.name}</span>
                                        <span className="progress-status">{new Intl.NumberFormat().format((item.totaluser))}</span>
                                        <div className="progress progress-tiny">
                                            <div className="progress-bar bg-dark-green" role="progressbar" style={{ width: item.value + '%' }} />
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                            <div className="offset-xl-1 col-xl-7 col-md-12">
                            <VectorMap map={'world_mill'}
                                    backgroundColor="#ffffff"
                                    ref="map "
                                    containerStyle={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    regionsSelectable={true}
                                    series={{
                                        regions: [ 
                                            {
                                                values: mapData, //this is your data
                                                scale: ["#357ffa", "#f0ad4e","#445cc8"], //your color game's here
                                                normalizeFunction: "polynomial"
                                            }
                                        ]
                                    }}
                                    regionStyle={
                                        {
                                            initial: {
                                                fill: 'rgb(199,206,234)',
                                                "fill-opacity": 1,
                                                stroke: 'none',
                                                "stroke-width": 0,
                                                "stroke-opacity": 1
                                            },
                                            hover: {
                                                fill: 'rgb(50,92,204)',
                                                "fill-opacity": 1,
                                                cursor: 'pointer'
                                            },
                                        }
                                    }
                                    containerClassName="vector-map"
                                />
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default Averagenycountry;
