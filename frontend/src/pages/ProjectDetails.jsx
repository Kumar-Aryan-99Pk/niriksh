import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectDetails() {
  const { id } = useParams();
  return (
    <div className="page">
      <h1>Project Audit Details</h1>
      <p>Detailed drill-down view for Work ID: <strong>{id}</strong></p>
    </div>
  );
}