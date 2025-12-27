import api from "../api/client";
import { useState } from "react";

export default function ResumeUpload({ candidateId }: { candidateId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");

  const upload = async () => {
    if (!file) {
      setMessage("Please select a file");
      setUploadStatus("error");
      return;
    }

    // Validate file type
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      setMessage("Please upload a PDF or Word document");
      setUploadStatus("error");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");
      setUploadStatus(null);

      const formData = new FormData();
      formData.append("candidate_id", candidateId.toString());
      formData.append("resume", file);

      await api.post("/candidate/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Resume uploaded successfully!");
      setUploadStatus("success");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("resume-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to upload resume");
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Select Resume (PDF or Word Document)
        </label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <button
        onClick={upload}
        disabled={!file || isUploading}
        className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? "Uploading..." : "Upload Resume"}
      </button>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            uploadStatus === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
