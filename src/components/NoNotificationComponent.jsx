import React from 'react';

import BellIcon from '../assets/images/icons/no-notification-icon.svg'

export default function NoNotificationComponent() {
    return (
        <div className='no-notification-wrapper'>
            <div className="img-wrapper">
                <img src={BellIcon} alt="BellIcon" />
            </div>
            <div className="text-wrapper">
                <strong className='dark medium-bold'>No notifications yet</strong>
                <p>Notifications about your account <br /> activity will appear here.</p>
            </div>
        </div>
    )
}