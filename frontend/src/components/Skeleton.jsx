import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseClasses = "shimmer";
    const variantClasses = {
        rect: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full"
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}></div>
    );
};

export default Skeleton;
