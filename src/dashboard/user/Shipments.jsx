import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoPlus } from "react-icons/go";
import { HiOutlineSearch } from "react-icons/hi";
import { shipmentHead, shipmentRows } from '../../constants';
import { AiOutlineDoubleLeft, AiOutlineLeft, AiOutlineRight, AiOutlineDoubleRight } from 'react-icons/ai';
import { TiArrowSortedDown } from 'react-icons/ti';
import { LuArrowLeftRight } from "react-icons/lu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

const Shipments = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleSelectRow = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayedRows.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRowClick = (data) => {
    navigate({
      pathname: '/user/shipments/details',
      state: { shipment: data }
    });
  };

  const totalRows = shipmentRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const displayedRows = shipmentRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section className='w-full'>
      <div className='w-full flex flex-col gap-8'>
        <div className="w-full flex md:flex-row flex-col md:gap-0 gap-5 
        md:justify-between md:items-center">
          <div className='flex flex-col'>
            <h1 className='text-primary tracking-tight font-bold md:text-[30px] 
            ss:text-[30px] text-[23px]'>
              Shipments
            </h1>

            <h4 className='text-main2 tracking-tight font-medium md:text-[16px] 
            ss:text-[16px] text-[14px] md:leading-[1.5rem] ss:leading-[1.5rem] 
            leading-[1.2rem]'>
              Create, view, track and manage all your active and delivered 
              shipments in one place
            </h4>
          </div>
        
          <button type='button'
          onClick={() => navigate('/user/shipments/createshipment')}
          className='bg-primary md:text-[14px] ss:text-[15px] text-[13px]
          py-3 px-6 flex text-white rounded-xl grow4 cursor-pointer
          items-center justify-center gap-3'>
            <p>
              Create New
            </p>
            
            <GoPlus className='text-[20px]'/>
          </button>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="flex items-center md:gap-6 ss:gap-6 gap-5 
          tracking-tight">
            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            ${selectedTab === 'active' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'} 
              md:pb-2 ss:pb-2 pb-1 text-center cursor-pointer
              hover:text-primary navsmooth3`} 
              onClick={() => handleTabChange('active')}
            >
              Active
            </h2>

            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${selectedTab === 'delivered' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'}
            md:pb-2 ss:pb-2 pb-1`} 
            onClick={() => handleTabChange('delivered')}
            >
              Delivered
            </h2>

            <h2 className={`text-main4 md:text-[15px] ss:text-[15px] text-[14px]
            text-center hover:text-primary cursor-pointer navsmooth3
            ${selectedTab === 'pending' 
            ? 'text-primary font-extrabold border-b-primary border-b-[2px] px-3' : 'font-semibold'}
            md:pb-2 ss:pb-2 pb-1`} 
            onClick={() => handleTabChange('pending')}
            >
              Pending
            </h2>
          </div>

          <div className="w-full">
            <div className="md:w-[40%] ss:w-[70%] w-full rounded-lg p-3 
            gap-5 outline outline-[1px] outline-main7 bg-mainalt flex 
            items-center justify-between">
              <input
                type="text"
                placeholder="Search by origin, destination, recipient details, etc."
                className="text-main8 focus:outline-none text-[14px] w-full
                placeholder:text-[13px] placeholder:text-main8 font-medium 
                tracking-tight bg-transparent"
              />

              <HiOutlineSearch
                className='w-[1.4rem] h-auto text-main8 cursor-pointer'
              />
            </div>
          </div>

          <div className="w-full rounded-lg outline outline-[1px] outline-main9 overflow-hidden
          md:p-5 ss:p-5 p-4 flex flex-col gap-5">
            <table className="w-full rounded-lg outline outline-[1px] outline-main9 md:p-5 ss:p-5 p-4 overflow-x-auto">
              <thead className='md:text-[14px] ss:text-[14px] text-[13px] font-medium text-main4 tracking-tight'>
                <tr className='w-full'>
                  <th className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4 border-b border-main9">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className={`cursor-pointer custom-checkbox ${!selectAll ? 'custom-checkbox-head' : ''} checkbox2`}
                    />
                  </th>

                  {shipmentHead.map((item, index) => (
                    <th 
                    key={index}
                    index={index}
                    className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4 border-b border-main9">
                      <div className="flex items-center">
                        <h2 className='overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]'>
                          {item.title}
                        </h2>
                        
                        {(item.id === "shipdate" || item.id === "estDelivery") && (
                          <LuArrowLeftRight className="w-4 h-4 transform rotate-90 ml-3 cursor-pointer text-main2" />
                        )}
                      </div>
                    </th>
                  ))}

                  <th className="md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4 border-b border-main9"></th>
                </tr>
              </thead>

              <tbody className='md:text-[14px] ss:text-[14px] text-[13px] font-semibold text-main2 tracking-tight'>
                {displayedRows.map((data, index) => (
                  <tr key={index} 
                  onClick={() => handleRowClick(data)}
                  className={`hover:bg-mainalt navsmooth cursor-pointer ${index !== displayedRows.length - 1 ? 'border-b border-main9' : ''} ${selectedRows.includes(index) ? 'bg-main7' : ''}`}>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleSelectRow(index)}
                        className="cursor-pointer custom-checkbox checkbox2"
                      />
                    </td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.trackId}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.shipDate}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.estDelivery}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.shipType}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.destination}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[15ch]">{data.recipient}</td>
                    <td className="text-left md:pl-5 ss:pl-5 pl-4 md:py-5 ss:py-5 py-4">{data.shipStatus}</td>
                    <td className="relative text-left md:px-4 ss:px-4 px-3 md:py-5 ss:py-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="cursor-pointer" onClick={() => toggleMenu(index)}>
                        <HiOutlineDotsHorizontal className='text-main4 text-[24px]'/>
                      </div>
                      {menuOpen === index && (
                        <div ref={menuRef} className="absolute right-2 bg-white border border-main7 rounded-md shadow-md z-10 w-[10vw] navsmooth">
                          <ul className="list-none">
                            <li className="p-3 hover:bg-mainalt cursor-pointer">Option 1</li>
                            <li className="p-3 hover:bg-mainalt cursor-pointer">Option 2</li>
                            <li className="p-3 hover:bg-mainalt cursor-pointer">Option 3</li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="w-full border-t-[1px] border-main9 md:px-5 md:py-5 py-5 md:px-5 ss:px-5">
              <div className="flex items-center md:justify-end ss:justify-end justify-between text-main8 md:text-[14px] ss:text-[15px]
              text-[14px] tracking-tight font-medium md:mr-10 ss:mr-10">
                <div className="flex items-center">
                  <span className="ss:mr-2 mr-1">Rows per page:</span>

                  <div className='relative flex items-center'>
                    <select 
                      value={rowsPerPage} 
                      onChange={handleChangeRowsPerPage} 
                      className="bg-transparent md:pr-6 ss:pr-6 pr-4 md:mr-2 mr-3 py-1 custom-select
                      cursor-pointer px-2">
                      {[10, 11, 12, 13, 14].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <div className='absolute right-3'>
                      <TiArrowSortedDown 
                        className='text-main text-[15px]'
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center md:ml-6 ss:ml-8 md:mr-5">
                  <span className='md:mr-0 ss:mr-0 mr-5'>{`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalRows)} 
                    of ${totalRows}`}
                  </span>

                  <button onClick={handleFirstPage} 
                  className="md:ml-6 ss:ml-10 ml-2">
                    <AiOutlineDoubleLeft />
                  </button>

                  <button onClick={handlePreviousPage} 
                  className="ml-3">
                    <AiOutlineLeft />
                  </button>

                  <button onClick={handleNextPage} 
                  className="ml-3">
                    <AiOutlineRight />
                  </button>

                  <button onClick={handleLastPage} 
                  className="ml-3">
                    <AiOutlineDoubleRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shipments;