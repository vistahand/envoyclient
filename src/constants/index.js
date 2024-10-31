import { TbCurrentLocation, TbHeadset } from "react-icons/tb";
import { LuPackage } from "react-icons/lu";

import { blog1, blog2, blog3, movecard1, movecard2, movecard3, test1, } from "../assets";


export const navLinks = [
    {
        id: "services",
        title: "Services",
        links: [
            {
                name: "Lorem Ipsum",
                route: "",
            },
            {
                name: "Lorem Ipsum",
                route: "",
            },
        ],
    },
    {
        id: "company",
        title: "Company",
        links: [
            {
                name: "About Us",
                route: "/about",
            },
            {
                name: "Careers",
                route: "/careers",
            },
            {
                name: "Terms of Usage",
                route: "/terms",
            },
            {
                name: "Privacy Policy",
                route: "/privacypolicy",
            },
        ],
    },
    {
        id: "resources",
        title: "Resources",
        links: [
            {
                name: "Lorem Ipsum",
                route: "",
            },
            {
                name: "Lorem Ipsum",
                route: "",
            },
        ],
    },
    {
        id: "support",
        title: "Support",
        links: [
            {
                name: "Lorem Ipsum",
                route: "",
            },
            {
                name: "Lorem Ipsum",
                route: "",
            },
        ],
    },
];

export const cards = [
    {
        image: TbCurrentLocation,
        title: "Real-time package tracking",
        description: "Get updates in real time for every drop-off point your shipment package arrives at, completely keeping you in the loop.",
    },
    {
        image: LuPackage,
        title: "Safe and secure packaging",
        description: "Be rest assured that your shipments are properly boxed and safely packaged to withstand whatever.",
    },
    {
        image: TbHeadset,
        title: "24/7 Customer support service",
        description: "Our dedicated customer care team is ready to attend to your complaints swiftly and effectively.",
    }
];

export const moveCards = [
    {
        image: movecard1,
        title: "Book a shipment",
        description: "Generate an instant quote for any package by creating an account and following the easy steps to get you started.",
    },
    {
        image: movecard2,
        title: "Track your package",
        description: "Go with your package everywhere! Log in to your account to follow your package at every drop-off easily and seamlessly.",
    },
    {
        image: movecard3,
        title: "It's time for delivery!",
        description: "Whether you're a customer or client waiting to receive your goods or a business sending out shipments, safe deliveries are assured.",
    }
]

export const testimonials = [
    {
        image: test1,
        title: "...booking process is incredibly easy...",
        description: "Envoy Angel has completely transformed the way we manage our international shipments. Their booking process is incredibly easy, and the real-time tracking gives us peace of mind knowing exactly where our packages are. We've had nothing but positive experiences shipping between Ireland and Nigeria, and their customer support is always available when we need it.",
        name: "Sarah Oluwafemi",
        profession: "Supply Chain Manager"
    },
    {
        image: movecard1,
        title: "...booking process is incredibly fast...",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        name: "Sukura Daniels",
        profession: "Supply Chain Manager"
    },
]

export const blogCards = [
    {
        image: blog1,
        title: "Navigating International Shipping: Top Tips for First-Time Shippers",
        description: "If you're new to shipping across borders, this guide is perfect for you. We cover everything from choosing the right shipping method to understanding customs regulations. Avoid common mistakes and ensure your first shipment goes smoothly, whether you're sending goods to Ireland, Nigeria, or anywhere else in the world.",
    },
    {
        image: blog2,
        title: "How Real-Time Tracking is Revolutionizing the Shipping Industry",
        description: "GPS-enabled tracking is changing the way businesses and individuals approach shipping. In this article, we explore how real-time tracking enhances transparency, improves customer satisfaction, and reduces lost or delayed shipments. See why staying informed about your shipment's journey is now a must for modern logistics.",
    },
    {
        image: blog3,
        title: "The Ultimate Guide to Shipping Between Ireland and Nigeria",
        description: "Whether you're sending personal items or commercial goods, this guide gives you the complete rundown on shipping between Ireland and Nigeria. Learn about customs regulations, required documentation, shipping routes, and tips for ensuring your package moves quickly and smoothly through the process. Perfect for both first-timers and seasoned shippers looking for a refresher.",
    }
]