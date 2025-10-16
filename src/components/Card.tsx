import React from 'react'

interface PropsType {
    image: string,
    title: string, 
    description: string, 
    buttonText: string,
}

export default function Card({ image, title, description, buttonText }: PropsType) {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden 
                       w-[343px] h-[380px] 
                       md:w-[224px] md:h-[440px] 
                       lg:w-[395px] lg:h-auto"
        >
            <div className="h-[192px] bg-gray-200">
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                )}
            </div>

            <div className="p-6">
                <h3 className="text-[20px] md:text-[18px] font-bold mb-2">{title}</h3>
                <p className="text-gray-600 mb-4 text-[16px] md:text-[14px] pe-[20px]">{description}</p>
                <button className="bg-blue-600 text-white px-4 py-[8px] rounded hover:bg-blue-700 transition cursor-pointer">
                    {buttonText}
                </button>
            </div>
        </div>
    )
}
