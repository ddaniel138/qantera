import React from 'react';

export default function LeaderboardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M7.5 21H2V9h5.5v12zm6.5 0H8.5V3H14v18zm6.5 0h-5.5v-8h5.5v8z" fill="currentColor"/>
        </svg>
    );
}