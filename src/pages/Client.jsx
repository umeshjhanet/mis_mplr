import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "./Api";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { format, sub } from "date-fns";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { MdArrowDropDown } from "react-icons/md";
import SemiCircleChart from "../Components/SemiCircleChart";
import SemiCircleCharts from "../Components/SemiCircleChart";
import TodaySemiCircleCharts from "../Components/TodaySemicircle";
import "../style.css";
import Header2 from "../Components/Header2";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
ChartJS.register(ArcElement, Tooltip, Legend);

const NewClient = () => {
  const [cumulative, setCumulative] = useState();
  const [today, setToday] = useState();
  const [todayDate, setTodayDate] = useState();
  const [showAltTable, setShowAltTable] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Cumulative");
  const currentDates = new Date();
  const yesterdayDates = sub(currentDates, { days: 1 });
  const formattedYesterdayDate = format(yesterdayDates, "dd-MM-yyyy");
  const [status, setStatus] = useState();
  const [showExpandedToday, setShowExpandedToday] = useState(false);
  const [showExpandedYesterday, setShowExpandedYesterday] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpen2, setDropdownOpen2] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocation2, setSelectedLocation2] = useState(
    cumulative?.[0]?.LocationName || ""
  );

  const expandToday = () => {
    setShowExpandedToday(!showExpandedToday);
  };

  const expandYesterday = () => {
    setShowExpandedYesterday(!showExpandedYesterday);
  };

  const [showFiles, setShowFiles] = useState(false);
  const [showFiles2, setShowFiles2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState();
  const handleDateChange = (date) => {
    if (date) {
      // Format to YYYY-MM-DD (removing time)
      const formattedDate = format(date, "yyyy-MM-dd");
      setSelectedDate(formattedDate); // Store as a string to avoid timezone issues
    }
  };

  useEffect(() => {
    const fetchCumulative = async () => {
      try {
        let apiUrl = `${API_URL}/aggregated_cumulative`;

        const user = JSON.parse(localStorage.getItem("user"));
        const districtId = user?.district_id;
        const designation = user?.designation;

        // ✅ Only append district_id if user is SLR
        if (designation === "SLR" && districtId) {
          apiUrl += `?district_id=${districtId}`;
        }

        setIsLoading(true);
        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data);
        setCumulative(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };

    const fetchToday = async () => {
      try {
        let apiUrl = `${API_URL}/aggregated_todaydpr`;

        const user = JSON.parse(localStorage.getItem("user"));
        const districtId = user?.district_id;
        const designation = user?.designation;

        // ✅ Only append district_id if user is SLR
        if (designation === "SLR" && districtId) {
          apiUrl += `?district_id=${districtId}`;
        }

        setIsLoading(true);
        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data);
        setToday(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };
    const fetchStatus = async () => {
      try {
        let apiUrl = `${API_URL}/file-status`;

        const user = JSON.parse(localStorage.getItem("user"));
        const locationName = user?.district_name;
        const designation = user?.designation;

        // ✅ Only append district_id if user is SLR
        if (designation === "SLR" && locationName) {
          apiUrl += `?locationName=${locationName}`;
        }

        setIsLoading(true);
        const response = await axios.get(apiUrl);

        console.log("API Response:", response.data);
        setStatus(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        setError("Error fetching report data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchStatus();
    fetchToday();
    fetchCumulative();
  }, []);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const toggleDropdown2 = () => setDropdownOpen2(!isDropdownOpen2);

  const handleSelect2 = (location) => {
    setSelectedLocation2(location);
    setDropdownOpen(false);
    handleChangeLocation({ target: { value: location } }); // trigger same logic as original
  };
  const handleSelect3 = (location) => {
    setSelectedLocation(location);
    setDropdownOpen2(false);
    handleChangeLocation2({ target: { value: location } }); // trigger same logic as original
  };
  const handleChangeDay = () => {
    setShowDropdown((prev) => !prev);
  };
  const handleSelect = (label) => {
    setSelectedLabel(label);
    setShowDropdown(false); // Close dropdown after selection
  };
  const getFutureDate = (days) => {
    const today = new Date();
    today.setDate(today.getDate() + Number(days));
    return today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
  };

  const totalImagesDone = cumulative?.reduce(
    (sum, elem) =>
      sum + (isNaN(parseInt(elem.ScanImages)) ? 0 : parseInt(elem.ScanImages)),
    0
  );

  const totalFilesDone = cumulative?.reduce(
    (sum, elem) =>
      sum + (isNaN(parseInt(elem.ScanFiles)) ? 0 : parseInt(elem.ScanFiles)),
    0
  );
  const estimatedImages = (status || []).reduce(
    (sum, elem) => sum + Number(elem.cumulativeImages || 0),
    0
  );
  const estimatedFiles = (status || []).reduce(
    (sum, elem) => sum + Number(elem.cumulativeFiles || 0),
    0
  );

  const scannedImages = cumulative
    ? cumulative.reduce(
        (sum, elem) =>
          sum +
          (isNaN(parseInt(elem.ScanImages)) ? 0 : parseInt(elem.ScanImages)),
        0
      )
    : 0;

  const scannedFiles = totalFilesDone || 0; // assuming totalFilesDone is from your state or props

  const estimated = showFiles ? estimatedFiles : estimatedImages;
  const done = showFiles ? scannedFiles : scannedImages;

  const percentage = ((done / estimated) * 100).toFixed(2);

  const estimatedImagesToday = 4064000;
  const scannedImagesToday = today
    ? today.reduce(
        (sum, elem) =>
          sum +
          (isNaN(parseInt(elem.ScannedImages))
            ? 0
            : parseInt(elem.ScannedImages)),
        0
      )
    : 0;
  const percentageToday = (
    (scannedImagesToday / estimatedImagesToday) *
    100
  ).toFixed(2);

  useEffect(() => {
    if (status && status.length > 0) {
      setSelectedLocation(status[0].locationName);
    }
  }, [status]);

  const handleChange = (e) => setSelectedLocation(e.target.value);

  const selected = (status ?? []).find(
    (s) => s.locationName === selectedLocation
  );

  const cumulativeMatch = (cumulative ?? []).find((item) => {
    const cleaned = item.LocationName?.replace(/district court/gi, "").trim();
    return cleaned === selectedLocation;
  });

  const scanned = cumulativeMatch
    ? +cumulativeMatch.ScanFiles || 0
    : +selected?.todayFiles || 0;
  const target = selected?.cumulativeFiles;
  const remaining = Math.max(target - scanned, 0);
  const percent = target > 0 ? ((scanned / target) * 100).toFixed(2) : 0;

  const balance = (selected?.cumulativeFiles || 0) - scanned;
  const noOfDays = balance / (selected?.targetfiles || 1);
  const dueDate = getFutureDate(noOfDays);

  const doughnutData = {
    labels: ["Scanned", "Remaining"],
    datasets: [
      {
        data: [scanned, remaining],
        backgroundColor: ["#B15A8F", "#d3d3d3"],
        borderWidth: 1,
      },
    ],
  };

  const centerText = {
    id: "centerText",
    beforeDraw(chart) {
      const { width, height } = chart;
      const ctx = chart.ctx;
      const scannedValue = chart.options.plugins.centerText?.value ?? 0;
      const text = scanned;
      ctx.save();
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#007bff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(scannedValue, width / 2, height / 2 - 10);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText("Achieved", width / 2, height / 2 + 10);
      ctx.fillText("Files Scanned So Far", width / 2, height / 2 + 30);
      ctx.restore();
    },
  };
  const options = {
    plugins: {
      centerText: {
        value: scanned.toLocaleString("en-IN"), // ✅ this is passed to plugin
      },
    },
  };
  const centerText2 = {
    id: "centerText",
    beforeDraw(chart) {
      const { width, height } = chart;
      const ctx = chart.ctx;
      const value = chart.options.plugins.centerText.value || 0;
      ctx.save();
      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = "#007bff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(value.toLocaleString("en-IN"), width / 2, height / 2 - 10);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText("Total Images", width / 2, height / 2 + 12);
      ctx.restore();
    },
  };
  const renderDonutChart = (label, data, type = "cumulative") => {
    const total = type === "today" ? data?.ScannedImages : data?.ScanImages;
    const verified =
      type === "today"
        ? data?.Client_QA_AcceptedImages
        : data?.ClientQAAcceptImages;
    const qc = type === "today" ? data?.QCImages : data?.QcImages;

    const percentage = total > 0 ? ((verified / qc) * 100).toFixed(2) : "0.00";

    const chartData = {
      labels: ["Verified", "Remaining"],
      datasets: [
        {
          data: [verified, qc - verified],
          backgroundColor: ["#B15A8F", "#F76D82"],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      cutout: "70%",
      plugins: {
        legend: { display: false },
        centerText: { value: total },
      },
    };

    return (
      <div style={{ width: "45%", textAlign: "center" }}>
        <h4 style={{ marginBottom: "10px" }}>{label}</h4>
        <Doughnut
          data={chartData}
          options={chartOptions}
          plugins={[centerText2]}
        />
        <div style={{ marginTop: "70px", fontSize: "13px" }}>
          <p style={{ fontWeight: "bold" }}>
            <strong style={{ color: "#F76D82" }}>CBSL QA :</strong>{" "}
            {qc?.toLocaleString("en-IN") || 0}
          </p>
          <p style={{ fontWeight: "bold" }}>
            <strong style={{ color: "#B15A8F" }}>Client QA :</strong>{" "}
            {verified?.toLocaleString("en-IN") || 0}
          </p>
          <p style={{ fontWeight: "bold" }}>
            <strong>Verified Percentage :</strong> {percentage}%
          </p>
        </div>
      </div>
    );
  };
  const handleChangeLocation = (e) => {
    const selected = e.target.value;
    setSelectedLocation2(selected);
  };
  const handleChangeLocation2 = (e) => {
    const selected = e.target.value;
    setSelectedLocation(selected);
  };
  useEffect(() => {
    if (cumulative && cumulative.length > 0) {
      setSelectedLocation2(cumulative[0].LocationName);
    }
  }, [cumulative]);

  const normalize = (name) =>
    name
      ?.replace(/district court/gi, "")
      .trim()
      .toLowerCase();
  const currentCumulative = (cumulative ?? []).find(
    (item) => normalize(item.LocationName) === normalize(selectedLocation2)
  );

  const currentToday = (today ?? []).find(
    (item) => normalize(item.LocationName) === normalize(selectedLocation2)
  );

  const exportDailyTableToCSV = (filename = "DayWiseReport.csv") => {
    const formattedDate = !selectedDate
      ? formattedYesterdayDate
      : new Date(selectedDate).toLocaleDateString("en-GB").replace(/\//g, "-");

    const subHeaders = [
      "Sr.No",
      "Files Scanned by CBSL",
      "Images Scanned by CBSL",
      "Files CBSL QA",
      "Images CBSL QA",
      "Files verified by District Court",
      "Images verified by District Court",
      "Land Record files digitally signed",
      "Land Record files digitised finally in all respects",
    ];
    // Calculate totals
    const totals = today.reduce(
      (acc, elem) => {
        acc.ScannedFiles += Number(elem.ScannedFiles || 0);
        acc.ScannedImages += Number(elem.ScannedImages || 0);
        acc.QCFiles += Number(elem.QCFiles || 0);
        acc.QCImages += Number(elem.QCImages || 0);
        acc.Client_QA_AcceptedFiles += Number(
          elem.Client_QA_AcceptedFiles || 0
        );
        acc.Client_QA_AcceptedImages += Number(
          elem.Client_QA_AcceptedImages || 0
        );
        acc.DigiSignFiles += Number(elem.DigiSignFiles || 0);
        acc.DMS_UploadFiles += Number(elem.DMS_UploadFiles || 0);
        return acc;
      },
      {
        ScannedFiles: 0,
        ScannedImages: 0,
        QCFiles: 0,
        QCImages: 0,
        Client_QA_AcceptedFiles: 0,
        Client_QA_AcceptedImages: 0,
        DigiSignFiles: 0,
        DMS_UploadFiles: 0,
      }
    );

    // Add total row
    const totalRow = [
      "Total",
      totals.ScannedFiles,
      totals.ScannedImages,
      totals.QCFiles,
      totals.QCImages,
      totals.Client_QA_AcceptedFiles,
      totals.Client_QA_AcceptedImages,
      totals.DigiSignFiles,
      totals.DMS_UploadFiles,
    ];

    // CSV conversion
    const convertRowToCSV = (row) => row.map((val) => `"${val}"`).join(",");
    let csvContent = "";

    csvContent += convertRowToCSV(subHeaders) + "\r\n";
    csvContent += convertRowToCSV(totalRow) + "\r\n"; // Add the total row

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Daily_Report_${formattedDate}.csv`);
    link.click();
  };
  const exportCumulativeTableToCSV = (filename = "CumulativeReport.csv") => {
    const formattedDate = !selectedDate
      ? formattedYesterdayDate
      : new Date(selectedDate).toLocaleDateString("en-GB").replace(/\//g, "-");

    const subHeaders = [
      "Sr.No",
      "Files Scanned by CBSL",
      "Images Scanned by CBSL",
      "Files CBSL QA",
      "Images CBSL QA",
      "Files verified by District Court",
      "Images verified by District Court",
      "Land Record files digitally signed",
      "Land Record files digitised finally in all respects",
    ];
    // Calculate totals
    const totals = cumulative.reduce(
      (acc, elem) => {
        acc.ScanFiles += Number(elem.ScanFiles || 0);
        acc.ScanImages += Number(elem.ScanImages || 0);
        acc.QcFiles += Number(elem.QcFiles || 0);
        acc.QcImages += Number(elem.QcImages || 0);
        acc.ClientQAAcceptFiles += Number(elem.ClientQAAcceptFiles || 0);
        acc.ClientQAAcceptImages += Number(elem.ClientQAAcceptImages || 0);
        acc.DigiSignFiles += Number(elem.DigiSignFiles || 0);
        acc.DMSFiles += Number(elem.DMSFiles || 0);
        return acc;
      },
      {
        ScanFiles: 0,
        ScanImages: 0,
        QcFiles: 0,
        QcImages: 0,
        ClientQAAcceptFiles: 0,
        ClientQAAcceptImages: 0,
        DigiSignFiles: 0,
        DMSFiles: 0,
      }
    );

    // Add total row
    const totalRow = [
      "Total",
      totals.ScanFiles,
      totals.ScanImages,
      totals.QcFiles,
      totals.QcImages,
      totals.ClientQAAcceptFiles,
      totals.ClientQAAcceptImages,
      totals.DigiSignFiles,
      totals.DMSFiles,
    ];

    // CSV conversion
    const convertRowToCSV = (row) => row.map((val) => `"${val}"`).join(",");
    let csvContent = "";

    csvContent += convertRowToCSV(subHeaders) + "\r\n";
    csvContent += convertRowToCSV(totalRow) + "\r\n"; // Add the total row

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Cumulative_Report_${formattedDate}.csv`);
    link.click();
  };

  const scanImages = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.ScanImages) || 0),
    0
  );
  const qcedImages = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.QcImages) || 0),
    0
  );
  const verifiedImages = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.ClientQAAcceptImages) || 0),
    0
  );
  const scanFiles = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.ScanFiles) || 0),
    0
  );
  const qcedFiles = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.QcFiles) || 0),
    0
  );
  const verifiedFiles = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.ClientQAAcceptFiles) || 0),
    0
  );

  const uploadedImages = cumulative?.reduce(
    (sum, elem) => sum + (parseInt(elem.DMSFiles) || 0),
    0
  );
  const scanImagesToday = today?.reduce(
    (sum, elem) => sum + (parseInt(elem.ScannedImages) || 0),
    0
  );
  const qcedImagesToday = today?.reduce(
    (sum, elem) => sum + (parseInt(elem.QCImages) || 0),
    0
  );
  const verifiedImagesToday = today?.reduce(
    (sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedImages) || 0),
    0
  );
  const qcedFilesToday = today?.reduce(
    (sum, elem) => sum + (parseInt(elem.QCFiles) || 0),
    0
  );
  const verifiedFilesToday = today?.reduce(
    (sum, elem) => sum + (parseInt(elem.Client_QA_AcceptedFiles) || 0),
    0
  );
  const totalLocations = 55;
  const doneLocations = 0;
  const exportTotalTableToCSV = () => {
    console.log("Clicked");
    const formattedDate = formattedYesterdayDate;

    const groupHeaders = [
      "",
      "",
      formattedDate,
      formattedDate,
      formattedDate,
      formattedDate,
      formattedDate,
      "Cumulative",
      "Cumulative",
      "Cumulative",
      "Cumulative",
      "Cumulative",
    ];

    const subHeaders = [
      "Sr.No",
      "District Name",
      "Files Scanned by CBSL",
      "Images Scanned by CBSL",
      "Pages/images CBSL QA",
      "Pages/images verified by District Court",
      "Case files digitised finally in all respects",
      "Files Scanned by CBSL (Total)",
      "Images Scanned by CBSL (Total)",
      "Pages/images CBSL QA (Total)",
      "Pages/images verified by District Court (Total)",
      "Case files digitised finally in all respects (Total)",
    ];

    const mergedRows = today.map((todayRow, index) => {
      const districtName = todayRow.locationname;
      const cumulativeRow =
        (cumulative ?? []).find((cum) => cum.locationname === districtName) ||
        {};
      return [
        index + 1,
        districtName,
        todayRow.ScannedFiles || 0,
        todayRow.ScannedImages || 0,
        todayRow.QCImages || 0,
        todayRow.ClientQAAcceptImages || 0,
        todayRow.DMS_UploadFiles || 0,
        cumulativeRow.ScanFiles || 0,
        cumulativeRow.ScanImages || 0,
        cumulativeRow.QCImages || 0,
        cumulativeRow.ClientQAAcceptImages || 0,
        cumulativeRow.DMSFiles || 0,
      ];
    });

    // ➕ Calculate totals for numeric columns (columns 2 to 13, index 2 to 13)
    const totalRow = mergedRows.reduce((acc, row, idx) => {
      if (idx === 0) {
        acc = ["", "Total"];
        for (let i = 2; i < row.length; i++) {
          acc[i] = parseFloat(row[i]) || 0;
        }
      } else {
        for (let i = 2; i < row.length; i++) {
          acc[i] += parseFloat(row[i]) || 0;
        }
      }
      return acc;
    }, []);

    const convertRowToCSV = (row) => row.map((val) => `"${val}"`).join(",");

    let csvContent = "";
    csvContent += convertRowToCSV(groupHeaders) + "\r\n";
    csvContent += convertRowToCSV(subHeaders) + "\r\n";
    mergedRows.forEach((row) => {
      csvContent += convertRowToCSV(row) + "\r\n";
    });

    // ➕ Add the total row at the end
    csvContent += convertRowToCSV(totalRow) + "\r\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Location_Wise_Report_${formattedDate}.csv`);
    link.click();
  };
  const downloadStatusCsv = () => {
    const csvData = [
      [
        "Sr.No",
        "District Name",
        "Whether scanning completed (Yes/ No)",
        "Tentative date/time of completion",
        "Total files estimated to be scanned/ digitised (A)",
        "Total files scanned as on date (B)",
        "Total files digitised in all respects",
        "Balance (A - B)",
      ],
    ];

    let totalA = 0,
      totalB = 0,
      totalDigitised = 0,
      totalBalance = 0;

    (status || []).forEach((elem, index) => {
      let todayFiles = elem.todayFiles;
      let totalFiles = elem.totalFiles;

      if (Array.isArray(cumulative) && elem.locationName) {
        const normalize = (str) =>
          str
            ?.toLowerCase()
            .replace(/district\s*court/g, "") // Remove all forms of "district court"
            .replace(/\s+/g, " ") // Normalize multiple spaces
            .trim(); // Remove leading/trailing spaces

        const match = cumulative.find(
          (item) =>
            normalize(item.LocationName) === normalize(elem.locationName)
        );

        if (match) {
          todayFiles = match.ScanFiles;
          totalFiles = match.DMSFiles;
        }
      }

      const cumulatives = Number(elem.cumulativeFiles || 0);
      const scanned = Number(todayFiles || 0);
      const digitised = Number(totalFiles || 0);
      const balance = cumulatives - scanned;
      const noOfDays = elem.targetfiles ? balance / elem.targetfiles : 0;

      const getFutureDate = (days) => {
        const future = new Date();
        future.setDate(future.getDate() + days);
        return future.toLocaleDateString("en-IN");
      };

      const targetDate = getFutureDate(noOfDays);
      const normalizeDate = (dateStr) => {
        const parts = dateStr.split("/");
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      };

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const normalizedDate = normalizeDate(targetDate);

      const isCompleted =
        !normalizedDate ||
        isNaN(normalizedDate.getTime()) ||
        normalizedDate < todayDate;

      csvData.push([
        index + 1,
        elem.locationName,
        isCompleted ? "Yes" : "No",
        isCompleted ? "Completed" : targetDate,
        cumulatives,
        scanned,
        digitised,
        balance,
      ]);

      // Accumulate totals
      totalA += cumulatives;
      totalB += scanned;
      totalDigitised += digitised;
      totalBalance += balance;
    });

    // ✅ Add the total row at the end
    csvData.push([
      "",
      "Total",
      "",
      "",
      totalA,
      totalB,
      totalDigitised,
      totalBalance,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Scanning_Status_Report_${new Date().toLocaleDateString("en-IN")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header2 />
      <div className="container-fluid px-0">
        <div className="main-fluid mb-5">
          <div className="row text-center">
            <p className="heading-of-high-court mt-4 px-0  mx-0 mb-0">
              MADHYA PRADESH LAND RECORD MANAGEMENT SOCIETY
            </p>
            <p className="subheading-of-highcourt mt-0 mb-md-2 mb-0 py-0">
              Digitization Project Report of Land Records
            </p>
          </div>
          <div className="row mt-md-4 mt-sm-3 mt-0 ms-md-3 ms-0 me-md-3 me-0">
            <div className="col-lg-6 col-md-6 col-sm-10 col-12">
              <div className="row ms-1">
                <div className="col-lg-10 col-md-10 col-sm-10 col-10 mt-lg-3 mt-md-2 mt-2">
                  <p className="heading-of-para px-0 mx-0">
                    Cumulative Report - {formattedYesterdayDate}
                  </p>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 mt-1">
                  <img
                    src="/download.svg"
                    onClick={exportCumulativeTableToCSV}
                    style={{ cursor: "pointer" }}
                    alt="download"
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="high-court-client-card">
                <div className="row mb-md-4">
                  <div
                    className="col-lg-4 col-md-4 col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/scannedfile.svg"
                      style={{
                        cursor: "pointer",
                        height: "45px",
                        width: "auto",
                      }}
                      className="d-none d-md-block"
                      alt="scanned file"
                    />
                    <img
                      src="/scannedfile.svg"
                      style={{
                        cursor: "pointer",
                        height: "35px",
                        width: "auto",
                      }}
                      className="d-block d-md-none"
                      alt="scanned file"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.ScanFiles))
                                ? 0
                                : parseInt(elem.ScanFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 13px)",
                        }}
                      >
                        File Scanned
                      </span>
                    </p>
                  </div>

                  <div
                    className="col-lg-4 col-md-4 col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/qc.svg"
                      style={{
                        cursor: "pointer",
                        height: "45px",
                        width: "auto",
                      }}
                      className="d-none d-md-block"
                      alt="qc"
                    />
                    <img
                      src="/qc.svg"
                      style={{
                        cursor: "pointer",
                        height: "35px",
                        width: "auto",
                      }}
                      className="d-block d-md-none"
                      alt="qc"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(10px, 2vw, 12px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      <span
                        style={{
                          color: "#000",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        Files-{" "}
                      </span>
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.QcFiles))
                                ? 0
                                : parseInt(elem.QcFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#000000",
                          fontWeight: "bold",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        <span
                          style={{
                            color: "#000",
                            fontWeight: "500",
                            fontSize: "clamp(10px, 2vw, 12px)",
                          }}
                        >
                          Images-
                        </span>
                        {cumulative &&
                          cumulative
                            .reduce(
                              (sum, elem) =>
                                sum +
                                (isNaN(parseInt(elem.QcImages))
                                  ? 0
                                  : parseInt(elem.QcImages)),
                              0
                            )
                            .toLocaleString("en-IN")}
                      </span>
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(9px, 1.8vw, 13px)",
                        }}
                      >
                        CBSL QA
                      </span>
                    </p>
                  </div>

                  <div
                    className="col-lg-4 col-md-4 col-12 d-lg-flex d-md-flex d-none mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/DMS.svg"
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="dms"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.DMSFiles))
                                ? 0
                                : parseInt(elem.DMSFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "12px",
                        }}
                      >
                        Data Handover
                      </span>
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div
                    className="col-lg-4 col-md-4 col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/scannedimage.svg"
                      style={{
                        cursor: "pointer",
                        height: "45px",
                        width: "auto",
                      }}
                      className="d-none d-md-block"
                      alt="scanned image"
                    />
                    <img
                      src="/scannedimage.svg"
                      style={{
                        cursor: "pointer",
                        height: "35px",
                        width: "auto",
                      }}
                      className="d-block d-md-none"
                      alt="scanned image"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.ScanImages))
                                ? 0
                                : parseInt(elem.ScanImages)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 13px)",
                        }}
                      >
                        Images Scanned
                      </span>
                    </p>
                  </div>

                  <div
                    className="col-lg-4 col-md-4 col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/verified.svg"
                      style={{
                        cursor: "pointer",
                        height: "45px",
                        width: "auto",
                      }}
                      className="d-none d-md-block"
                      alt="verified"
                    />
                    <img
                      src="/verified.svg"
                      style={{
                        cursor: "pointer",
                        height: "35px",
                        width: "auto",
                      }}
                      className="d-block d-md-none"
                      alt="verified"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(10px, 2vw, 12px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      <span
                        style={{
                          color: "#000",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        Files-{" "}
                      </span>
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.ClientQAAcceptFiles))
                                ? 0
                                : parseInt(elem.ClientQAAcceptFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#000000",
                          fontWeight: "bold",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        <span
                          style={{
                            color: "#000",
                            fontWeight: "500",
                            fontSize: "clamp(10px, 2vw, 12px)",
                          }}
                        >
                          Images-{" "}
                        </span>
                        {cumulative &&
                          cumulative
                            .reduce(
                              (sum, elem) =>
                                sum +
                                (isNaN(parseInt(elem.ClientQAAcceptImages))
                                  ? 0
                                  : parseInt(elem.ClientQAAcceptImages)),
                              0
                            )
                            .toLocaleString("en-IN")}
                      </span>
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(9px, 1.8vw, 13px)",
                        }}
                      >
                        Client QA
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-end mb-2 me-1">
                  <button
                    onClick={expandToday}
                    style={{
                      backgroundColor: "#13a3c3",
                      border: "none",
                      padding: "0",
                      marginBottom: "5px",
                    }}
                  >
                    {showExpandedToday ? (
                      <RiArrowDropUpLine
                        style={{ fontSize: "30px", color: "white" }}
                      />
                    ) : (
                      <RiArrowDropDownLine
                        style={{ fontSize: "30px", color: "white" }}
                      />
                    )}
                  </button>
                </div>

                <div className="row d-lg-none d-md-none">
                  <div
                    className="col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/Digi.svg"
                      style={{ cursor: "pointer", height: "35px" }}
                      alt="digi"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.DigiSignFiles))
                                ? 0
                                : parseInt(elem.DigiSignFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        Files Digitally Signed
                      </span>
                    </p>
                  </div>

                  <div
                    className="col-6 mb-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <img
                      src="/DMS.svg"
                      style={{ cursor: "pointer", height: "35px" }}
                      alt="dms"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative &&
                        cumulative
                          .reduce(
                            (sum, elem) =>
                              sum +
                              (isNaN(parseInt(elem.DMSFiles))
                                ? 0
                                : parseInt(elem.DMSFiles)),
                            0
                          )
                          .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: "500",
                          fontSize: "clamp(10px, 2vw, 12px)",
                        }}
                      >
                        Data Handover
                      </span>
                    </p>
                  </div>
                </div>
                {showExpandedToday && (
                  <>
                    <div className="row me-2 my-md-0 mt-3 px-0 d-flex justify-content-start justify-content-lg-end text-start text-lg-end">
                      <div>
                        <button
                          className={`toggle-btn  ${
                            !showFiles ? "active" : ""
                          }`}
                          onClick={() => setShowFiles(false)}
                        >
                          Images
                        </button>
                        <button
                          className={`toggle-btn ${showFiles ? "active" : ""}`}
                          onClick={() => setShowFiles(true)}
                        >
                          Files
                        </button>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-12 d-flex justify-content-center">
                        <SemiCircleCharts
                          estimated={
                            showFiles ? estimatedFiles : estimatedImages
                          }
                          scanned={showFiles ? scanFiles : scanImages}
                          qced={showFiles ? qcedFiles : qcedImages}
                          verified={showFiles ? verifiedFiles : verifiedImages}
                          showFiles={showFiles}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-10 col-12">
              <div className="row ms-1">
                <div className="col-lg-10 col-md-10 col-sm-10 col-10 mt-lg-3 mt-md-2 mt-2">
                  <p className="heading-of-para px-0 mx-0">
                    Yesterday's Report
                  </p>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2 col-2 mt-1">
                  <img
                    src="/download.svg"
                    onClick={exportDailyTableToCSV}
                    style={{ cursor: "pointer" }}
                    alt="download"
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="high-court-client-card">
                <div className="row mb-md-4">
                  <div className="col-lg-4 col-md-4 col-6 mb-3 d-flex align-items-center gap-2">
                    <img
                      src="/todayscannedfile.svg"
                      style={{ cursor: "pointer", height: "45px" }}
                      className="d-none d-md-block"
                      alt="scanned file"
                    />
                    <img
                      src="/todayscannedfile.svg"
                      style={{ cursor: "pointer", height: "35px" }}
                      className="d-block d-md-none"
                      alt="scanned file"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    >
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.ScannedFiles))
                              ? 0
                              : parseInt(elem.ScannedFiles)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: 500,
                          fontSize: "clamp(10px, 2vw, 13px)",
                        }}
                      >
                        File Scanned
                      </span>
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-4 col-6 mb-3 d-flex align-items-center gap-2">
                    <img
                      src="/todayqc.svg"
                      className="d-none d-md-block"
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="qc"
                    />
                    <img
                      src="/todayqc.svg"
                      className="d-block d-md-none"
                      style={{ cursor: "pointer", height: "35px" }}
                      alt="qc"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(10px, 2vw, 12px)",
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Files- </span>
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.QCFiles))
                              ? 0
                              : parseInt(elem.QCFiles)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span style={{ fontWeight: 500 }}>Images- </span>
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.QCImages))
                              ? 0
                              : parseInt(elem.QCImages)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: 500,
                          fontSize: "clamp(9px, 1.8vw, 13px)",
                        }}
                      >
                        CBSL QA
                      </span>
                    </p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-12 d-md-flex d-none mb-3 d-lg-flex align-items-center gap-2">
                    <img
                      src="/todayDMS.svg"
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="dms"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    >
                      {cumulative
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.DMS_UploadFiles))
                              ? 0
                              : parseInt(elem.DMS_UploadFiles)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: 500,
                          fontSize: "12px",
                        }}
                      >
                        Data Handover
                      </span>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-6 mb-3 d-flex align-items-center gap-2">
                    <img
                      src="/todayscannedimage.svg"
                      className="d-none d-md-block"
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="scanned image"
                    />
                    <img
                      src="/todayscannedimage.svg"
                      className="d-block d-md-none"
                      style={{ cursor: "pointer", height: "35px" }}
                      alt="scanned image"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 16px)",
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    >
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.ScannedImages))
                              ? 0
                              : parseInt(elem.ScannedImages)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: 500,
                          fontSize: "clamp(10px, 2vw, 13px)",
                        }}
                      >
                        Images Scanned
                      </span>
                    </p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-6 mb-3 d-flex align-items-center gap-2">
                    <img
                      src="/todayverified.svg"
                      className="d-none d-md-block"
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="verified"
                    />
                    <img
                      src="/todayverified.svg"
                      className="d-block d-md-none"
                      style={{ cursor: "pointer", height: "35px" }}
                      alt="verified"
                    />
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "clamp(10px, 2vw, 12px)",
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.2",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>Files- </span>
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.Client_QA_AcceptedFiles))
                              ? 0
                              : parseInt(elem.Client_QA_AcceptedFiles)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span style={{ fontWeight: 500 }}>Images- </span>
                      {today
                        ?.reduce(
                          (sum, elem) =>
                            sum +
                            (isNaN(parseInt(elem.Client_QA_AcceptedImages))
                              ? 0
                              : parseInt(elem.Client_QA_AcceptedImages)),
                          0
                        )
                        .toLocaleString("en-IN")}
                      <br />
                      <span
                        style={{
                          color: "#414141",
                          fontWeight: 500,
                          fontSize: "clamp(9px, 1.8vw, 13px)",
                        }}
                      >
                        Client QA
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-end mb-2 me-1">
                  <button
                    onClick={expandYesterday}
                    style={{
                      backgroundColor: "#13a3c3",
                      border: "none",
                      padding: "0",
                      marginBottom: "5px",
                    }}
                  >
                    {showExpandedYesterday ? (
                      <RiArrowDropUpLine
                        style={{ fontSize: "30px", color: "white" }}
                      />
                    ) : (
                      <RiArrowDropDownLine
                        style={{ fontSize: "30px", color: "white" }}
                      />
                    )}
                  </button>
                </div>
                {showExpandedYesterday && (
                  <>
                    <div className="row  me-2 my-md-0 mt-3 px-0 d-flex justify-content-start justify-content-lg-end text-start text-lg-end">
                      <div>
                        <button
                          className={`toggle-btn ${
                            !showFiles2 ? "active" : ""
                          }`}
                          onClick={() => setShowFiles2(false)}
                        >
                          Images
                        </button>
                        <button
                          className={`toggle-btn ${showFiles2 ? "active" : ""}`}
                          onClick={() => setShowFiles2(true)}
                        >
                          Files
                        </button>
                      </div>
                    </div>

                    <div className="row mt-1">
                      <div className="col-12 d-flex justify-content-center">
                        <TodaySemiCircleCharts
                          estimated={totalLocations}
                          scanned={doneLocations}
                          qced={showFiles2 ? qcedFilesToday : qcedImagesToday}
                          verified={
                            showFiles2
                              ? verifiedFilesToday
                              : verifiedImagesToday
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row mt-md-4 mt-2 ms-md-3 ms-1  me-1 me-md-3 position-relative">
            <div className="col-lg-12 col-md-12 col-12 position-relative">
              <div className="row position-relative">
                <div className="d-flex mb-md-3 mb-2 justify-content-between align-items-center position-relative">
                  <div>
                    <p className="heading-of-para m-0">
                      District-Wise Daily Report{" "}
                    </p>
                  </div>
                  <div className="d-flex justify-evenly align-items-center">
                    <div className="position-relative">
                      <button
                        style={{ position: "relative" }}
                        className="btn-dropdown-card"
                        onClick={handleChangeDay}
                      >
                        {selectedLabel}
                        <MdArrowDropDown style={{ fontSize: "25px" }} />
                      </button>
                      {showDropdown && (
                        <div className="button-dropdown">
                          <p onClick={() => handleSelect("Yesterday")}>
                            Yesterday
                          </p>
                          <p onClick={() => handleSelect("Cumulative")}>
                            Cumulative
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <img
                        src="/download.svg"
                        alt="Download CSV"
                        onClick={exportTotalTableToCSV}
                        style={{
                          height: "45px",
                          cursor: "pointer",
                          position: "relative",
                          zIndex: 9999,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-md-0 mx-1">
                <div className="client-table-card">
                  <div style={{ maxHeight: "375px", overflow: "auto" }}>
                    <table
                      className="table-bordered mb-4 mt-4"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr
                          style={{
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          <th>Sr. No.</th>
                          <th style={{ verticalAlign: "middle" }}>
                            District Name
                          </th>
                          <th>File Scanned</th>
                          <th>Images Scanned</th>
                          <th>CBSL QA</th>
                          <th>Client QA</th>
                          {/* <th>Files Digitally Signed</th> */}
                          <th>Data Handover</th>
                        </tr>
                      </thead>
                      {selectedLabel === "Yesterday" ? (
                        <tbody>
                          {today &&
                            today.map((elem, index) => (
                              <tr
                                key={index}
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  textAlign: "center",
                                  backgroundColor: "white",
                                }}
                              >
                                <td style={{ border: "1px solid black" }}>
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "left",
                                  }}
                                >
                                  {elem.locationname}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.ScannedFiles}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.ScannedImages}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.QCImages}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.Client_QA_AcceptedImages}
                                </td>

                                <td style={{ border: "1px solid black" }}>
                                  {elem.DMS_UploadFiles}
                                </td>
                              </tr>
                            ))}
                          <tr
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              textAlign: "center",
                              backgroundColor: "white",
                            }}
                          >
                            <td style={{ border: "1px solid black" }}></td>
                            <td style={{ border: "1px solid black" }}>Total</td>
                            <td style={{ border: "1px solid black" }}>
                              {today &&
                                today
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.ScannedFiles))
                                        ? 0
                                        : parseInt(elem.ScannedFiles)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {today &&
                                today
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.ScannedImages))
                                        ? 0
                                        : parseInt(elem.ScannedImages)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {today &&
                                today
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.QCImages))
                                        ? 0
                                        : parseInt(elem.QCImages)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {today &&
                                today
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(
                                        parseInt(elem.Client_QA_AcceptedImages)
                                      )
                                        ? 0
                                        : parseInt(
                                            elem.Client_QA_AcceptedImages
                                          )),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>

                            <td style={{ border: "1px solid black" }}>
                              {today &&
                                today
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.DMS_UploadFiles))
                                        ? 0
                                        : parseInt(elem.DMS_UploadFiles)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody>
                          {cumulative &&
                            cumulative.map((elem, index) => (
                              <tr
                                key={index}
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  textAlign: "center",
                                  backgroundColor: "white",
                                }}
                              >
                                <td style={{ border: "1px solid black" }}>
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "left",
                                  }}
                                >
                                  {elem.locationname}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.ScanFiles}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.ScanImages}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.QcImages}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.ClientQAAcceptImages}
                                </td>
                                {/* <td style={{ border: "1px solid black" }}>
                                {elem.DigiSignFiles}
                              </td> */}
                                <td style={{ border: "1px solid black" }}>
                                  {elem.DMSFiles}
                                </td>
                              </tr>
                            ))}
                          <tr
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              textAlign: "center",
                              backgroundColor: "white",
                            }}
                          >
                            <td style={{ border: "1px solid black" }}></td>
                            <td style={{ border: "1px solid black" }}>Total</td>
                            <td style={{ border: "1px solid black" }}>
                              {cumulative &&
                                cumulative
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.ScanFiles))
                                        ? 0
                                        : parseInt(elem.ScanFiles)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {cumulative &&
                                cumulative
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.ScanImages))
                                        ? 0
                                        : parseInt(elem.ScanImages)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {cumulative &&
                                cumulative
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.QcImages))
                                        ? 0
                                        : parseInt(elem.QcImages)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {cumulative &&
                                cumulative
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(
                                        parseInt(elem.ClientQAAcceptImages)
                                      )
                                        ? 0
                                        : parseInt(elem.ClientQAAcceptImages)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                            {/* <td style={{ border: "1px solid black" }}>
                            {cumulative &&
                              cumulative
                                .reduce(
                                  (sum, elem) =>
                                    sum +
                                    (isNaN(parseInt(elem.DigiSignFiles))
                                      ? 0
                                      : parseInt(elem.DigiSignFiles)),
                                  0
                                )
                                .toLocaleString("en-IN")}
                          </td> */}
                            <td style={{ border: "1px solid black" }}>
                              {cumulative &&
                                cumulative
                                  .reduce(
                                    (sum, elem) =>
                                      sum +
                                      (isNaN(parseInt(elem.DMSFiles))
                                        ? 0
                                        : parseInt(elem.DMSFiles)),
                                    0
                                  )
                                  .toLocaleString("en-IN")}
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-4 col-sm-4">
              <div className="row position-relative  mb-2">
                <div className="d-flex my-2 mt-md-0 mt-3 justify-content-between align-items-center position-relative">
                  <div>
                    <p className="heading-of-para m-0">Verification Status</p>
                  </div>
                  <div>
                    <div style={{ position: "relative" }}>
                      <div className="custom-select-wrapper">
                        <div
                          className="custom-select-selected"
                          onClick={toggleDropdown}
                        >
                          {selectedLocation2
                            .replace(/district court/gi, "")
                            .trim()}
                          <MdArrowDropDown style={{ fontSize: "25px" }} />
                        </div>
                        {isDropdownOpen && (
                          <div className="custom-select-options">
                            {cumulative?.map((loc, idx) => (
                              <div
                                key={idx}
                                className="custom-option"
                                onClick={() => handleSelect2(loc.LocationName)}
                              >
                                {loc.LocationName.replace(
                                  /district court/gi,
                                  ""
                                ).trim()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row me-1">
                <div className="doughnut-card">
                  {Array.isArray(today) &&
                    today.length > 0 &&
                    Array.isArray(cumulative) &&
                    cumulative.length > 0 && (
                      <div className="row justify-content-between">
                        {renderDonutChart("Yesterday", currentToday, "today")}
                        {renderDonutChart(
                          "Cumulative",
                          currentCumulative,
                          "cumulative"
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div> */}
          </div>
          <div className="row mt-3 ms-md-3 me-md-3 justify-content-center align-items-center">
            <div className="col-lg-12 col-md-12 col-12">
              <div className="row">
                <div className="d-flex  justify-content-between align-items-center position-relative">
                  <div className="d-block">
                    <p className="heading-of-para">
                      {" "}
                      District-Wise Progress of Land Record File Digitization
                    </p>
                    <p style={{ fontSize: "11px", marginTop: "-10px" }}>
                      *(Estimated files and timeline are based on inputs from
                      court officials and current production trends, and may
                      change with future updates.)*
                    </p>
                  </div>
                  <div>
                    <img
                      src="/download.svg"
                      onClick={downloadStatusCsv}
                      style={{ cursor: "pointer", height: "45px" }}
                      alt="download"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="client-table-card">
                  <div style={{ maxHeight: "375px", overflow: "auto" }}>
                    <table
                      className="table-bordered mb-4 mt-4"
                      style={{
                        width: "100%",
                        maxHeight: "375px",
                        overflow: "auto",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            fontSize: "13px",
                            textAlign: "center",
                          }}
                        >
                          <th>Sr. No.</th>
                          <th style={{ verticalAlign: "middle" }}>
                            District Name
                          </th>
                          <th>Scanning Completed?</th>
                          <th>Tentative Completion Date</th>
                          <th>Estimated Files to Scan</th>
                          <th>Files Scanned So Far</th>
                          <th>Remaining Files</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status &&
                          Array.isArray(cumulative) &&
                          status.map((elem, index) => {
                            const cumulativeMatch = Array.isArray(cumulative)
                              ? cumulative.find((item) => {
                                  const cleanedDistrict = item.locationname;
                                  return cleanedDistrict === elem.locationName;
                                })
                              : null;

                            const todayFiles = cumulativeMatch
                              ? cumulativeMatch.ScanFiles
                              : elem.todayFiles;
                            const totalFiles = cumulativeMatch
                              ? cumulativeMatch.DMSFiles
                              : elem.totalFiles;
                            const getYearFromDMY = (dateStr) => {
                              if (!dateStr) return null;
                              const separator = dateStr.includes("-")
                                ? "-"
                                : "/";
                              const [day, month, year] =
                                dateStr.split(separator);
                              return parseInt(year);
                            };
                            const balance =
                              Number(elem.cumulativeFiles || 0) -
                              Number(todayFiles || 0);
                            const noofdays = balance / elem.targetfiles;
                            const targetDate = getFutureDate(noofdays);
                            const completedYear = getYearFromDMY(targetDate);
                            let backgroundColor = "transparent";
                            if (elem.completedStatus === 1) {
                              backgroundColor = "#b7ebbd";
                            }
                            // else if (completedYear && completedYear > 2027) {
                            //     backgroundColor = '#FFE2E2';
                            // }
                            const rowStyle = {
                              backgroundColor,
                              border: "1px solid black",
                              fontSize: "13px",
                              fontWeight: "600",
                              textAlign: "center",
                            };
                            return (
                              <tr key={index} style={rowStyle}>
                                <td style={{ border: "1px solid black" }}>
                                  {index + 1}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "left",
                                  }}
                                >
                                  {elem.locationName}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {elem.completedStatus === 1 ? "Yes" : "No"}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {(() => {
                                    const normalizeDate = (dateStr) => {
                                      if (!dateStr) return null;
                                      const parts = dateStr.includes("/")
                                        ? dateStr.split("/")
                                        : dateStr.split("-");
                                      const [day, month, year] = parts;
                                      return new Date(
                                        `${year}-${month}-${day}`
                                      );
                                    };

                                    const normalizedDate =
                                      normalizeDate(targetDate);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);

                                    if (
                                      elem.completedStatus === 1 ||
                                      !normalizedDate ||
                                      isNaN(normalizedDate.getTime()) ||
                                      normalizedDate < today
                                    ) {
                                      return "Completed";
                                    }

                                    return targetDate;
                                  })()}
                                </td>

                                <td style={{ border: "1px solid black" }}>
                                  {Number(elem.cumulativeFiles).toLocaleString(
                                    "en-IN"
                                  )}
                                </td>
                                <td style={{ border: "1px solid black" }}>
                                  {Number(todayFiles).toLocaleString("en-IN")}
                                </td>

                                <td style={{ border: "1px solid black" }}>
                                  {balance.toLocaleString("en-IN")}
                                </td>
                              </tr>
                            );
                          })}
                        {Array.isArray(status) && status.length > 0 && (
                          <tr
                            style={{
                              fontWeight: "500",
                              fontSize: "13px",
                              backgroundColor: "#FFF",
                              textAlign: "center",
                            }}
                          >
                            <td
                              colSpan={4}
                              style={{
                                border: "1px solid black",
                                textAlign: "center",
                              }}
                            >
                              Total
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {status
                                .reduce(
                                  (sum, elem) =>
                                    sum + Number(elem.cumulativeFiles || 0),
                                  0
                                )
                                .toLocaleString("en-IN")}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {status && Array.isArray(status)
                                ? status
                                    .reduce((sum, elem) => {
                                      const match =
                                        Array.isArray(cumulative) &&
                                        cumulative.find(
                                          (item) =>
                                            item.locationname ===
                                            elem.locationName
                                        );

                                      const scanFiles = match
                                        ? Number(match.ScanFiles || 0)
                                        : Number(elem.todayFiles || 0);

                                      return sum + scanFiles;
                                    }, 0)
                                    .toLocaleString("en-IN")
                                : 0}
                            </td>

                            <td style={{ border: "1px solid black" }}>
                              {status
                                .reduce((sum, elem) => {
                                  const match = Array.isArray(cumulative)
                                    ? cumulative.find(
                                        (item) =>
                                          item.locationname ===
                                          elem.locationName
                                      )
                                    : null;
                                  const todayFiles = Number(
                                    match?.ScanFiles || elem.todayFiles || 0
                                  );
                                  const cumulatives = Number(
                                    elem.cumulativeFiles || 0
                                  );
                                  return sum + (cumulatives - todayFiles);
                                }, 0)
                                .toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-4 col-md-4 col-11 ">
              <div className="row mb-md-2 mt-md-0 mb-1 mt-3">
                <div className="d-flex  justify-content-between align-items-center position-relative">
                  <div>
                    <p className="heading-of-para">District Files Status</p>
                  </div>
                  <div>
                    <div style={{ position: "relative" }} className="mb-3">
                     
                      <div className="custom-select-wrapper">
                        <div
                          className="custom-select-selected"
                          onClick={toggleDropdown2}
                        >
                          {selectedLocation}
                          <MdArrowDropDown style={{ fontSize: "25px" }} />
                        </div>
                        {isDropdownOpen2 && (
                          <div className="custom-select-options">
                            {status?.map((loc, idx) => (
                              <div
                                key={idx}
                                className="custom-option"
                                onClick={() => handleSelect3(loc.locationName)}
                              >
                                {loc.locationName}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="doughnut-card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ margin: 0 }}>{selectedLocation}</h5>
                  <div style={{ fontSize: "12px", textAlign: "right" }}>
                    <div>
                      <strong>Target:</strong>{" "}
                      {Number(selected?.cumulativeFiles || 0).toLocaleString(
                        "en-IN"
                      )}
                    </div>
                    <div style={{ color: "#888" }}>Estimated Files to Scan</div>
                  </div>
                </div>
                <Doughnut
                  data={doughnutData}
                  options={options}
                  plugins={[centerText]}
                />
                <div
                  className="d-flex justify-content-between mt-3 px-2"
                  style={{ fontSize: "13px" }}
                >
                  <div>
                    <strong>Achieved Percentage:</strong> {percent}%
                  </div>
                  <div>
                    <strong>Due Date:</strong> {dueDate}
                  </div>
                </div>
                
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewClient;
