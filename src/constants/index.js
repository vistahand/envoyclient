import { TbCurrentLocation, TbHeadset } from "react-icons/tb";
import { LuPackage } from "react-icons/lu";

import { movecard1, movecard2, movecard3, } from "../assets";


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