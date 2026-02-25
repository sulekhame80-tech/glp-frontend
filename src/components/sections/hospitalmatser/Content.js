import React, { Component } from 'react';
import Breadcrumb from '../../layouts/Breadcrumb';
import AddHospital from './AddHospital';
import Latestproducts from './Latestproducts';
import { UserContext } from "../../../UserContext";   // ⭐ NEW

class Content extends Component {

    static contextType = UserContext;   // ⭐ NEW

    render() {

        const { role, location } = this.context;  // ⭐ NEW
        console.log("⭐ Content (Hospital Master) → Role:", role);
        console.log("⭐ Content (Hospital Master) → Location:", location);

        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Manage Hospitals'} pagecurrent={'Add Hosptitals'} />

                    <Latestproducts />

                    {/* ⭐ NEW: Hide AddHospital if role = Employee */}
                    {role !== "Employee" && (
                        <AddHospital />
                    )}

                </div>
            </div>
        );
    }
}

export default Content;
