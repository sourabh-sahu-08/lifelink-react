import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseClasses = "animate-pulse bg-gray-200";
    const variantClasses = {
        rect: "rounded-xl",
        circle: "rounded-full",
        text: "rounded-md h-4 w-full"
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}></div>
    );
};

export default Skeleton;
