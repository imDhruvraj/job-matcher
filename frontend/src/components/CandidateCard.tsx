type Candidate = {
  ID: number;
  Skills: string;
  Experience: number;
  ResumePath?: string;
  UserID?: number;
};

export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Candidate Profile</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Experience:</span>
            <span className="ml-2 text-sm text-gray-900">{candidate.Experience} years</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {candidate.Skills.split(",").map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      {candidate.ResumePath && (
        <a
          href={`http://localhost:8080/${candidate.ResumePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Resume
        </a>
      )}

      {!candidate.ResumePath && (
        <p className="text-sm text-gray-500 italic">No resume uploaded</p>
      )}
    </div>
  );
}
