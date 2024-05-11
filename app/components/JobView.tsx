"use client";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Button from '@mui/material/Button';
import JobDetails from "./JobDetails";

export const statusOptions = [
  "Unchecked",
  "Not Interesting",
  "Will Apply",
  "Applied",
];

export default function JobView() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);
  const [currentJob, setCurrentJob] = useState(null);
  const [jobDetailsOpened, setJobDetailsOpened] = useState(false);

  const showEntry = (entry: any) => {
    setCurrentJob(entry);
    setJobDetailsOpened(true);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 20 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "company", headerName: "Company", flex: 1 },
    { field: "createdAt", headerName: "Created At", width: 100 },

    {
      field: "result.compatible",
      headerName: "Compatible",
      width: 100,
      renderCell: (params) => <span style={{color: params.row.result?.compatible == 'yes' ? 'green' : 'gray' }}>{params.row.result?.compatible}</span>,
    },

    {
      field: "result.compatibility_percentage",
      headerName: "%",
      width: 100,
      renderCell: (params) => params.row.result?.compatibility_percentage,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return statusOptions[params.row.status ?? 0];
      },
    },
    {
      field: "_id",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            showEntry(params.row);
          }}
        >
          Show
        </Button>
      ),
    },
  ];

  const fetchJobs = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/jobs?page=${page}&pageSize=${pageSize}&sortField=${sortModel[0]?.field}&sortOrder=${sortModel[0]?.sort}`,
      {}
    );
    const data = await res.json();
    setJobs(data.data);
    setLoading(false);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize, sortModel, jobDetailsOpened]);

  return (
    <>
      <JobDetails
        job={currentJob}
        opened={jobDetailsOpened}
        setOpened={setJobDetailsOpened}
      />
      <DataGrid
        rows={jobs}
        columns={columns}
        autoPageSize
        pageSizeOptions={[5, 10, 20, 50]}
        paginationMode="server"
        onPaginationModelChange={(newPage) => {
          setPage(newPage.page);
          if(newPage.pageSize) {
            setPageSize(newPage.pageSize);
          }
        }}
        onSortModelChange={setSortModel}
        sortingMode="server"
        rowCount={total}
        loading={loading}
      />
    </>
  );
}
