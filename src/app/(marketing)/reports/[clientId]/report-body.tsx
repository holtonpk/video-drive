import React from "react";
import ReactMarkdown from "react-markdown";
// import "./report-style.css";

type Report = {
  label: string;
  date: string;
  body: string;
};

const ReportBody = ({selectedReport}: {selectedReport: Report}) => {
  return (
    <div
      id="report"
      className="bg-white/5 border border-white/10 p-4 rounded-md "
    >
      <ReactMarkdown>{selectedReport.body}</ReactMarkdown>
    </div>
  );
};

export default ReportBody;
