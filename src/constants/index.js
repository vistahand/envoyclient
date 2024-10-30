import { TbCurrentLocation, TbHeadset } from "react-icons/tb";
import { LuPackage } from "react-icons/lu";


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