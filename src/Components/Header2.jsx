import React from "react";
import { BiClipboard } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header2 = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none">
        <nav
          className="navbar navbar-expand-lg"
          style={{ backgroundColor: "#63c4ff" }}
        >
          <div className="container-fluid">
            <div className="row custom-header-image ms-3">
              <img
                src="mplr-logo.png"
                alt="logo"
                style={{ height: "40px", cursor: "pointer" }}
                onClick={() => navigate("/client")}
              />
            </div>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
              <form className="d-flex align-items-center gap-2">
                {user && user.designation.toLowerCase() == "admin" && (
                  <button
                    className="border-0 bg-transparent d-inline-flex align-items-center"
                    style={{ color: "white", marginTop: "4px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/siteCompletionForm");
                    }}
                  >
                    <BiClipboard
                      style={{
                        color: "white",
                        fontSize: "30px",
                        marginRight: "10px",
                      }}
                    />
                    <span className="d-inline-block">Site Form</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="btn logout-btn"
                  style={{ color: "white", marginTop: "4px" }}
                >
                  <IoLogOut
                    style={{
                      color: "white",
                      fontSize: "30px",
                      marginRight: "10px",
                    }}
                  />
                  LOGOUT
                </button>
                <span className="text-white d-inline-block">
                  <span className="fw-semibold">Welcome:</span>{" "}
                  {user && user.name ? user.name : "Guest"}
                  {user && user.district_name && (
                    <span className="mx-1">-</span>
                  )}
                  {user && user.district_name && user.district_name}
                </span>
              </form>
            </div>
          </div>
        </nav>
      </div>
      <div className="d-block d-xl-none d-lg-none d-md-block d-sm-block">
        <nav
          className="navbar navbar-expand-lg"
          style={{ backgroundColor: "#63c4ff" }}
        >
          <div className="container-fluid">
            <div className="row custom-header-image ms-3">
              <img
                src="mplr-logo.png"
                alt="logo"
                style={{ height: "40px" }}
                onClick={() => navigate("/client")}
              />
            </div>
            <form className="d-flex">
              <button
                onClick={handleLogout}
                className="btn logout-btn"
                style={{ color: "white", marginTop: "4px" }}
              >
                <IoLogOut
                  style={{
                    color: "white",
                    fontSize: "30px",
                    marginRight: "10px",
                  }}
                />
                LOGOUT
              </button>
            </form>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header2;
