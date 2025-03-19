import { useState, useEffect } from 'react';
import { SectionWrapper } from "../hoc";
import { HiOutlineArrowRight } from "react-icons/hi";
import { PiWarningCircle } from "react-icons/pi";
import { ShippingModal, BankTransferModal } from '../components';
import axios from 'axios';

const ShipmentPay = ({ onPrev, onNext }) => {
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [isBankTransferModalOpen, setIsBankTransferModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [shipmentId, setShipmentId] = useState(null);
    const [shipmentDetails, setShipmentDetails] = useState(null); // ✅ Added state for shipment details

    // Fetch shipment details when component mounts
    useEffect(() => {
        const fetchShipmentDetails = async () => {
            try {
                const response = await axios.get('/api/shipments/current'); // Adjust API endpoint
                setShipmentDetails(response.data);
                console.log("Fetched shipment details:", response.data);
            } catch (error) {
                console.error("Error fetching shipment details:", error.response?.data || error.message);
            }
        };

        fetchShipmentDetails();
    }, []);

    const disableScroll = () => {
        setScrollPosition(window.pageYOffset);
        document.body.style.overflow = 'hidden';
        document.body.style.top = `-${scrollPosition}px`;
    };

    const handlePay = async () => {
        if (!shipmentDetails) {
            alert("Shipment details not found!");
            return;
        }

        const requestData = {
            shipmentId: shipmentDetails.id,
            accountName: shipmentDetails.customer.name,
            bankName: shipmentDetails.bankName,
        };

        console.log("Sending payment request:", requestData);

        try {
            const response = await axios.post('/api/payments/bank-transfer/initialize', requestData);
            console.log("Payment initialization response:", response.data);

            if (response.data.success) {
                setShipmentId(response.data.shipmentId);
                setIsBankTransferModalOpen(true);
                disableScroll();
            } else {
                alert("Payment initialization failed!");
            }
        } catch (error) {
            console.error("Error initializing payment:", error.response?.data || error.message || error);
            alert("Error initializing payment. Check the console for details.");
        }
    };

    const verifyPayment = async () => {
        if (!shipmentId) return;

        try {
            const response = await axios.post(`/api/payments/bank-transfer/verify/${shipmentId}`);

            if (response.data.success) {
                alert("Payment verified successfully!");
                onNext();
            } else {
                alert("Payment verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment.");
        }
    };

    return (
        <section className='w-full flex md:min-h-[600px] ss:min-h-[800px] min-h-[800px]'>
            <div className="w-full flex md:flex-row flex-col gap-14 justify-between">
                <div className="w-full flex flex-col gap-6">
                    <h1 className='text-primary font-bold md:text-[30px] ss:text-[28px] text-[22px] tracking-tight'>
                        You're about to pay <span className='line-through'>N</span> {shipmentDetails ? shipmentDetails.totalAmount : "Loading..."}
                    </h1>

                    <div className="flex flex-col gap-4 w-full">
                        <div className='flex items-center gap-2 rounded-xl bg-primary1 px-5 py-3.5 w-full'>
                            <PiWarningCircle className='md:w-[1.8rem] ss:w-[1.8rem] w-[3.2rem] h-auto text-primary'/>
                            <p className='text-main4 md:text-[14px] ss:text-[14px] text-[12px] font-medium'>
                                NB: Your billing address has been set to your shipping address by default as a guest.
                                To change this, you can <a href='/createshipment-payment' className='font-bold text-primary'>create an account</a> or <a href='/createshipment-payment' className='font-bold text-primary'>login here</a>.
                            </p>
                        </div>
                    </div>

                    <div className='w-full h-[1px] bg-main5 mt-2'/>

                    <div className='w-full mt-2 flex flex-col gap-5'>
                        <p className="text-main4 text-[12px] font-medium leading-[18px]">
                            By clicking on the Pay Now button, you agree to Envoy Angel's Terms of Service and Privacy Policy.
                        </p>

                        <div className='w-full'>
                            <div className="flex items-center md:w-[55%] ss:w-[55%] md:gap-5 ss:gap-5 gap-3">
                                <button className='bg-none text-[13px] py-3.5 w-[50%] text-primary rounded-full grow2 border border-primary' onClick={onPrev}>
                                    <p className='font-semibold'>Go back</p>
                                </button>

                                <button className='bg-primary text-[13px] py-3.5 w-[50%] flex text-white rounded-full grow4 gap-3' onClick={handlePay} disabled={!shipmentDetails}>
                                    <p>Pay Now</p>
                                    <HiOutlineArrowRight className='text-[14px]'/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-[55%] ss:w-[60%] md:mb-0 ss:mb-0 mb-8">
                    <div className="bg-primary1 md:p-10 ss:p-10 p-5 flex flex-col rounded-2xl md:gap-6 ss:gap-6 gap-5">
                        <h1 className="font-bold text-[16px] tracking-tight text-main2">Payment Summary</h1>

                        {shipmentDetails ? (
                            <div className="flex flex-col w-full gap-2.5 md:text-[13px] ss:text-[15px] text-[14px] tracking-tight">
                                <div className="flex justify-between items-center w-full text-main2 font-medium">
                                    <p>Shipment Cost</p>
                                    <p><span className='line-through'>N</span> {shipmentDetails.baseCost}</p>
                                </div>

                                <div className="flex justify-between items-center w-full text-main2 font-medium">
                                    <p>VAT (7.5%)</p>
                                    <p><span className='line-through'>N</span> {shipmentDetails.vat}</p>
                                </div>

                                <div className="flex justify-between items-center w-full text-main2 font-medium">
                                    <p>Insurance Coverage (Basic)</p>
                                    <p><span className='line-through'>N</span> {shipmentDetails.insurance}</p>
                                </div>

                                <div className="flex justify-between items-center w-full">
                                    <p className="md:text-[13px] ss:text-[15px] text-[14px]">Subtotal:</p>
                                    <p className="text-primary md:text-[23px] ss:text-[24px] text-[22px] font-bold">
                                        <span className='line-through'>N</span> {shipmentDetails.totalAmount}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p>Loading shipment details...</p>
                        )}
                    </div>
                </div>
            </div>

            {isShippingModalOpen && (
                <ShippingModal onClose={() => setIsShippingModalOpen(false)} />
            )}

            {isBankTransferModalOpen && (
                <BankTransferModal onClose={() => setIsBankTransferModalOpen(false)} handleNext={verifyPayment} />
            )}
        </section>
    );
};

export default SectionWrapper(ShipmentPay, '');
