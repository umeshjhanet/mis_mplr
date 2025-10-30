import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./Api";
import { toast, ToastContainer } from "react-toastify";
import Header2 from "../Components/Header2";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const SiteCompletionForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    completedStatus: "0",
    completedDate: "",
    cumulativeFiles: "",
    todayFiles: "",
    totalFiles: "",
    targetFiles: "",
    cumulativeImages: "",
    targetImages: "",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/locations`);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocation();
  }, []);

  const fetchLocationData = async (locationName) => {
    try {
      const response = await axios.get(`${API_URL}/file-status-form`, {
        params: { locationName },
      });
      if (response.data.length > 0) {
        const data = response.data[0];
        setIsUpdate(true);
        setFormData({
          locationName: data.locationName,
          completedStatus: data.completedStatus?.toString() || "0",
          completedDate: formatDate(data.completedDate),
          cumulativeFiles: data.cumulativeFiles,
          todayFiles: data.todayFiles,
          totalFiles: data.totalFiles,
          targetFiles: data.targetfiles,
          cumulativeImages: data.cumulativeImages,
          targetImages: data.targetImages,
        });
      } else {
        setIsUpdate(false);
        setFormData((prevData) => ({
          ...prevData,
          locationName,
          completedStatus: "0",
          completedDate: "",
          cumulativeFiles: "",
          todayFiles: "",
          totalFiles: "",
          targetFiles: "",
          cumulativeImages: "",
          targetImages: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "locationName") {
      fetchLocationData(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/site-completion`, formData);
      toast.success(
        isUpdate ? "Updated successfully!" : "Inserted successfully!"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <>
      <ToastContainer />
      <Header2 />
      <div className="container">
        <div className="row mt-0 me-1 mx-auto mt-5">
          <div className="d-flex align-items-center p-0 mb-2">
            <button
              className="d-inline-flex align-items-center gap-2 border-0 rounded py-1"
              style={{ color: "white", backgroundColor: "#337ab7" }}
              onClick={() => navigate("/client")}
            >
              <BiArrowBack />
              <span className="d-inline-block">Dashboard</span>
            </button>
            <h4 className="text-center mb-0 flex-grow-1">
              Tentative Completion of Scanning Work of Decided Cases
            </h4>
          </div>
          <div
            className="search-report-card bg-white  p-4 rounded"
            style={{ height: "auto", borderTop: "4px solid #337ab7" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <select
                      className="form-select"
                      name="locationName"
                      value={formData.locationName}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc, index) => (
                        <option
                          key={index}
                          value={loc.name || loc.locationName}
                        >
                          {loc.name || loc.LocationName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Whether scanning completed (Yes/No)
                    </label>
                    <select
                      className="form-select"
                      name="completedStatus"
                      value={formData.completedStatus}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                      required
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Tentative date/time of completion
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="completedDate"
                      value={formData.completedDate}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label className="form-label">
                      Total No. of files estimated to be scanned/digitised
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="cumulativeFiles"
                      value={formData.cumulativeFiles}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Average per day Scanning(files)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="targetFiles"
                      value={formData.targetFiles}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Total No. of Images estimated to be scanned/digitised
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="cumulativeImages"
                      value={formData.cumulativeImages}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Average per day Scanning(Images)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="targetImages"
                      value={formData.targetImages}
                      onChange={handleChange}
                      style={{ height: "40px" }}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn add-btn ms-0"
                style={{ color: "white", backgroundColor: "#337ab7" }}
              >
                {isUpdate ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteCompletionForm;
