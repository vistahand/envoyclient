import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiStatusOnline, 
  HiExternalLink,
  HiDotsVertical,
  HiChevronDown
} from "react-icons/hi";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";

// Create API instance with the URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const CareerPage = () => {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all career listings on component mount
  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setIsLoading(true);
      // Make API call using api instance
      const response = await api.get('/api/admin/jobs');
      console.log("API response:", response);
      
      let jobsData = [];
      
      // Check different possible response structures
      if (response.data?.data?.jobs) {
        // Structure: { data: { jobs: [...] } }
        jobsData = response.data.data.jobs;
      } else if (response.data?.jobs) {
        // Structure: { jobs: [...] }
        jobsData = response.data.jobs;
      } else if (Array.isArray(response.data?.data)) {
        // Structure: { data: [...] }
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Structure: [...] (direct array)
        jobsData = response.data;
      }
      
      // Make sure each job has an id field
      const processedJobs = jobsData.map(job => {
        if (job._id && !job.id) {
          return { ...job, id: job._id };
        }
        return job;
      });
      
      setCareers(processedJobs);
      
      // No fallback mock data - if API returns empty data, show empty state
      if (!processedJobs || processedJobs.length === 0) {
        console.log("No jobs found or empty response from API");
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
      toast.error("Failed to load career listings");
      // Set careers to empty array on error - no fallback mock data
      setCareers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate default expiry date (30 days from today)
  const getDefaultExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      job_type: "",
      amount: "",
      country: "",
      city: "",
      company_overview: "",
      requirements: "",
      mode: "remote",
      active: true,
      applicationLink: "", // New field for external application link
      expiryDate: getDefaultExpiryDate(),
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Job title is required"),
      description: Yup.string().required("Job description is required"),
      location: Yup.string().required("Location is required"),
      job_type: Yup.string().required("Job type is required"),
      amount: Yup.number().typeError("Salary must be a number").required("Base salary is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
      company_overview: Yup.string().required("Company overview is required"),
      requirements: Yup.string().required("Job requirements are required"),
      mode: Yup.string().oneOf(["remote", "hybrid", "physical"], "Invalid job mode").required("Work mode is required"),
      applicationLink: Yup.string().url("Must be a valid URL").required("Application link is required"),
      active: Yup.boolean(),
      expiryDate: Yup.date().required("Expiry date is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        
        // Convert amount values to numbers before submitting
        const submitValues = {
          ...values,
          amount: Number(values.amount),
          // Default to 'published' status when creating a new job
          status: isEditing ? undefined : "published"
        };
        
        console.log("Submitting job with values:", submitValues);
        
        if (isEditing) {
          // Update existing job
          await api.put(`/api/admin/job/${currentJobId}`, submitValues);
          
          // Update local state
          setCareers(prevCareers => {
            if (!Array.isArray(prevCareers)) return [];
            return prevCareers.map(job => 
              job.id === currentJobId || job._id === currentJobId ? { ...job, ...submitValues } : job
            );
          });
          
          toast.success("Job listing updated successfully!");
        } else {
          // Create new job
          const response = await api.post('/api/admin/jobs', submitValues);
          
          // Extract the job data from the nested response structure
          let newJob;
          if (response.data?.data?.job) {
            newJob = response.data.data.job;
          } else if (response.data?.job) {
            newJob = response.data.job;
          } else {
            newJob = response.data;
          }
          
          // Make sure we have an id field (API returns _id, but we use id in the frontend)
          if (newJob._id && !newJob.id) {
            newJob.id = newJob._id;
          }
          
          // Add to local state
          setCareers(prevCareers => {
            if (!Array.isArray(prevCareers)) return [newJob];
            return [...prevCareers, newJob];
          });
          
          toast.success("New job listing created!");
        }
        
        resetForm();
        setIsEditing(false);
        setCurrentJobId(null);
        setShowForm(false);
        
        // Fetch updated data from API to ensure we have the latest state
        fetchCareers();
      } catch (error) {
        console.error("Error saving career:", error);
        toast.error(isEditing ? "Failed to update job listing" : "Failed to create job listing");
        
        // Show more specific error if available
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(`Error: ${error.response.data.error}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  // All fields for the form
  const formFields = [
    { name: "title", label: "Job Title" },
    { name: "job_type", label: "Job Type (Full-time, Part-time, Contract)" },
    { name: "location", label: "Location" },
    { name: "country", label: "Country" },
    { name: "city", label: "City" },
    { name: "amount", label: "Base Salary (Number only)", type: "number" },
    { name: "applicationLink", label: "Application URL (Link for applicants)", type: "url" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "description", label: "Job Description", multiline: true },
    { name: "requirements", label: "Job Requirements", multiline: true },
    { name: "company_overview", label: "Company Overview", multiline: true },
    { 
      name: "mode", 
      label: "Work Mode", 
      isSelect: true,
      options: [
        { value: "remote", label: "Remote" },
        { value: "hybrid", label: "Hybrid" },
        { value: "physical", label: "Physical/On-site" }
      ]
    },
    {
      name: "active",
      label: "Is Active",
      isSelect: true,
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" }
      ]
    }
  ];

  const handleEdit = (job) => {
    formik.setValues({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      job_type: job.job_type || "",
      amount: job.amount || "",
      country: job.country || "",
      city: job.city || "",
      company_overview: job.company_overview || "",
      requirements: job.requirements || "",
      mode: job.mode || "remote",
      active: job.active !== undefined ? job.active : true,
      applicationLink: job.applicationLink || "",
      expiryDate: job.expiryDate || getDefaultExpiryDate(),
    });
    setIsEditing(true);
    setCurrentJobId(job.id || job._id);
    setShowForm(true);
    setOpenDropdownId(null); // Close any open dropdown
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        setIsLoading(true);
        
        // Delete using API
        await api.delete(`/api/admin/job/${id}`);
        
        // Update local state
        setCareers(prevCareers => {
          if (!Array.isArray(prevCareers)) return [];
          return prevCareers.filter(job => (job.id !== id && job._id !== id));
        });
        toast.success("Job listing deleted successfully!");
      } catch (error) {
        console.error("Error deleting career:", error);
        toast.error("Failed to delete job listing");
      } finally {
        setIsLoading(false);
      }
    }
    setOpenDropdownId(null); // Close dropdown after action
  };

  const handleAddNew = () => {
    formik.resetForm();
    setIsEditing(false);
    setCurrentJobId(null);
    setShowForm(true);
  };

  const cancelForm = () => {
    formik.resetForm();
    setShowForm(false);
    setIsEditing(false);
    setCurrentJobId(null);
  };

  // Status management
  const openStatusModal = (job) => {
    setSelectedJob(job);
    setShowStatusModal(true);
    setOpenDropdownId(null); // Close dropdown after action
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedJob(null);
  };

  const updateJobStatus = async (newStatus) => {
    if (!selectedJob) return;
    
    try {
      setStatusLoading(true);
      
      // Update status using API
      await api.put(`/api/admin/job/${selectedJob.id || selectedJob._id}/status`, { status: newStatus });
      
      // Update local state
      setCareers(prevCareers => {
        if (!Array.isArray(prevCareers)) return [];
        return prevCareers.map(job => 
          (job.id === selectedJob.id || job._id === selectedJob._id) ? { ...job, status: newStatus } : job
        );
      });
      
      toast.success(`Job status updated to ${newStatus}`);
      closeStatusModal();
      
      // Fetch updated data from API to ensure we have the latest state
      fetchCareers();
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setStatusLoading(false);
    }
  };

  // Format salary display for the table
  const formatSalaryRange = (job) => {
    if (job.amount) {
      return `$${job.amount.toLocaleString()}`;
    }
    return job.amount || "Not specified";
  };

  // Status labels for display
  const getStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return <span className="bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">Draft</span>;
      case "published":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Published</span>;
      case "closed":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">Closed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-medium">{status}</span>;
    }
  };

  // Active status label
  const getActiveLabel = (active) => {
    return active ? 
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Active</span> :
      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">Inactive</span>;
  };

  // Calculate days remaining until expiry
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
  };

  // Open application link in new tab
  const openApplicationLink = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
      setOpenDropdownId(null); // Close dropdown after action
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  // Render form field based on field type
  const renderFormField = (field) => {
    if (field.isSelect) {
      return (
        <div key={field.name} className="relative flex flex-col">
          <select
            name={field.name}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`py-3.5 px-3.5 outline text-black rounded-lg 
              text-[14px] outline-[1px] bg-transparent w-full focus:outline-primary
              ${formik.touched[field.name] && formik.errors[field.name] ? "outline-mainRed" : "outline-main6"}`}
          >
            {field.options.map(option => (
              <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
            ))}
          </select>
          <label
            htmlFor={field.name}
            className={`absolute left-3.5 top-3.5 origin-[0] z-10 px-2
              -translate-y-6 scale-75 transform text-[14px] bg-white 
              peer-focus:px-2 duration-300 text-main6 pointer-events-none`}
          >
            {field.label}
          </label>
          <p className="text-mainRed text-[12px] mt-1 font-medium">
            {formik.touched[field.name] && formik.errors[field.name]}
          </p>
        </div>
      );
    }
    
    if (field.multiline) {
      return (
        <div key={field.name} className="relative flex flex-col col-span-1 md:col-span-2">
          <textarea
            name={field.name}
            placeholder=" "
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className={`py-3.5 px-3.5 peer outline text-black rounded-lg 
              text-[14px] outline-[1px] bg-transparent w-full focus:outline-primary
              ${formik.touched[field.name] && formik.errors[field.name] ? "outline-mainRed" : "outline-main6"}`}
          />
          <label
            htmlFor={field.name}
            className={`absolute left-3.5 top-3.5 origin-[0] 
              -translate-y-6 scale-75 transform text-[14px] bg-white 
              peer-focus:px-2 duration-300 peer-placeholder-shown:translate-y-0 
              text-main6 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6
              peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
              ${formik.values[field.name] ? "z-10 px-2" : ""}`}
          >
            {field.label}
          </label>
          <p className="text-mainRed text-[12px] mt-1 font-medium">
            {formik.touched[field.name] && formik.errors[field.name]}
          </p>
        </div>
      );
    }
    
    return (
      <div key={field.name} className="relative flex flex-col">
        <input
          type={field.type || "text"}
          name={field.name}
          placeholder=" "
          value={formik.values[field.name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`py-3.5 px-3.5 peer outline text-black rounded-lg 
            text-[14px] outline-[1px] bg-transparent w-full focus:outline-primary
            ${formik.touched[field.name] && formik.errors[field.name] ? "outline-mainRed" : "outline-main6"}`}
        />
        <label
          htmlFor={field.name}
          className={`absolute left-3.5 top-3.5 origin-[0] 
            -translate-y-6 scale-75 transform text-[14px] bg-white 
            peer-focus:px-2 duration-300 peer-placeholder-shown:translate-y-0 
            text-main6 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6
            peer-focus:scale-75 peer-focus:text-main6 pointer-events-none
            ${formik.values[field.name] ? "z-10 px-2" : ""}`}
        >
          {field.label}
        </label>
        <p className="text-mainRed text-[12px] mt-1 font-medium">
          {formik.touched[field.name] && formik.errors[field.name]}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full font-manrope">
      <div className="flex flex-col w-full gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-primary font-semibold text-[28px] tracking-tight">
            Careers Management
          </h1>
          
          <motion.button
            onClick={handleAddNew}
            className="bg-primary text-white flex items-center gap-2 py-2.5 px-4 rounded-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <HiOutlinePlus className="text-[18px]" />
            <span className="text-[14px] font-medium">Add New Job</span>
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border border-main6/30 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-primary font-semibold text-[20px] mb-6">
              {isEditing ? "Edit Job Listing" : "Create New Job Listing"}
            </h2>
            
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {formFields.map(field => renderFormField(field))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <motion.button
                  type="button"
                  onClick={cancelForm}
                  className="border border-main6 text-main4 py-3 px-6 rounded-lg text-[14px] font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-primary text-white py-3 px-8 rounded-lg text-[14px] font-medium
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? "Saving..." : isEditing ? "Update Job" : "Create Job"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Job Listings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-main6/30 overflow-hidden">
          <div className="p-6">
            <h2 className="text-primary font-semibold text-[18px] mb-4">
              Current Job Listings
            </h2>
            
            {isLoading && (!Array.isArray(careers) || careers.length === 0) ? (
              <div className="py-10 text-center text-main4">Loading job listings...</div>
            ) : !Array.isArray(careers) ? (
              <div className="py-10 text-center text-main4">Error loading job listings. Please refresh the page.</div>
            ) : careers.length === 0 ? (
              <div className="py-10 text-center text-main4">No job listings found. Create your first job posting.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Title</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Location</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Type</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Mode</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Salary</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Status</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Active</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Expires In</th>
                      <th className="py-3 px-4 text-[14px] font-semibold text-main4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(careers) && careers.map((job) => (
                      <tr key={job.id || job._id} className="border-t border-main6/20">
                        <td className="py-4 px-4 text-[14px]">{job.title}</td>
                        <td className="py-4 px-4 text-[14px]">{job.city}, {job.country}</td>
                        <td className="py-4 px-4 text-[14px]">{job.job_type}</td>
                        <td className="py-4 px-4 text-[14px] capitalize">{job.mode}</td>
                        <td className="py-4 px-4 text-[14px]">{formatSalaryRange(job)}</td>
                        <td className="py-4 px-4 text-[14px]">
                          {getStatusLabel(job.status || 'draft')}
                        </td>
                        <td className="py-4 px-4 text-[14px]">
                          {getActiveLabel(job.active !== undefined ? job.active : true)}
                        </td>
                        <td className="py-4 px-4 text-[14px]">
                          {job.expiryDate ? (
                            getDaysRemaining(job.expiryDate) > 0 ? 
                              `${getDaysRemaining(job.expiryDate)} days` : 
                              <span className="text-red-600">Expired</span>
                          ) : "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <div className="relative">
                            <motion.button
                              onClick={() => toggleDropdown(job.id || job._id)}
                              className="inline-flex items-center justify-center rounded-md text-gray-700 p-2 hover:bg-gray-100 "
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HiDotsVertical className="text-lg" />
                            </motion.button>
                            
                            {openDropdownId === (job.id || job._id) && (
                              <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                              >
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <button
                                    onClick={() => handleEdit(job)}
                                    className="text-gray-700 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    role="menuitem"
                                  >
                                    <HiOutlinePencil className="text-blue-600" />
                                    <span>Edit Job</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => openStatusModal(job)}
                                    className="text-gray-700 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    role="menuitem"
                                  >
                                    <HiStatusOnline className="text-amber-600" />
                                    <span>Update Status</span>
                                  </button>
                                  
                                  {job.applicationLink && (
                                    <button
                                      onClick={() => openApplicationLink(job.applicationLink)}
                                      className="text-gray-700 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                      role="menuitem"
                                    >
                                      <HiExternalLink className="text-green-600" />
                                      <span>View Application Link</span>
                                    </button>
                                  )}
                                  <button
  onClick={() => handleDelete(job.id || job._id)}
  className="text-gray-700 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
  role="menuitem"
>
  <HiOutlineTrash className="text-red-600" />
  <span>Delete Job</span>
</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={closeStatusModal}
        type="info"
        title="Update Job Status"
        message={selectedJob ? `Update status for "${selectedJob.title}"` : "Update job status"}
        size="sm"
        buttons={[
          {
            label: "Cancel",
            onClick: closeStatusModal,
            variant: "secondary"
          },
          {
            label: "Set as Filled",
            onClick: () => updateJobStatus("filled"),
            variant: "primary"
          },
          {
            label: "Set as Closed",
            onClick: () => updateJobStatus("closed"),
            variant: "danger"
          }
        ]}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-4">
            Current status: {selectedJob && getStatusLabel(selectedJob.status || 'draft')}
          </p>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">
              Changing the status will update the visibility and availability of this job posting.
            </p>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              <li><strong>Filled:</strong> Applications to this job posting is currently maxxed out</li>
              <li><strong>Closed:</strong> Job posting is no longer accepting applications</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CareerPage;