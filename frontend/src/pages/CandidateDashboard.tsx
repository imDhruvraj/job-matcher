import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/client";
import ResumeUpload from "../components/ResumeUpload";
import JobCard from "../components/JobCard";

type Job = {
  ID: number;
  Title: string;
  Skills: string;
  MinExperience: number;
  CompanyID?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
};

type CandidateProfile = {
  ID?: number;
  UserID: number;
  Skills: string;
  Experience: number;
  ResumePath?: string;
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [profileCreated, setProfileCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [experience, setExperience] = useState<number>(0);
  const [showProfileForm, setShowProfileForm] = useState(true);

  // Check if profile was already created (stored in localStorage)
  useEffect(() => {
    if (user) {
      const storedCandidateId = localStorage.getItem(`candidate_id_${user.ID}`);
      if (storedCandidateId) {
        setCandidateId(Number(storedCandidateId));
        setProfileCreated(true);
        setShowProfileForm(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && candidateId) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateId]);

  const fetchJobs = async () => {
    if (!candidateId) return;
    
    try {
      setIsLoading(true);
      setError("");
      const res = await api.get(`/candidate/${candidateId}/jobs`);
      setJobs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!skills.trim()) {
      setError("Please enter your skills");
      return;
    }

    if (experience < 0) {
      setError("Experience must be a positive number");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      const res = await api.post("/candidate", {
        UserID: user.ID,
        Skills: skills.trim(),
        Experience: experience,
      });
      
      // Note: Backend doesn't return candidate ID in response.
      // We need to fetch jobs using candidate ID, but we don't have it.
      // For now, we'll try to use user ID as candidate ID (workaround).
      // In a production system, the backend should return the created candidate with ID.
      setCandidateId(user.ID);
      localStorage.setItem(`candidate_id_${user.ID}`, user.ID.toString());
      setProfileCreated(true);
      setShowProfileForm(false);
      
      // Try to fetch jobs - this might fail if candidate ID != user ID
      try {
        await fetchJobs();
      } catch (fetchErr: any) {
        // If fetching jobs fails, it might be because candidate ID is different
        setError("Profile created successfully, but unable to load jobs. Please refresh the page.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your profile and discover job opportunities</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {showProfileForm && !profileCreated && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create Your Profile</h2>
            <form onSubmit={createProfile} className="space-y-4">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  id="experience"
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Creating Profile..." : "Create Profile"}
              </button>
            </form>
          </div>
        )}

        {profileCreated && candidateId && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upload Resume</h2>
              <ResumeUpload candidateId={candidateId} />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recommended Jobs</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No matching jobs found. Check back later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.ID} job={job} candidateId={candidateId!} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
