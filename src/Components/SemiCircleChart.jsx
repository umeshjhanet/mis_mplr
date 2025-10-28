import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const SemiCircleCharts = ({
  estimated = 0,
  scanned = 0,
  qced = 0,
  verified = 0,
  signed = 0,
  uploaded = 0,
  showFiles = false, // New prop to know files or images
}) => {
  const [chartHeight, setChartHeight] = useState(300);
  const [chartWidth, setChartWidth] = useState("100%");

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width <= 576) {
        setChartHeight(150); // Mobile height
        setChartWidth("100%");
      } else if (width <= 768) {
        setChartHeight(140); // Small tablet
        setChartWidth("100%");
      } else if (width <= 992) {
        setChartHeight(160); // Tablet
        setChartWidth("100%");
      } else {
        setChartHeight(250); // Desktop
        setChartWidth("100%");
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const baseOptions = {
    chart: {
      type: "donut",
      height: chartHeight,
    },
    legend: {
      show: false,
      position: "bottom",
      fontSize: "12px",
      labels: {
        colors: "#000",
      },
      itemMargin: {
        vertical: 4,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 0,
        donut: {
          size: window.innerWidth <= 576 ? "60%" : "70%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"],
        fontSize:
          window.innerWidth <= 576
            ? "10px"
            : window.innerWidth <= 768
            ? "11px"
            : "13px",
        fontWeight: "700",
      },
      dropShadow: {
        enabled: false,
      },
    },
  };

  const estimatedScannedOptions = {
    ...baseOptions,
    labels: ["Scanned", "Remaining"],
    colors: ["#50B498", "#FF9898"],
  };

  const qcedVerifiedOptions = {
    ...baseOptions,
    labels: ["CBSL QC", "Verified by Court"],
    colors: ["#9B7EBD", "#64B5F6"],
  };

  const signedUploadedOptions = {
    ...baseOptions,
    labels: ["Signed", "Uploaded"],
    colors: ["#FF7043", "#4E6688"],
  };

  const estimatedScannedSeries = [scanned, Math.max(estimated - scanned, 0)];
  const qcedVerifiedSeries = [qced, verified];
  const signedUploadedSeries = [signed, uploaded];

  return (
    <div className="main-div p-0 m-0">
      <div className="row gx-1 p-0 text-center mt-3">
        {/* First Chart */}
        <div className="col-6 mb-3 d-flex flex-column align-items-center">
          <div className="chart-title-wrapper mb-2">
            <strong
              style={{
                fontSize:
                  window.innerWidth <= 576
                    ? "10px"
                    : window.innerWidth <= 768
                    ? "12px"
                    : "14px",
                textAlign: "center",
                display: "block",
                lineHeight: "1.2",
              }}
            >
              Estimated vs Scanned
            </strong>
          </div>
          <div
            className="chart-container"
            style={{
              width: "100%",
              maxWidth: window.innerWidth <= 576 ? "150px" : "280px",
            }}
          >
            <Chart
              options={estimatedScannedOptions}
              series={estimatedScannedSeries}
              type="donut"
              height={chartHeight}
              width="100%"
            />
          </div>
        </div>

        {/* Second Chart */}
        <div className="col-6 mb-3 d-flex flex-column align-items-center">
          <div className="chart-title-wrapper mb-2">
            <strong
              style={{
                fontSize:
                  window.innerWidth <= 576
                    ? "10px"
                    : window.innerWidth <= 768
                    ? "12px"
                    : "14px",
                textAlign: "center",
                display: "block",
                lineHeight: "1.2",
              }}
            >
              CBSL QA vs Client QA
            </strong>
          </div>
          <div
            className="chart-container"
            style={{
              width: "100%",
              maxWidth: window.innerWidth <= 576 ? "150px" : "280px",
            }}
          >
            <Chart
              options={qcedVerifiedOptions}
              series={qcedVerifiedSeries}
              type="donut"
              height={chartHeight}
              width="100%"
            />
          </div>
        </div>
      </div>

      {/* Estimated text - ab yahan handle kar rahe hain */}
      <div className="row -mt-5">
        <div className="col-10  -mt-5">
          <p className="estimated-images">
            Estimated {showFiles ? "Files" : "Images"} -{" "}
            <span style={{ color: "#50B498" }}>
              {estimated.toLocaleString("en-IN")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SemiCircleCharts;
