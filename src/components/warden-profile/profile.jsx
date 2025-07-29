"use client";


export default function WardenProfile() {
  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 flex flex-col">
      {/* Section Title with Red Line */}
      <div className="flex items-center ml-1 md:ml-2 mt-8 mb-5">
        <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
        <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-[#232323] select-none">
          Warden Profile
        </span>
      </div>

      {/* Flexible container for two cards */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mx-auto w-full max-w-7xl">
        {/* Profile Card */}
        <div className="bg-[#BEC5AD] rounded-2xl shadow-md flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl py-8 px-6">
          <div
            className="rounded-full bg-white overflow-hidden mb-6"
            style={{ width: 96, height: 96 }}
          >
            
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#232323] leading-snug">
            Nouman Khan
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mt-3 text-center break-words max-w-full px-4">
            Student ID: HFL001
          </p>
          <button className="mt-8 px-8 py-3 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow hover:bg-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A4B494]">
            Edit Profile
          </button>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col">
          {/* Green header */}
          <div className="bg-[#BEC5AD] rounded-t-2xl h-20 flex items-center justify-center px-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#232323] select-none whitespace-nowrap">
              Basic Information
            </h3>
          </div>

          {/* Information list */}
          <div className="flex flex-col gap-8 p-6 sm:p-10">
            {[
              { label: "First Name:", value: "Nouman" },
              { label: "Last Name:", value: "Khan" },
              { label: "Email Address:", value: "gawadechinmay01@gmail.com" },
              { label: "Warden ID:", value: "WDN001" },
              { label: "Phone No:", value: "9321625533" },
              { label: "Department:", value: "Student Affairs" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <span className="font-semibold text-gray-800 sm:w-1/3 break-words text-base sm:text-lg">
                  {label}
                </span>
                <span className="text-gray-900 sm:w-2/3 break-words mt-1 sm:mt-0 text-base sm:text-lg">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}