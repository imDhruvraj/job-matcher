import api from "../api/client";
import { useState } from "react";

type Job = {
  ID: number;
  Title: string;
  Skills: string;
  MinExperience: number;
  CompanyID?: number;
};

export default function JobCard({
  job,
  candidateId,
}: {
  job: Job;
  candidateId: number;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string>("");

  const apply = async () => {
    try {
      setIsApplying(true);
      setError("");
      
      await api.post("/apply", {
        CandidateID: candidateId,
        JobID: job.ID,
        Status: "opted_in",
      });
      
      setApplied(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const decline = async () => {
    try {
      setIsApplying(true);
      setError("");
      
      await api.post("/apply", {
        CandidateID: candidateId,
        JobID: job.ID,
        Status: "declined",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to decline");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.Title}</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Skills Required:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {job.Skills.split(",").map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Minimum Experience:</span> {job.MinExperience} years
        </p>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {applied ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✓ You've opted in for this job</p>
        </div>
      ) : (
        <div className="flex space-x-3">
          <button
            onClick={apply}
            disabled={isApplying}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplying ? "Processing..." : "Opt-in"}
          </button>
          <button
            onClick={decline}
            disabled={isApplying}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
