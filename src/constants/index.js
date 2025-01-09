import { TbCurrentLocation, TbHeadset } from "react-icons/tb";
import { LuPackage } from "react-icons/lu";

import { RiTwitterXLine } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";
import { BiLogoLinkedin } from "react-icons/bi";

import { blog1, blog2, blog3, cash, fileinvoice, invoice, mapsearch, 
    message, movecard1, movecard2, movecard3, packagex, savedloc, shome, test1, 
} from "../assets";

import { ReactComponent as book } from '../assets/book.svg';
import { ReactComponent as box } from '../assets/box.svg';


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
];

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
        description: "Envoy Angel has completely transformed the way we manage our international shipments. Their booking process is incredibly easy, and the real-time tracking gives us peace of mind knowing exactly where our packages are. We've had nothing but positive experiences shipping between Ireland and Nigeria, and their customer support is always available when we need it.",
        name: "Sukura Daniels",
        profession: "Supply Chain Manager"
    },
];

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
];

export const packageOptions = [
    {
        icon: book,
        id: "envelope",
        name: "A4 Envelope",
        weight: "0.5",
        length: "32",
        width: "24",
        height: "1"
    },
    {
        icon: book,
        id: "book",
        name: "A book or two",
        weight: "2",
        length: "23",
        width: "14",
        height: "4"
    },
    {
        icon: box,
        id: "shoebox",
        name: "Shoe box",
        weight: "5",
        length: "35",
        width: "20",
        height: "15"
    },
    {
        icon: box,
        id: "movingbox",
        name: "Moving box",
        weight: "10",
        length: "75",
        width: "35",
        height: "35"
    },
];

export const delOptions = [
    {
        id: "earliest",
        date: "Friday, 1st November, 2024",
        price: "365,000",
    },
    {
        id: "ealier",
        date: "Saturday, 2nd November, 2024",
        price: "365,000",
    },
    {
        id: "latest",
        date: "Friday, 8th November, 2024",
        price: "200,000",
    },
];

export const socialMedia = [
    {
        id: "facebook",
        image: FaFacebook,
        link: ""
    },
    {
        id: "instagram",
        image: SiInstagram,
        link: ""
    },
    {
        id: "linkedin",
        image: BiLogoLinkedin,
        link: ""
    },
    {
        id: "twitter",
        image: RiTwitterXLine,
        link: ""
    },
];

export const shipmentSteps = [
    {
        image: message,
        title: "Enter Shipment Details",
        description: "Tell us about your shipment. Enter the dimensions, weight, and type of package.",
    },
    {
        image: fileinvoice,
        title: "Get an instant Quote",
        description: "Once you've provided your shipment information, get an instant quote tailored to your needs.",
    },
    {
        image: mapsearch,
        title: "Select Pickup Location",
        description: "Choose your pickup point from our wide network of locations across Ireland and Nigeria.",
    },
    {
        image: cash,
        title: "Choose Payment & Confirm",
        description: "Select your preferred payment method. After payment, you'll receive a receipt in your dashboard.",
    }
];
  
export const nextSteps = [
    {
        title: "Prepare for pickup",
        description: "Ensure your shipment is sent to the designated pickup location at the scheduled time. Once it arrives, we'll take care of the rest, and you'll be able to track its journey.",
        link: "Change pickup location",
        route: '/createshipment-payment'
    },
    {
        title: "Track your shipment",
        description: "Once your shipment is in transit, use the Track My Shipment page with your tracking ID to follow its progress. You'll also receive notifications to keep you updated.",
        link: "Track my shipment",
        route: '/createshipment-payment'
    },
    {
        title: "Account dashboard",
        description: "For an overview of this and future bookings, log into your Account Dashboard. Here, you can review past shipments, manage details, and make updates.",
        link: "Login to my account",
        route: '/createshipment-payment'
    },
    {
        title: "Still need help?",
        description: "If you have questions, our support team is ready to assist. Connect via Live Chat or email us at support@envoyangel.com.",
        link: "Contact Us",
        route: '/createshipment-payment'
    },
];

export const footerLinks = [
    {
      title: "COMPANY",
        links: [
            {
                name: "About Us",
                route: "",
            },
            {
                name: "Careers",
                route: "",
            },
        ],
    },
    {
      title: "SERVICES",
        links: [
            {
                name: "Book a Shipment",
                route: "/createshipment",
            },
            {
                name: "Track Shipment",
                route: "",
            },
            {
                name: "Get a Quote",
                route: "",
            },
        ],
    },
    {
        title: "RESOURCES",
            links: [
                {
                    name: "Blog",
                    route: "",
                },
                {
                    name: "Shipping Guides",
                    route: "",
                },
                {
                    name: "How to",
                    route: "",
                },
            ],
    },
    {
        title: "SUPPORT",
            links: [
                {
                    name: "Contact Us",
                    route: "",
                },
                {
                    name: "FAQs",
                    route: "",
                },
                {
                    name: "Live Chat",
                    route: "",
                },
            ],
        },
  
    {
      title: "LEGAL",
        links: [
            {
                name: "Cookies",
                route: "",
            },
            {
                name: "Privacy Policy",
                route: "",
            },
            {
                name: "Terms of Usage",
                route: "",
            },
        ],
    },
];

export const sideLinks = [
    {
        id: 'home',
        title: 'Home',
        route: '/user',
        Icon: shome,
    },
    {
        id: 'shipments',
        title: 'Shipments',
        route: '/user/shipments',
        Icon: packagex,
    },
    {
        id: 'paymentsandinvoices',
        title: 'Payments and Invoices',
        route: '/user/paymentsandinvoices',
        Icon: invoice,
    },
    {
        id: 'savedlocations',
        title: 'Saved Locations',
        route: '/user/savedlocations',
        Icon: savedloc,
    },
];

export const shipmentHead = [
    {
        id: 'trackId',
        title: 'Tracking ID',
    },
    {
        id: 'shipdate',
        title: 'Shipping Date',
    },
    {
        id: 'estDelivery',
        title: 'Estimated Delivery Date',
    },
    {
        id: 'shipType',
        title: 'Shipping Type',
    },
    {
        id: 'destination',
        title: 'Destination',
    },
    {
        id: 'recipient',
        title: 'Recipient',
    },
    {
        id: 'shipStatus',
        title: 'Shipment Status',
    },
];