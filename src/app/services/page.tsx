import React from 'react'
import Link from 'next/link'

const services = [
    { id: 1, name: 'pentesting', desc: 'desc of pentesting' },
    { id: 2, name: 'Forensic', desc: 'desc of forensic' },
    { id: 3, name: 'hacking', desc: 'desc of hacking' }
]

const ServicesPage = () => {
    return (
        <div className="max-w-xl mx-auto mt-8">
            {/* Tailwind test box */}
            <div className="bg-red-500 text-white p-4 mb-4">If you see this red box, Tailwind is working!</div>
            <h2 className="mb-8 text-2xl font-bold">Services</h2>
            {services.map((item) => (
                <Link
                    key={item.name}
                    href={`/services/${item.name.toLowerCase()}`}
                    className="no-underline"
                >
                    <div
                        className="bg-white rounded-xl p-6 my-4 cursor-pointer shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
                    >
                        <h3 className="m-0 text-lg font-semibold text-black">{item.name}</h3>
                        <div className="text-gray-600">{item.desc}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ServicesPage