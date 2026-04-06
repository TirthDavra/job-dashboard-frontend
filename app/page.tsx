import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Job Platform
          </h1>
          <p className="text-lg text-gray-600">
            Connect job seekers with employers. Find your next opportunity or hire top talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              For Job Seekers
            </h2>
            <p className="text-gray-600 mb-4">
              Create your profile, browse jobs, and apply to positions that match your skills.
            </p>
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login as Candidate
              </Link>
              <Link
                href="/signup"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Up as Candidate
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              For Recruiters
            </h2>
            <p className="text-gray-600 mb-4">
              Post jobs, manage applications, and find the perfect candidates for your team.
            </p>
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Login as Recruiter
              </Link>
              <Link
                href="/signup"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Sign Up as Recruiter
              </Link>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            After logging in, you'll be automatically redirected to your role-specific dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
