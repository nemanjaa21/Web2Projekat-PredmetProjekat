import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, Box, List, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  acceptVerification,
  denyVerification,
  getAllSalesmans,
} from "../../services/UserService";
import NavBar from "../NavBar/NavBar";

const Verification = () => {
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const [user, setUser] = useState(null);
  const [salesmans, setSalesmans] = useState([]);
  const [alert, setAlert] = useState({
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSalesmans();
        console.log("ovaj ispis", response.data);
        setSalesmans(response.data);
      } catch (error) {
        setAlert({
          message: exceptionRead(error.response.data),
          severity: "error",
        });
        return;
      }
    };

    fetchData();
  }, [user]);

  const handleAcceptVerification = async (id) => {
    try {
      const response = await acceptVerification(id);
      console.log("id", id);
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      if (error !== undefined) {
        setAlert({
          message: exceptionRead(error.response.data),
          severity: "error",
        });
        return;
      }
    }
  };

  const handleDenyVerification = async (id) => {
    try {
      const response = await denyVerification(id);
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      if (error !== undefined) {
        setAlert({
          message: exceptionRead(error.response.data),
          severity: "error",
        });
        return;
      }
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50, type: "number" },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "email", headerName: "Email", width: 170 },
    { field: "verification", headerName: "Verification", width: 130 },
    {
      field: "verificate",
      headerName: "Verificate",
      width: 230,
      sortable: false,
      renderCell: (params) => {
        const { id, verification } = params.row;
        if (verification === "INPROGRESS") {
          return (
            <div>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAcceptVerification(id)}
              >
                ACCEPT
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDenyVerification(id)}
              >
                DENY
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <>
      {alert.message !== "" && (
        <Alert
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            width: "auto",
          }}
          onClose={() => setAlert({ message: "", severity: "success" })}
        >
          <AlertTitle>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </AlertTitle>
          {alert.message}
        </Alert>
      )}
      <NavBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#8B008B",
        }}
      >
        <DataGrid
         sx={{ color: "white", textAlign: "center" }}
          rows={salesmans}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </>
  );
};

export default Verification;
