import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";

type Job = {
  ID: number;
  Title: string;
  Skills: string;
  MinExperience: number;
  CompanyID?: number;
};

export default function CreateJobForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [minExp, setMinExp] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a job title");
      return;
    }

    if (!skills.trim()) {
      setError("Please enter required skills");
      return;
    }

    if (minExp < 0) {
      setError("Minimum experience must be a positive number");
      return;
    }

    try {
      setError("");
      setSuccess(false);
      setIsSubmitting(true);

      const res = await api.post("/job", {
        Title: title.trim(),
        Skills: skills.trim(),
        MinExperience: minExp,
        CompanyID: user?.ID,
      });

      setSuccess(true);
      
      // Note: Backend doesn't return job ID in response.
      // Companies will need to enter the job ID manually to view candidates.
      // In a production system, the backend should return the created job with ID.
      
      // Clear form
      setTitle("");
      setSkills("");
      setMinExp(0);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Job Posting</h2>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            id="job-title"
            type="text"
            placeholder="e.g., Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="job-skills" className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            id="job-skills"
            type="text"
            placeholder="e.g., JavaScript, React, Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="job-exp" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Experience (years)
          </label>
          <input
            id="job-exp"
            type="number"
            min="0"
            placeholder="0"
            value={minExp}
            onChange={(e) => setMinExp(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">Job created successfully!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating Job..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
