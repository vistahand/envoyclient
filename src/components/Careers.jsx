import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCurrencyDollar, HiOutlineCalendar, HiOutlineGlobe, HiOutlineExternalLink } from "react-icons/hi";
import { toast } from "react-hot-toast";
import axios from "axios";

// Create API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch career listings on component mount
  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setIsLoading(true);
      // Make API call to get published, active jobs
      const response = await api.get('/api/admin/jobs/active');
    
      
      let jobsData = [];
      
      // Handle different possible response structures
      if (response.data?.data?.jobs) {
        jobsData = response.data.data.jobs;
      } else if (response.data?.jobs) {
        jobsData = response.data.jobs;
      } else if (Array.isArray(response.data?.data)) {
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }
      
      // Process the jobs to ensure consistent structure and field naming
      const processedJobs = jobsData.map(job => {
        const processedJob = { ...job };
        
        // Ensure id is present
        if (job._id && !job.id) {
          processedJob.id = job._id;
        }
        
        // Ensure created_at is present (for date formatting)
        if (job.createdAt && !job.created_at) {
          processedJob.created_at = job.createdAt;
        }
        
        return processedJob;
      });
      
      // Filter to only show published and active jobs
      const publishedJobs = processedJobs.filter(job => 
        job.status === "published" && (job.active === undefined || job.active === true)
      );
      
      setCareers(publishedJobs);
      
      // If we got jobs back, select the first one by default
      if (publishedJobs.length > 0) {
        setSelectedJob(publishedJobs[0]);
      }
      
      // If no jobs found, fall back to mock data for development purposes
      if (!publishedJobs || publishedJobs.length === 0) {
        toast.error("No published job listings found");
        
        // Only use mock data in development
        if (process.env.NODE_ENV === "development") {
          const mockJobs = [
            {
              id: 1,
              title: "Senior Frontend Developer",
              description: "We are looking for a skilled frontend developer with React experience",
              location: "New York",
              job_type: "Full-time",
              amount: "$120,000 - $150,000",
              country: "United States",
              city: "New York",
              company_overview: "Envoy Angel is a leading shipping and logistics company.",
              requirements: "5+ years React experience, TypeScript knowledge, etc.",
              mode: "hybrid",
              created_at: new Date().toISOString(),
              applicationLink: "",
              status: "published",
              active: true
            },
            {
              id: 2,
              title: "Backend Developer",
              description: "Backend role working with Node.js and MongoDB",
              location: "Remote",
              job_type: "Contract",
              amount: "$90,000 - $110,000",
              country: "Any",
              city: "Any",
              company_overview: "Envoy Angel is a leading shipping and logistics company.",
              requirements: "3+ years Node.js experience, MongoDB, etc.",
              mode: "remote",
              created_at: new Date().toISOString(),
              applicationLink: "",
              status: "published",
              active: true
            }
          ];
          setCareers(mockJobs);
          if (mockJobs.length > 0) {
            setSelectedJob(mockJobs[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
      toast.error("Failed to load job listings");
      
      // Use mock data on error in development
      if (process.env.NODE_ENV === "development") {
        const mockJobs = [
          {
            id: 1,
            title: "Senior Frontend Developer",
            description: "We are looking for a skilled frontend developer with React experience",
            location: "New York",
            job_type: "Full-time",
            amount: "$120,000 - $150,000",
            country: "United States",
            city: "New York",
            company_overview: "Envoy Angel is a leading shipping and logistics company.",
            requirements: "5+ years React experience, TypeScript knowledge, etc.",
            mode: "hybrid",
            created_at: new Date().toISOString(),
            applicationLink: ""
          },
          {
            id: 2,
            title: "Backend Developer",
            description: "Backend role working with Node.js and MongoDB",
            location: "Remote",
            job_type: "Contract",
            amount: "$90,000 - $110,000",
            country: "Any",
            city: "Any",
            company_overview: "Envoy Angel is a leading shipping and logistics company.",
            requirements: "3+ years Node.js experience, MongoDB, etc.",
            mode: "remote",
            created_at: new Date().toISOString(),
            applicationLink: ""
          }
        ];
        setCareers(mockJobs);
        if (mockJobs.length > 0) {
          setSelectedJob(mockJobs[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  // Function to handle external application link
  const handleApplyClick = (url) => {
    // Use the provided application URL or fall back to a generic form
    const applicationUrl = url || "https://docs.google.com/forms/d/e/your-form-id/viewform";
    window.open(applicationUrl, "_blank", "noopener,noreferrer");
  };

  // Format date - Enhanced to handle different date field names
  const formatDate = (job) => {
    // Try different potential date fields
    const dateString = job.created_at || job.createdAt || job.updatedAt || new Date().toISOString();
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format salary range
  const formatSalaryRange = (job) => {
    if (job.min_amount && job.max_amount) {
      return `$${Number(job.min_amount).toLocaleString()} - $${Number(job.max_amount).toLocaleString()}`;
    } else if (job.amount) {
      if (typeof job.amount === 'string' && job.amount.includes('-')) {
        return job.amount; // Already formatted
      }
      return `$${Number(job.amount).toLocaleString()}`;
    }
    return "Salary not specified";
  };

  // Get work mode badge color
  const getWorkModeBadgeClass = (mode) => {
    switch(mode) {
      case 'remote':
        return "bg-green-100 text-green-800";
      case 'hybrid':
        return "bg-blue-100 text-blue-800";
      case 'physical':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get work mode display text
  const getWorkModeText = (mode) => {
    switch(mode) {
      case 'remote':
        return 'Remote';
      case 'hybrid':
        return 'Hybrid';
      case 'physical':
        return 'On-site';
      default:
        return mode || 'Not specified';
    }
  };

  return (
    <div className="w-full font-manrope">
      <div className="bg-primary/5 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-primary font-bold text-3xl">Join Our Team</h1>
          <p className="text-main4 mt-3 max-w-xl">
            Explore our open positions and find your perfect role at Envoy Angel.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Job listings */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-primary font-semibold text-lg mb-4">Open Positions</h2>
            
            {isLoading ? (
              <div className="py-8 text-center text-main4">Loading job listings...</div>
            ) : careers.length === 0 ? (
              <div className="py-8 text-center text-main4">No open positions at the moment.</div>
            ) : (
              <div className="space-y-3">
                {careers.map((job) => (
                  <motion.div
                    key={job.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleJobSelect(job)}
                    className={`p-4 rounded-lg border cursor-pointer ${
                      selectedJob && selectedJob.id === job.id 
                        ? "border-primary bg-primary/5" 
                        : "border-main6/30 hover:border-primary/30"
                    }`}
                  >
                    <h3 className="font-semibold text-[16px] text-primary">{job.title}</h3>
                    <div className="flex items-center text-main4 text-[14px] mt-2">
                      <HiOutlineLocationMarker className="mr-1" />
                      <span>{job.city}, {job.country}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-[12px]">
                        {job.job_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-[12px] ${getWorkModeBadgeClass(job.mode)}`}>
                        {getWorkModeText(job.mode)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Job details */}
          <div className="w-full lg:w-2/3">
            {selectedJob ? (
              <div className="bg-white rounded-lg border border-main6/30 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-primary font-bold text-2xl">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-main4 text-[14px]">
                      <div className="flex items-center">
                        <HiOutlineLocationMarker className="mr-1" />
                        <span>{selectedJob.city}, {selectedJob.country}</span>
                      </div>
                      <div className="flex items-center">
                        <HiOutlineOfficeBuilding className="mr-1" />
                        <span>{selectedJob.job_type}</span>
                      </div>
                      <div className="flex items-center">
                        <HiOutlineCurrencyDollar className="mr-1" />
                        <span>{formatSalaryRange(selectedJob)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleApplyClick(selectedJob.applicationLink)}
                    className="bg-primary text-white flex items-center gap-2 py-2 px-4 rounded-lg text-[14px] font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                    <HiOutlineExternalLink />
                  </motion.button>
                </div>

                <div className="border-t border-main6/20 pt-4 mt-4">
                  <div className="flex items-center mb-4 text-[14px] text-main4">
                    <HiOutlineCalendar className="mr-2" />
                    <span>Posted on {formatDate(selectedJob)}</span>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-semibold text-[16px] text-primary mb-2">Job Description</h3>
                      <p className="text-main4 text-[14px] leading-relaxed">
                        {selectedJob.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[16px] text-primary mb-2">Requirements</h3>
                      <p className="text-main4 text-[14px] leading-relaxed">
                        {selectedJob.requirements}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[16px] text-primary mb-2">About the Company</h3>
                      <p className="text-main4 text-[14px] leading-relaxed">
                        {selectedJob.company_overview}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <motion.button
                      onClick={() => handleApplyClick(selectedJob.applicationLink)}
                      className="bg-primary text-white flex items-center gap-2 py-2.5 px-5 rounded-lg text-[14px] font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Apply for this Position
                      <HiOutlineExternalLink />
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-main6/30 p-6 shadow-sm flex flex-col items-center justify-center h-80">
                <HiOutlineGlobe className="text-primary/30 text-5xl mb-4" />
                <h3 className="text-primary font-semibold text-lg mb-2">Select a position</h3>
                <p className="text-main4 text-center">
                  Browse through our open positions and select one to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;