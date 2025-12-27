import { useState } from "react";
import CreateJobForm from "../components/CreateJobForm";
import CandidateCard from "../components/CandidateCard";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Candidate = {
  ID: number;
  Skills: string;
  Experience: number;
  ResumePath: string;
  UserID?: number;
};

type Job = {
  ID: number;
  Title: string;
  Skills: string;
  MinExperience: number;
  CompanyID?: number;
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [jobId, setJobId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const loadCandidates = async (jobId: number) => {
    try {
      setIsLoading(true);
      setError("");
      const res = await api.get(`/job/${jobId}/candidates`);
      setCandidates(res.data);
      setJobId(jobId);
      // Create a minimal job object for display
      setSelectedJob({
        ID: jobId,
        Title: `Job #${jobId}`,
        Skills: "",
        MinExperience: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load candidates");
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobIdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobId = Number(formData.get("jobId"));
    if (jobId) {
      loadCandidates(jobId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="mt-2 text-gray-600">Create job postings and view candidates</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <CreateJobForm />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            View Candidates for a Job
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Enter a job ID to view candidates who have opted in for that job.
          </p>
          <form onSubmit={handleJobIdSubmit} className="flex gap-4">
            <input
              type="number"
              name="jobId"
              placeholder="Enter Job ID"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Load Candidates
            </button>
          </form>
        </div>

        {selectedJob && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Opted-in Candidates
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Job:</span> {selectedJob.Title}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Job ID:</span> {selectedJob.ID}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No candidates have opted in for this job yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <CandidateCard key={candidate.ID} candidate={candidate} />
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedJob && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              Create a job posting to start viewing candidates who opt in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
